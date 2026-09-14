import React, { useEffect, useRef, useState } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";

const GAME_ASPECT_RATIO = 16 / 9;

interface WorkerMessage {
  type: string;
  message?: string;
}

// Module-level state that survives React StrictMode mount/unmount cycles.
// The OffscreenCanvas is consumed once by postMessage (transferred), so we must
// never try to transfer it a second time. Keeping these at module scope means a
// StrictMode fake-unmount won't destroy them, and a re-mount simply reconnects.
let _worker: Worker | null = null;
let _onMessage: ((e: MessageEvent<WorkerMessage>) => void) | null = null;
let _onError: ((e: ErrorEvent) => void) | null = null;

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

  // Boot the worker exactly once (module-level guard skips StrictMode re-mounts).
  // No cleanup function — the worker lives until page unload. This avoids the
  // "Cannot clone OffscreenCanvas that is already transferred" error that occurs
  // when StrictMode tries to re-transfer the consumed OffscreenCanvas.
  useEffect(() => {
    if (!supported || _worker) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let offscreen: OffscreenCanvas;
    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch {
      console.error("[GameApp] transferControlToOffscreen failed");
      setStatus("error");
      return;
    }

    let worker: Worker;
    try {
      worker = new Worker("/game-worker.js?v=3");
    } catch {
      console.error("[GameApp] could not create game worker");
      setStatus("error");
      return;
    }

    _onMessage = (e: MessageEvent<WorkerMessage>) => {
      if (e.data?.type === "ready") setStatus("ready");
      if (e.data?.type === "error") {
        console.error("[GameApp] worker reported error:", e.data.message);
        setStatus("error");
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
  }, [supported]);

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
    </div>
  );
};

export default GameApp;