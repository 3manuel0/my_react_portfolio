import React, { useEffect, useRef, useState } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useOsSound } from "../../context/OsSoundContext";
import { APPS } from "../../data/appRegistry";
import { AppIcon } from "../AppIcons";
import ApplicationMenu from "./ApplicationMenu";
import Clock from "./Clock";

const Taskbar: React.FC = () => {
  const { windows, activeWindowId, focusWindow, minimizeWindow } =
    useWindowManager();
  const [menuOpen, setMenuOpen] = useState(false);

  const { volume, muted, setVolume, toggleMute, play } = useOsSound();
  const [volumeOpen, setVolumeOpen] = useState(false);
  const volRef = useRef<HTMLDivElement>(null);

  const volLevel = muted ? 0 : volume < 0.33 ? 1 : volume < 0.66 ? 2 : 3;

  useEffect(() => {
    if (!volumeOpen) return;
    const onClick = (e: MouseEvent) => {
      if (volRef.current && !volRef.current.contains(e.target as Node)) {
        setVolumeOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick, true);
    return () => window.removeEventListener("mousedown", onClick, true);
  }, [volumeOpen]);

  const handleAppClick = (id: string) => {
    if (activeWindowId === id) {
      minimizeWindow(id);
      return;
    }
    focusWindow(id);
  };

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 flex h-11 items-center gap-1 border-t border-os-border2 bg-os-surface/95 px-1.5 backdrop-blur"
      role="toolbar"
      aria-label="Taskbar"
    >
      {/* System menu button */}
      <button
        type="button"
        data-start-button
        aria-label="Open application menu"
        aria-expanded={menuOpen}
        onClick={() => {
          play("click");
          setMenuOpen((v) => !v);
        }}
        className={`flex h-9 shrink-0 items-center gap-1.5 border px-2.5 font-arcade text-[0.8rem] transition-colors ${
          menuOpen
            ? "border-os-accent bg-os-accent text-black"
            : "border-os-border2 bg-os-surface2 text-os-text hover:border-os-accent"
        }`}
      >
        <span className="text-base">3manuel</span>
      </button>

      {/* Open windows */}
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1" aria-live="polite">
        {windows
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((w) => {
            const desc = APPS[w.appId];
            const active = activeWindowId === w.id;
            return (
              <button
                key={w.id}
                type="button"
                aria-label={`${w.title}${active ? " (active)" : ""}${w.minimized ? " (minimized)" : ""}`}
                title={`${w.title}${active ? " — active" : ""}`}
                onClick={() => handleAppClick(w.id)}
                className={`flex min-w-0 max-w-[170px] shrink-0 items-center gap-1.5 border px-2 py-1.5 text-[0.66rem] transition-colors ${
                  active
                    ? "border-os-accent bg-os-accent/15 text-os-accent"
                    : w.minimized
                      ? "border-os-border bg-os-surface2/50 text-os-dim/70"
                      : "border-os-border bg-os-surface2 text-os-dim hover:border-os-border2 hover:text-os-text"
                }`}
              >
                <AppIcon name={desc.icon} size={15} />
                <span className="truncate">{w.title}</span>
              </button>
            );
          })}
      </div>

      {/* System tray */}
      <div className="flex shrink-0 items-center gap-2 border-l border-os-border px-2">
        <span className="hidden text-os-dim sm:block" title="Network: connected">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ shapeRendering: "crispEdges" }}>
            <path d="M1 11 L4 11 4 12 1 12 Z M10 11 L13 11 13 12 10 12 Z" fill="#9ece6a" opacity="0.5" />
            <path d="M4 9 L7 9 7 10 4 10 Z M7 9 L10 9 10 10 7 10 Z" fill="#9ece6a" opacity="0.7" />
            <path d="M5 7 L7 7 7 8 5 8 Z M7 7 L9 7 9 8 7 8 Z" fill="#9ece6a" />
          </svg>
        </span>
        <div ref={volRef} className="relative hidden sm:block">
          <button
            type="button"
            aria-label="Volume"
            aria-expanded={volumeOpen}
            onClick={() => setVolumeOpen((v) => !v)}
            className="flex items-center text-os-dim hover:text-os-accent"
            title={muted ? "Volume: muted" : `Volume: ${Math.round(volume * 100)}%`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ shapeRendering: "crispEdges" }}>
              <path d="M1 5 L4 5 8 2 8 12 L4 9 1 9 Z" fill="#7dcfff" />
              {volLevel >= 2 && <path d="M10 4 L11 4 11 10 10 10 Z" fill="#7dcfff" opacity="0.7" />}
              {volLevel >= 3 && <path d="M12 2 L13 2 13 12 12 12 Z" fill="#7dcfff" opacity="0.6" />}
              {volLevel === 0 && (
                <path d="M10 4 L13 10 M13 4 L10 10" stroke="#7dcfff" strokeWidth="1" fill="none" />
              )}
            </svg>
          </button>

          {volumeOpen && (
            <div className="menu-enter absolute bottom-full right-0 mb-2 w-44 border border-os-border2 bg-os-surface/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur">
              <p className="mb-2 font-mono text-[0.55rem] uppercase tracking-widest text-os-dim">
                master volume
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : Math.round(volume * 100)}
                  onChange={(e) => setVolume(+e.target.value / 100)}
                  aria-label="Volume slider"
                  className="h-1 w-full cursor-pointer accent-os-accent"
                />
                <span className="w-8 text-right font-mono text-[0.55rem] text-os-dim">
                  {muted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMute}
                className="mt-2 w-full border border-os-border px-2 py-1 text-[0.58rem] text-os-text hover:border-os-accent hover:text-os-accent"
              >
                {muted ? "unmute" : "mute"}
              </button>
            </div>
          )}
        </div>
        <span className="hidden items-center gap-1 text-[0.6rem] text-os-green md:flex" title="Status: online">
          <span className="crt-flicker inline-block h-1.5 w-1.5 bg-os-green" aria-hidden="true" />
          online
        </span>
      </div>

      <Clock />

      {menuOpen && (
        <ApplicationMenu onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
};

export default Taskbar;