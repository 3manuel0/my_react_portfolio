import React, { useCallback, useEffect, useRef, useState } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useOsMode, type OsModeOverride } from "../../context/OsModeContext";
import { useOsSettings } from "../../context/OsSettingsContext";
import { AppIcon } from "../AppIcons";
import {
  WALLPAPER_IDS,
  wallpaperLabel,
} from "../Desktop/Wallpaper";
import RmFakeTerminal from "./RmFakeTerminal";

interface MenuPos {
  x: number;
  y: number;
}

interface Item {
  label: string;
  active?: boolean;
  danger?: boolean;
  onPick: () => void;
}

const MENU_W = 250;
const MENU_H = 620;

type RmStage = "off" | "running" | "bsod";

const OsChrome: React.FC = () => {
  const { openApp } = useWindowManager();
  const { mode, override, setOverride } = useOsMode();
  const { invert, setInvert, wallpaper, setWallpaper } = useOsSettings();
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [rm, setRm] = useState<RmStage>("off");
  const [restarting, setRestarting] = useState(false);
  const [shutdown, setShutdown] = useState<"off" | "shutting" | "safe">("off");
  const [locked, setLocked] = useState(false);
  const [clock, setClock] = useState<number>(Date.now());

  const rmRef = useRef<RmStage>("off");
  useEffect(() => {
    rmRef.current = rm;
  }, [rm]);

  const close = useCallback(() => setPos(null), []);

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (rmRef.current !== "off") return;
      const x = Math.min(e.clientX, window.innerWidth - MENU_W - 6);
      const y = Math.min(e.clientY, window.innerHeight - MENU_H - 6);
      setPos({ x: Math.max(6, x), y: Math.max(6, y) });
    },
    []
  );

  const onOutside = useCallback(
    (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (pos === null) return;
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      const target = e.target as Node | null;
      if (target instanceof Element && target.closest("[data-context-menu]")) return;
      close();
    },
    [pos, close]
  );

  useEffect(() => {
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("mousedown", onOutside);
    window.addEventListener("touchstart", onOutside);
    window.addEventListener("keydown", onOutside);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("mousedown", onOutside);
      window.removeEventListener("touchstart", onOutside);
      window.removeEventListener("keydown", onOutside);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [onContextMenu, onOutside, close]);

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => setClock(Date.now()), 15000);
    return () => clearInterval(id);
  }, [locked]);

  const launch =
    (appId: "terminal" | "about" | "system") =>
    () => {
      openApp(appId);
      close();
    };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
    close();
  };

  const toggleInvert = () => {
    setInvert(!invert);
    close();
  };

  const sudoRm = () => {
    setRm("running");
    close();
  };

  const onRmFinished = () => {
    setRm("bsod");
    window.setTimeout(() => setRm("off"), 6500);
  };

  const lockNow = () => {
    setClock(Date.now());
    setLocked(true);
    close();
  };

  const doRestart = () => {
    close();
    setRestarting(true);
    window.setTimeout(() => window.location.reload(), 1500);
  };

  const doShutdown = () => {
    close();
    setShutdown("shutting");
    window.setTimeout(() => setShutdown("safe"), 2800);
  };

  const groups: { label?: string; items: Item[] }[] = [
    {
      label: "Open",
      items: [
        { label: "Terminal", onPick: launch("terminal") },
        { label: "About Me", onPick: launch("about") },
        { label: "System Info", onPick: launch("system") },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Refresh", onPick: () => window.location.reload() },
        { label: "Fullscreen", onPick: toggleFullscreen },
        ...WALLPAPER_IDS.map((id) => ({
          label: `Wallpaper: ${wallpaperLabel(id)}`,
          active: wallpaper === id,
          onPick: () => {
            setWallpaper(id);
            close();
          },
        })),
      ],
    },
    {
      label: "Fun",
      items: [
        { label: "Invert Colors", active: invert, onPick: toggleInvert },
        { label: "sudo rm -rf /", danger: true, onPick: sudoRm },
      ],
    },
    {
      label: "System",
      items: [
        { label: "Lock Screen", onPick: lockNow },
        { label: "Restart", onPick: doRestart },
        { label: "Shut Down", onPick: doShutdown },
      ],
    },
    {
      label: `Device Mode (now: ${mode === "phone" ? "phone" : "pc"})`,
      items: (["auto", "phone", "desktop"] as OsModeOverride[]).map((m) => ({
        label: m === "auto" ? "Auto (follow screen)" : m === "phone" ? "Phone (Android)" : "Desktop (PC)",
        active: override === m,
        onPick: () => {
          setOverride(m);
          close();
        },
      })),
    },
  ];

  return (
    <>
      {pos && (
        <div
          data-context-menu
          role="menu"
          aria-label="Context menu"
          onContextMenu={(e) => e.preventDefault()}
          className="menu-enter fixed z-[9998] w-[250px] border border-os-border2 bg-os-surface/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur"
          style={{ left: pos.x, top: pos.y }}
        >
          {groups.map((g) => (
            <div key={g.label} className="mb-1 last:mb-0">
              {g.label && (
                <p className="px-1.5 pb-1 pt-1 text-[0.55rem] uppercase tracking-widest text-os-dim">
                  {g.label}
                </p>
              )}
              {g.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={item.onPick}
                  className={`flex w-full items-center gap-2 px-1.5 py-1.5 text-left text-[0.68rem] transition-colors ${
                    item.danger
                      ? "text-os-red hover:bg-os-red/15"
                      : item.active
                        ? "text-os-green hover:bg-os-green/10"
                        : "text-os-text hover:bg-os-blue/10 hover:text-os-accent"
                  }`}
                >
                  {item.active && <span className="text-os-green">&#10003;</span>}
                  {item.danger && <span className="text-os-red">&#9888;</span>}
                  {!item.active && !item.danger && (
                    <span className="w-4 text-os-dim">&gt;</span>
                  )}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="mt-1 flex flex-wrap items-center gap-1.5 border-t border-os-border px-1.5 pb-0.5 pt-1.5 text-[0.55rem] text-os-dim">
            <AppIcon name="terminal" size={12} />
            3manuelOS ctx.v1
            <span className="ml-auto">ctrl+alt+&#8592;/&#8594; switch</span>
          </div>
        </div>
      )}

      {rm === "running" && <RmFakeTerminal onFinished={onRmFinished} />}

      {rm === "bsod" && (
        <div
          className="fixed inset-0 z-[10000] cursor-none select-none p-8 font-mono text-sm leading-7 text-white"
          style={{ background: "#0b3aa0" }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <p className="mb-6 text-5xl">:(</p>
          <p>
            The 3manuelOS ran out of trust and shut down to protect the
            filesystem's feelings.
          </p>
          <p>sudo rm -rf / found only love, stacks, and a fresh git clone.</p>
          <p className="mt-2 text-[0.8rem] opacity-80">
            Stop code: MACHINE_CHECK_EXCEPTION &#183; PC: 3MANUEL_FORGET
            (0x00000DEAD)
          </p>
          <p className="mt-6 text-[0.85rem]">
            This is a joke. Nothing was deleted. Rebooting in a few seconds...
          </p>
        </div>
      )}

      {locked && (
        <div
          className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-md"
          onClick={() => setLocked(false)}
          onContextMenu={(e) => {
            e.preventDefault();
            setLocked(false);
          }}
        >
          <AppIcon name="system" size={44} />
          <p className="font-arcade text-6xl text-os-text">
            {new Date(clock).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
          <p className="text-sm capitalize text-os-dim">
            {new Date(clock).toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-4 text-[0.6rem] uppercase tracking-widest text-os-dim">
            click anywhere to stay full stack
          </p>
        </div>
      )}

      {restarting && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 bg-os-bg">
          <AppIcon name="terminal" size={40} />
          <p className="font-arcade text-xl text-os-accent">3manuelOS</p>
          <p className="flex items-center gap-2 text-[0.7rem] text-os-dim">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-os-border2 border-t-os-accent" />
            restarting...
          </p>
        </div>
      )}

      {shutdown === "shutting" && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 bg-os-bg">
          <p className="font-arcade text-xl text-os-accent">3manuelOS</p>
          <p className="text-[0.7rem] text-os-dim">shutting down...</p>
        </div>
      )}

      {shutdown === "safe" && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-black">
          <p className="max-w-sm text-center text-xs leading-relaxed text-os-text">
            It is now safe to turn off your computer.
            <br />
            <span className="text-os-dim">
              (or click anywhere to power it back on)
            </span>
          </p>
          <button
            type="button"
            className="border border-os-border px-4 py-2 text-[0.65rem] text-os-accent hover:bg-os-accent/10"
            onClick={() => window.location.reload()}
          >
            power on
          </button>
        </div>
      )}
    </>
  );
};

export default OsChrome;