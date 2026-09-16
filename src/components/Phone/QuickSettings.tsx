import React, { useState } from "react";
import { useOsMode } from "../../context/OsModeContext";
import { useOsSettings } from "../../context/OsSettingsContext";

interface QuickSettingsProps {
  onClose: () => void;
}

interface TileState {
  wifi: boolean;
  bluetooth: boolean;
  airplane: boolean;
  flashlight: boolean;
  rotation: boolean;
}

interface QuickSettingsState {
  tiles: TileState;
}

const Tile: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, active, onClick, children }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={label}
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
  const { invert, setInvert } = useOsSettings();
  const [tiles, setTiles] = useState<QuickSettingsState["tiles"]>({
    wifi: true,
    bluetooth: false,
    airplane: false,
    flashlight: false,
    rotation: true,
  });
  const [brightness, setBrightness] = useState(70);

  const toggle = (key: keyof TileState) =>
    setTiles((t) => ({ ...t, [key]: !t[key] }));

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
        <Tile label="WiFi" active={tiles.wifi} onClick={() => toggle("wifi")}>
          <svg width="20" height="16" viewBox="0 0 14 10" fill="currentColor" aria-hidden="true">
            <path d="M7 8.5 a1.3 1.3 0 1 1 0 0.001 Z" />
            <path d="M4.2 6.4 a4 4 0 0 1 5.6 0 l-0.9 1 a2.6 2.6 0 0 0 -3.8 0 Z" />
            <path d="M1.6 3.8 a7 7 0 0 1 10.8 0 l-0.9 1 a5.6 5.6 0 0 0 -9 0 Z" />
          </svg>
        </Tile>
        <Tile label="Bluetooth" active={tiles.bluetooth} onClick={() => toggle("bluetooth")}>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 19 L14 13.5 L8 7.5 L2 13.5 Z" />
            <path d="M2 6.5 L8 12.5 L14 6.5 L8 0.8 Z" />
          </svg>
        </Tile>
        <Tile label="Airplane" active={tiles.airplane} onClick={() => toggle("airplane")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21 16 v-2 l-8 -5 V3 a1 1 0 0 0 -2 0 v6 l-8 5 v2 l8 -3 v5.2 L8 20 v2 l4 -1 4 1 v-2 l-3 -1.8 V13 Z" />
          </svg>
        </Tile>
        <Tile label="Flashlight" active={tiles.flashlight} onClick={() => toggle("flashlight")}>
          <svg width="18" height="20" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 9 h12 l-2.5 -6 a1 1 0 0 0 -0.9 -0.6 h-5.2 a1 1 0 0 0 -0.9 0.6 Z" />
            <path d="M5 9 v10 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2 -2 V9" />
            <rect x="9" y="12" width="4" height="6" fill="currentColor" stroke="none" />
          </svg>
        </Tile>

        <Tile label="Rotation" active={tiles.rotation} onClick={() => toggle("rotation")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="7" width="14" height="12" rx="1.5" />
            <path d="M17 11 h4 v1 a5 5 0 0 1 -4 4.9" />
            <path d="M17 8 a3.2 3.2 0 0 0 0 6" />
          </svg>
        </Tile>

        <Tile label="Invert" active={invert} onClick={() => setInvert(!invert)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5 v17" />
            <path d="M12 12 l5 -5" />
          </svg>
        </Tile>
      </div>

      <div
        className="mx-auto mt-4 w-[88%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-[0.55rem] uppercase tracking-widest text-white/60">
          Brightness
        </div>
        <label className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-white/60">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3 M4.9 4.9 l2.1 2.1 M17 17 l2.1 2.1 M19.1 4.9 L17 7 M7 17 l-2.1 2.1" />
          </svg>
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            aria-label="Brightness"
            className="w-full"
            onChange={(e) => setBrightness(Number(e.target.value))}
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