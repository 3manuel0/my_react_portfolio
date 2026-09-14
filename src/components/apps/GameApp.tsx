import React, { useEffect, useRef, useState } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useOsMode } from "../../context/OsModeContext";

const GAME_ASPECT_RATIO = 16 / 9;
const GAME_ORIGIN = "https://3manuel0.github.io/2dPlatformerGame/";

const SAVE_KEYS = ["playerX", "playerY", "cameraX", "hp"] as const;

interface WorkerMessage {
  type: string;
  message?: string;
  cmd?: string;
  src?: string;
  volume?: number;
  loop?: boolean;
  data?: Record<string, string>;
}

// Module-level state that survives React StrictMode mount/unmount cycles.
// The OffscreenCanvas is consumed once by postMessage (transferred), so we must
// never try to transfer it a second time. Keeping these at module scope means a
// StrictMode fake-unmount won't destroy them, and a re-mount simply reconnects.
let _worker: Worker | null = null;
let _onMessage: ((e: MessageEvent<WorkerMessage>) => void) | null = null;
let _onError: ((e: ErrorEvent) => void) | null = null;
let _audio: HTMLAudioElement | null = null;
let _gestureArmed = false;
let _gestureBound = false;
let _gameSession = false;
let _pendingKillTimer: number | null = null;
// The canvas DOM element that was last transferred. StrictMode reuses the same
// element across mount→cleanup→remount, so we can detect it by identity.
let _transferredCanvas: HTMLCanvasElement | null = null;

const GameApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported] = useState(
    () => typeof window !== "undefined" && "OffscreenCanvas" in window,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const { windows, activeWindowId } = useWindowManager();
  const gameWindow = windows.find((w) => w.appId === "game");
  const gameActive = !!gameWindow && activeWindowId === gameWindow.id;
  const activeRef = useRef(gameActive);
  activeRef.current = gameActive;

  const { mode: osMode } = useOsMode();
  const isPhone = osMode === "phone";

  // Boot the worker exactly once per canvas element.
  // StrictMode reuses the same <canvas> DOM node across mount→cleanup→remount,
  // so we detect it by identity: same canvas + alive worker = skip.
  // A new canvas means the user closed and reopened the game → restart.
  useEffect(() => {
    if (!supported) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // StrictMode remount: same canvas, worker still alive → skip.
    // React runs mount→cleanup→remount SYNCHRONOUSLY, so the pending kill
    // timer (set in cleanup) hasn't fired yet — cancel it and keep the session.
    if (canvas === _transferredCanvas && _worker) {
      if (_pendingKillTimer != null) {
        window.clearTimeout(_pendingKillTimer);
        _pendingKillTimer = null;
      }
      _gameSession = true;
      // Audio was paused by cleanup — re-arm so next gesture resumes playback.
      if (_audio && _audio.paused) _gestureArmed = true;
      return;
    }

    // Real reopen: clean up any stale worker/timer from the previous session.
    if (_pendingKillTimer != null) {
      window.clearTimeout(_pendingKillTimer);
      _pendingKillTimer = null;
    }
    if (_worker) {
      _worker.terminate();
      _worker = null;
      _onMessage = null;
      _onError = null;
    }

    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      console.error("[GameApp] transferControlToOffscreen failed");
      setStatus("error");
      return;
    }
    _transferredCanvas = canvas;

    let worker: Worker;
    try {
      worker = new Worker("/game-worker.js?v=5");
    } catch {
      console.error("[GameApp] could not create game worker");
      setStatus("error");
      return;
    }

    // Audio element owned by the main thread (the worker only relays changes).
    if (!_audio) {
      _audio = new Audio();
      _audio.preload = "auto";
    }

    const absoluteSrc = (src: string) =>
      src.startsWith("http") ? src : GAME_ORIGIN + src.replace(/^\.\//, "");

    _onMessage = (e: MessageEvent<WorkerMessage>) => {
      const d = e.data;
      if (!d) return;
      if (d.type === "ready") {
        setStatus("ready");
        const saved: Record<string, string> = {};
        for (const key of SAVE_KEYS) {
          const v = window.localStorage?.getItem(key);
          if (v != null) saved[key] = v;
        }
        _worker?.postMessage({ type: "save-data", data: saved });
        return;
      }
      if (d.type === "error") {
        console.error("[GameApp] worker reported error:", d.message);
        setStatus("error");
        return;
      }
      if (d.type === "audio") {
        // Never act on audio after the game window closed. The worker can
        // linger for a tick, and the game C code re-calls LoadMusicStream on
        // death/level-change/restart, which would otherwise resurrect playback
        // outside the window. Hard-stop instead.
        if (!_gameSession) {
          _audio?.pause();
          return;
        }
        if (!_audio) return;
        switch (d.cmd) {
          case "load":
            if (d.src) _audio.src = absoluteSrc(d.src);
            break;
          case "play":
            if (_audio.src) {
              _audio.play().catch((err) => {
                _gestureArmed = true;
                if (err?.name !== "NotAllowedError")
                  console.warn("[GameApp] audio play:", err);
              });
            }
            break;
          case "volume":
            // The game races SetMasterVolume(0.04) every frame ≈ 4% — that's
            // effectively inaudible on phone/laptop speakers. Clamp to an
            // audible floor while keeping the game's own fading below 1.
            _audio.volume = Math.min(1, Math.max(0.2, d.volume ?? 1));
            break;
          case "loop":
            _audio.loop = !!d.loop;
            break;
          case "pause":
            _audio.pause();
            break;
        }
        return;
      }
      if (d.type === "save" && d.data) {
        try {
          for (const key of SAVE_KEYS) {
            const v = d.data[key];
            if (v != null) window.localStorage?.setItem(key, v);
          }
        } catch (err) {
          console.warn("[GameApp] could not save game data:", err);
        }
      }
    };
    _onError = (ev: ErrorEvent) => {
      console.error("[GameApp] worker error:", ev.message, ev.filename, ev.lineno);
      setStatus("error");
    };

    worker.addEventListener("message", _onMessage);
    worker.addEventListener("error", _onError);
    worker.postMessage({ type: "canvas", canvas: offscreen }, [offscreen]);
    _worker = worker;
    _gameSession = true;

    return () => {
      _gameSession = false;
      // Pause audio on unmount. Don't null _audio or remove its src —
      // StrictMode's remount needs the element alive so the message
      // handler can still reach it.
      if (_audio) _audio.pause();
      // Terminate the worker AFTER the current task so React StrictMode's
      // synchronous remount can cancel it (see the remount branch above).
      // On a real close no remount happens, the timer fires, the worker
      // dies, and the background game can no longer resurrect the music via
      // new LoadMusicStream calls. A real reopen boots a fresh worker.
      _pendingKillTimer = window.setTimeout(() => {
        if (_worker) {
          _worker.terminate();
          _worker = null;
          _onMessage = null;
          _onError = null;
        }
        _pendingKillTimer = null;
      }, 0);
    };
  }, [supported]);

  // Unblock audio on the first real user gesture (mobile autoplay policy).
  useEffect(() => {
    if (_gestureBound || typeof window === "undefined") return;
    _gestureBound = true;
    const resume = () => {
      // Only resume while the game window is actually open.
      if (_gameSession && _gestureArmed && _audio) {
        _audio.play().catch(() => {});
        _gestureArmed = false;
      }
    };
    window.addEventListener("pointerdown", resume, { capture: true });
    window.addEventListener("keydown", resume, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", resume, { capture: true });
      window.removeEventListener("keydown", resume, { capture: true });
    };
  }, []);

  // Fit a 16:9 canvas inside the window and tell the worker the CSS size
  // (needed to map mouse coordinates into the game's logical space)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const fit = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      let cw = w;
      let ch = w / GAME_ASPECT_RATIO;
      if (ch > h) {
        ch = h;
        cw = h * GAME_ASPECT_RATIO;
      }
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      _worker?.postMessage({ type: "resize", width: cw, height: ch });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [supported]);

  // Forward keyboard input to the worker while the game window is focused
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.key.startsWith("F")) {
        e.preventDefault();
      }
      _worker?.postMessage({ type: "keydown", code: e.code, key: e.key });
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      _worker?.postMessage({ type: "keyup", code: e.code, key: e.key });
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Forward mouse input relative to the displayed canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rel = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const { x, y } = rel(e);
      _worker?.postMessage({ type: "mousedown", button: e.button, x, y });
    };
    const onMove = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const { x, y } = rel(e);
      _worker?.postMessage({ type: "mousemove", x, y });
    };
    const onUp = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const { x, y } = rel(e);
      _worker?.postMessage({ type: "mouseup", button: e.button, x, y });
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Drive the worker's game loop from the main thread's real
  // requestAnimationFrame — vsync-aligned, matching the monitor's refresh
  // rate with no setTimeout jitter. One tick = one game frame.
  useEffect(() => {
    if (!supported || status !== "ready") return;
    let raf: number;
    const tick = (t: number) => {
      _worker?.postMessage({ type: "tick", timestamp: t });
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [supported, status]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{ imageRendering: "pixelated" }}
        aria-label="2D Platformer game canvas"
      />

      {!supported && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[0.72rem] text-os-dim">
          This browser doesn&rsquo;t support OffscreenCanvas, so the game can&rsquo;t run here.
        </div>
      )}

      {supported && status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-os-dim">
            <span className="inline-block h-3 w-3 animate-spin border border-os-accent border-t-transparent" aria-hidden="true" />
            <span className="text-[0.68rem]">
              {status === "error" ? "failed to load game" : "loading game.wasm..."}
            </span>
          </div>
        </div>
      )}

      {isPhone && status === "ready" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-4 pt-8">
          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              aria-label="Move left"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-2xl font-bold text-white/80 select-none touch-none active:bg-white/20"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                _worker?.postMessage({ type: "keydown", code: "ArrowLeft", key: "ArrowLeft" });
              }}
              onPointerUp={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowLeft", key: "ArrowLeft" })
              }
              onPointerCancel={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowLeft", key: "ArrowLeft" })
              }
              onPointerLeave={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowLeft", key: "ArrowLeft" })
              }
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Move right"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-2xl font-bold text-white/80 select-none touch-none active:bg-white/20"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                _worker?.postMessage({ type: "keydown", code: "ArrowRight", key: "ArrowRight" });
              }}
              onPointerUp={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowRight", key: "ArrowRight" })
              }
              onPointerCancel={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowRight", key: "ArrowRight" })
              }
              onPointerLeave={() =>
                _worker?.postMessage({ type: "keyup", code: "ArrowRight", key: "ArrowRight" })
              }
            >
              →
            </button>
          </div>
          <button
            type="button"
            aria-label="Jump"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-xl font-bold text-white/80 select-none touch-none active:bg-white/20"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              _worker?.postMessage({ type: "keydown", code: "Space", key: " " });
            }}
            onPointerUp={() =>
              _worker?.postMessage({ type: "keyup", code: "Space", key: " " })
            }
            onPointerCancel={() =>
              _worker?.postMessage({ type: "keyup", code: "Space", key: " " })
            }
            onPointerLeave={() =>
              _worker?.postMessage({ type: "keyup", code: "Space", key: " " })
            }
          >
            A
          </button>
        </div>
      )}
    </div>
  );
};

export default GameApp;