/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sfx, type SfxName } from "../audio/sfx";

const STORAGE_KEY = "3manuelos.volume";
const DEFAULT_VOLUME = 0.75;

function readVolume(): number {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (raw === null) return DEFAULT_VOLUME;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : DEFAULT_VOLUME;
}

interface OsSoundValue {
  /** Raw volume 0..1 (persisted). */
  volume: number;
  /** Whether audio is muted. */
  muted: boolean;
  /** Effective gain = muted ? 0 : volume.  Set audio element gain nodes to this. */
  gain: number;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  /** Trigger a synthesized UI sound effect (respects volume/mute). */
  play: (name: SfxName) => void;
}

const OsSoundContext = createContext<OsSoundValue | null>(null);

export function OsSoundProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(readVolume);
  const [muted, setMuted] = useState(false);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    globalThis.localStorage?.setItem(STORAGE_KEY, String(clamped));
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const gain = muted ? 0 : volume;

  // Keep sfx master gain in sync with the current volume setting.
  useEffect(() => {
    sfx.setVolume(gain);
  }, [gain]);

  // Unlock audio on the first user gesture (browsers require this).
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const play = useCallback((name: SfxName) => sfx.play(name), []);

  const value = useMemo(
    () => ({ volume, muted, gain, setVolume, toggleMute, play }),
    [volume, muted, gain, setVolume, toggleMute, play],
  );

  return (
    <OsSoundContext.Provider value={value}>{children}</OsSoundContext.Provider>
  );
}

export function useOsSound() {
  const ctx = useContext(OsSoundContext);
  if (!ctx) {
    throw new Error("useOsSound must be used within an OsSoundProvider");
  }
  return ctx;
}
