import React from "react";
import { useOsMode } from "../../context/OsModeContext";
import { useOsSettings } from "../../context/OsSettingsContext";
import { useOsSound } from "../../context/OsSoundContext";

interface QuickSettingsProps {
  onClose: () => void;
}

const Tile: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ label, active, onClick, title, children }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={label}
    title={title}
    onClick={onClick}
    className={`phone-scale-enter flex h-[76px] w-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl text-[0.55rem] transition-colors ${
      active
        ? "bg-os-accent text-black"
        : "bg-white/10 text-white/85 hover:bg-white/15"
    }`}
    style={{ touchAction: "manipulation" }}
  >
    {children}
    <span>{label}</span>
  </button>
);

const QuickSettings: React.FC<QuickSettingsProps> = ({ onClose }) => {
  const { setOverride } = useOsMode();
  const {
    invert,
    setInvert,
    scanlines,
    setScanlines,
    wallpaper,
    setWallpaper,
  } = useOsSettings();
  const { volume, setVolume, muted, toggleMute } = useOsSound();

  const nextWallpaper = wallpaper === "tron" ? "synthwave" : "tron";

  return (
    <div
      className="phone-shade-enter absolute inset-x-0 top-0 z-40 pb-4 text-white"
      onClick={onClose}
      style={{
        background: "linear-gradient(to bottom, rgba(10,13,20,0.96), rgba(10,13,20,0.94))",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-white/25"
        aria-hidden="true"
      />
      <div
        className="grid grid-cols-4 justify-items-center gap-3 px-5 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Tile
          label="Scanlines"
          active={scanlines}
          onClick={() => setScanlines(!scanlines)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </Tile>

        <Tile label="Invert" active={invert} onClick={() => setInvert(!invert)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5 v17" />
            <path d="M12 12 l5 -5" />
          </svg>
        </Tile>

        <Tile label="Sound" active={!muted} onClick={toggleMute}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {muted ? (
              <path d="M17 9l4 6M21 9l-4 6" />
            ) : (
              <path d="M16 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12" />
            )}
          </svg>
        </Tile>

        <Tile
          label="Theme"
          active={wallpaper === "synthwave"}
          title={`Current wallpaper: ${wallpaper === "tron" ? "Neon Tron" : "Synthwave"}. Tap for ${nextWallpaper === "tron" ? "Neon Tron" : "Synthwave"}.`}
          onClick={() => setWallpaper(nextWallpaper)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <circle cx="8.5" cy="9" r="1.5" />
            <path d="M4 18l5-5 4 4 2.5-2.5L20 19" />
          </svg>
        </Tile>
      </div>

      <div
        className="mx-auto mt-4 w-[88%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-[0.55rem] uppercase tracking-widest text-white/60">
          Volume
        </div>
        <label className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-white/60">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
            {muted ? (
              <path d="M17 9l4 6M21 9l-4 6" />
            ) : (
              <path d="M16 8.5a5 5 0 0 1 0 7" />
            )}
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={muted ? 0 : Math.round(volume * 100)}
            aria-label="Volume"
            className="w-full"
            onChange={(e) => {
              const next = Number(e.target.value) / 100;
              setVolume(next);
              if (muted && next > 0) toggleMute();
            }}
          />
        </label>
      </div>

      <div
        className="mx-auto mt-4 w-[88%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOverride("desktop")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-[0.62rem] uppercase tracking-widest text-white/90 transition-colors hover:bg-white/15"
          style={{ touchAction: "manipulation" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="4" width="18" height="12" rx="1.5" />
            <path d="M8 20 h8 M12 16 v4" />
          </svg>
          Switch to Desktop OS
        </button>
      </div>

      <div className="mt-3 text-center text-[0.52rem] uppercase tracking-[0.3em] text-white/40">
        3manuelOS &middot; android build
      </div>
    </div>
  );
};

export default QuickSettings;
