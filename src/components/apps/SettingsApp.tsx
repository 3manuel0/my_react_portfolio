import React from "react";
import { useOsMode, type OsModeOverride } from "../../context/OsModeContext";
import { useOsSettings } from "../../context/OsSettingsContext";
import { useOsSound } from "../../context/OsSoundContext";
import { WALLPAPER_IDS, wallpaperLabel } from "../Desktop/Wallpaper";

/* ---------- tiny building blocks ---------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="border-b border-os-border px-4 py-3.5 last:border-b-0">
    <h2 className="mb-3 font-arcade text-[0.95rem] text-os-accent">{title}</h2>
    <div className="flex flex-col gap-3">{children}</div>
  </section>
);

const Row: React.FC<{ label: string; desc: string; children: React.ReactNode }> = ({
  label,
  desc,
  children,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-[0.75rem] text-os-text">{label}</p>
      <p className="text-[0.62rem] text-os-dim">{desc}</p>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-5 w-10 rounded-full border transition-colors ${
      checked
        ? "border-os-green bg-os-green/25"
        : "border-os-border2 bg-os-blue/15"
    }`}
  >
    <span
      className={`absolute top-[3px] block h-3.5 w-3.5 rounded-full transition-all ${
        checked
          ? "left-[22px] bg-os-green"
          : "left-[3px] bg-os-dim"
      }`}
    />
  </button>
);

/* ---------- wallpaper preview thumbnails ---------- */

const TronThumb: React.FC = () => (
  <svg viewBox="0 0 40 26" className="h-[26px] w-10" aria-hidden="true">
    <defs>
      <radialGradient id="settingsTron" cx="50%" cy="30%" r="90%">
        <stop offset="0%" stopColor="#14243a" />
        <stop offset="60%" stopColor="#0c1322" />
        <stop offset="100%" stopColor="#070a12" />
      </radialGradient>
    </defs>
    <rect width="40" height="26" fill="url(#settingsTron)" />
    {[8, 16, 24, 32].map((x) => (
      <line key={x} x1={x} y1="0" x2={x} y2="26" stroke="#5eead4" strokeWidth="0.7" opacity="0.4" />
    ))}
    {[6, 12, 18].map((y) => (
      <line key={y} x1="0" y1={y} x2="40" y2={y} stroke="#5eead4" strokeWidth="0.7" opacity="0.4" />
    ))}
  </svg>
);

const SynthThumb: React.FC = () => (
  <svg viewBox="0 0 40 26" className="h-[26px] w-10" aria-hidden="true">
    <defs>
      <linearGradient id="settingsSynth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14102e" />
        <stop offset="50%" stopColor="#3a1a4d" />
        <stop offset="85%" stopColor="#b3346b" />
        <stop offset="100%" stopColor="#ff7b54" />
      </linearGradient>
    </defs>
    <rect width="40" height="26" fill="url(#settingsSynth)" />
    <circle cx="20" cy="8" r="5" fill="#ffd93d" />
    <rect y="16" width="40" height="10" fill="#0a0620" />
    {[18, 21, 24].map((y) => (
      <line key={y} x1="0" y1={y} x2="40" y2={y} stroke="#5eead4" strokeWidth="0.7" opacity="0.8" />
    ))}
    {[8, 16, 24, 32].map((x) => (
      <line key={x} x1={x} y1="16" x2={x} y2="26" stroke="#5eead4" strokeWidth="0.7" opacity="0.6" />
    ))}
  </svg>
);

const WALLPAPER_THUMBS: Record<string, React.FC> = {
  tron: TronThumb,
  synthwave: SynthThumb,
};

/* ---------- the app ---------- */

const SettingsApp: React.FC = () => {
  const { invert, setInvert, wallpaper, setWallpaper, scanlines, setScanlines } =
    useOsSettings();
  const { volume, setVolume, muted, toggleMute, sfxEnabled, toggleSfx, play } =
    useOsSound();
  const { mode, override, setOverride } = useOsMode();

  return (
    <div className="h-full w-full overflow-y-auto bg-os-bg font-mono">
      <div className="flex items-center gap-3 border-b border-os-border bg-os-surface/60 px-4 py-2.5">
        <span className="grid h-8 w-8 place-items-center border border-os-border2 bg-os-bg text-[0.6rem] text-os-dim">
          {"{ }"}
        </span>
        <div>
          <p className="text-[0.8rem] leading-tight">
            Control Panel
            <span className="text-os-dim">.exe</span>
          </p>
          <p className="text-[0.6rem] text-os-dim">
            tune your 3manuelOS experience
          </p>
        </div>
      </div>

      <Section title="Appearance">
        <div>
          <p className="mb-2 text-[0.75rem] text-os-text">Wallpaper</p>
          <div className="flex gap-2.5">
            {WALLPAPER_IDS.map((id) => {
              const Thumb = WALLPAPER_THUMBS[id];
              const active = wallpaper === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setWallpaper(id);
                    play("click");
                  }}
                  aria-pressed={active}
                  aria-label={`Wallpaper: ${wallpaperLabel(id)}`}
                  className={`flex flex-col items-center gap-1.5 rounded border p-2 transition-colors ${
                    active
                      ? "border-os-accent bg-os-accent/10"
                      : "border-os-border2 bg-os-bg hover:border-os-border hover:bg-os-surface"
                  }`}
                >
                  <Thumb />
                  <span
                    className={`text-[0.6rem] ${active ? "text-os-accent" : "text-os-dim"}`}
                  >
                    {active ? "\u2713 " : ""}
                    {wallpaperLabel(id)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Row label="Light Mode" desc={invert ? "light colors active" : "dark colors active"}>
          <Toggle checked={invert} onChange={() => { setInvert(!invert); play("click"); }} label="Light mode" />
        </Row>

        <Row label="CRT Scanlines" desc="retro screen overlay">
          <Toggle checked={scanlines} onChange={() => { setScanlines(!scanlines); play("click"); }} label="CRT scanlines" />
        </Row>
      </Section>

      <Section title="Audio">
        <Row label="Volume" desc={`master gain ${Math.round(volume * 100)}%`}>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            aria-label="Volume"
            className="w-36"
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
          />
        </Row>
        <Row label="Mute" desc={muted ? "audio is silenced" : "audio is audible"}>
          <Toggle checked={muted} onChange={() => { toggleMute(); play("click"); }} label="Mute audio" />
        </Row>
        <Row label="UI Sounds" desc="window / click sound effects">
          <Toggle checked={sfxEnabled} onChange={toggleSfx} label="UI sound effects" />
        </Row>
      </Section>

      <Section title="Device Mode">
        <div className="flex flex-col gap-1.5">
          {(["auto", "phone", "desktop"] as OsModeOverride[]).map((m) => {
            const active = override === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setOverride(m);
                  play("click");
                }}
                aria-pressed={active}
                className={`flex items-center gap-2.5 rounded border px-3 py-2 text-left text-[0.7rem] transition-colors ${
                  active
                    ? "border-os-green bg-os-green/10 text-os-green"
                    : "border-os-border2 bg-os-bg text-os-text hover:bg-os-surface"
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    active ? "bg-os-green" : "bg-os-border2"
                  }`}
                />
                {m === "auto"
                  ? "Auto (follow screen)"
                  : m === "phone"
                    ? "Phone (Android)"
                    : "Desktop (PC)"}
                {m === "auto" && (
                  <span className="ml-auto text-[0.58rem] text-os-dim">
                    ({mode})
                  </span>
                )}
              </button>
            );
          })}
          <p className="mt-1 text-[0.6rem] text-os-dim">
            currently rendering:{" "}
            <span className="text-os-accent">
              {mode === "phone" ? "phone shell" : "desktop shell"}
            </span>
          </p>
        </div>
      </Section>

      <div className="px-4 py-2 text-center text-[0.58rem] uppercase tracking-[0.25em] text-os-dim">
        3manuelOS settings v1.0 &middot; saved to localStorage
      </div>
    </div>
  );
};

export default SettingsApp;