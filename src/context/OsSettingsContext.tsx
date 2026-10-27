/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  WALLPAPER_IDS,
  type WallpaperId,
} from "../components/Desktop/Wallpaper";

const INVERT_KEY = "3manuelos.invert";
const WALLPAPER_KEY = "3manuelos.wallpaper";
const SCANLINES_KEY = "3manuelos.scanlines";
const ACCENT_KEY = "3manuelos.accent";

/** Theme accent palettes — drive --os-accent / --os-accent2 CSS variables. */
export const ACCENTS = [
  { id: "cyan", label: "Cyan", swatch: "#5eead4", value: ["94 234 212", "77 208 184"] },
  { id: "teal", label: "Teal", swatch: "#2dd4bf", value: ["45 212 191", "20 184 166"] },
  { id: "blue", label: "Blue", swatch: "#60a5fa", value: ["96 165 250", "59 130 246"] },
  { id: "purple", label: "Purple", swatch: "#c084fc", value: ["192 132 252", "168 85 247"] },
  { id: "pink", label: "Pink", swatch: "#f472b6", value: ["244 114 182", "236 72 153"] },
  { id: "red", label: "Red", swatch: "#f87171", value: ["248 113 113", "239 68 68"] },
  { id: "orange", label: "Orange", swatch: "#fb923c", value: ["251 146 60", "245 158 11"] },
  { id: "green", label: "Green", swatch: "#a3e635", value: ["163 230 53", "132 204 22"] },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

function readBool(key: string, def: boolean): boolean {
  const raw = globalThis.localStorage?.getItem(key);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return def;
}

function persistBool(key: string, value: boolean): void {
  globalThis.localStorage?.setItem(key, value ? "1" : "0");
}

function readWallpaper(): WallpaperId {
  const stored = globalThis.localStorage?.getItem(WALLPAPER_KEY);
  return (WALLPAPER_IDS as string[]).includes(stored ?? "")
    ? (stored as WallpaperId)
    : "tron";
}

function readAccent(): AccentId {
  const stored = globalThis.localStorage?.getItem(ACCENT_KEY);
  return (ACCENTS as readonly { id: string }[]).some((a) => a.id === stored)
    ? (stored as AccentId)
    : "cyan";
}

interface OsSettingsValue {
  /** Invert (light-on-dark → dark-on-light) color mode. */
  invert: boolean;
  /** Current desktop wallpaper variant. */
  wallpaper: WallpaperId;
  /** CRT scanline overlay. */
  scanlines: boolean;
  /** Current accent palette id. */
  accent: AccentId;
  setInvert: (v: boolean) => void;
  setWallpaper: (id: WallpaperId) => void;
  setScanlines: (v: boolean) => void;
  setAccent: (id: AccentId) => void;
}

const OsSettingsContext = createContext<OsSettingsValue | null>(null);

export function OsSettingsProvider({ children }: { children: ReactNode }) {
  const [invert, setInvertState] = useState(() => readBool(INVERT_KEY, false));
  const [wallpaper, setWallpaperState] = useState<WallpaperId>(readWallpaper);
  const [scanlines, setScanlinesState] = useState(() =>
    readBool(SCANLINES_KEY, true),
  );
  const [accent, setAccentState] = useState<AccentId>(readAccent);

  // Apply the accent palette to the CSS variables (before paint, no flash).
  useLayoutEffect(() => {
    const palette = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0];
    const root = document.documentElement.style;
    root.setProperty("--os-accent", palette.value[0]);
    root.setProperty("--os-accent2", palette.value[1]);
  }, [accent]);

  const setInvert = useCallback((v: boolean) => {
    setInvertState(v);
  }, []);

  const setWallpaper = useCallback((id: WallpaperId) => {
    setWallpaperState(id);
  }, []);

  const setScanlines = useCallback((v: boolean) => {
    setScanlinesState(v);
  }, []);

  const setAccent = useCallback((id: AccentId) => {
    setAccentState(id);
  }, []);

  useEffect(() => {
    persistBool(INVERT_KEY, invert);
  }, [invert]);
  useEffect(() => {
    globalThis.localStorage?.setItem(WALLPAPER_KEY, wallpaper);
  }, [wallpaper]);
  useEffect(() => {
    persistBool(SCANLINES_KEY, scanlines);
  }, [scanlines]);
  useEffect(() => {
    globalThis.localStorage?.setItem(ACCENT_KEY, accent);
  }, [accent]);

  const value = useMemo(
    () => ({
      invert,
      wallpaper,
      scanlines,
      accent,
      setInvert,
      setWallpaper,
      setScanlines,
      setAccent,
    }),
    [invert, wallpaper, scanlines, accent, setInvert, setWallpaper, setScanlines, setAccent],
  );

  return (
    <OsSettingsContext.Provider value={value}>
      {children}
    </OsSettingsContext.Provider>
  );
}

export function useOsSettings() {
  const ctx = useContext(OsSettingsContext);
  if (!ctx) {
    throw new Error("useOsSettings must be used within an OsSettingsProvider");
  }
  return ctx;
}