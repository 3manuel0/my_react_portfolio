/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
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

interface OsSettingsValue {
  /** Invert (light-on-dark → dark-on-light) color mode. */
  invert: boolean;
  /** Current desktop wallpaper variant. */
  wallpaper: WallpaperId;
  /** CRT scanline overlay. */
  scanlines: boolean;
  setInvert: (v: boolean) => void;
  setWallpaper: (id: WallpaperId) => void;
  setScanlines: (v: boolean) => void;
}

const OsSettingsContext = createContext<OsSettingsValue | null>(null);

export function OsSettingsProvider({ children }: { children: ReactNode }) {
  const [invert, setInvertState] = useState(() => readBool(INVERT_KEY, false));
  const [wallpaper, setWallpaperState] = useState<WallpaperId>(readWallpaper);
  const [scanlines, setScanlinesState] = useState(() =>
    readBool(SCANLINES_KEY, true),
  );

  const setInvert = useCallback((v: boolean) => {
    setInvertState(v);
    persistBool(INVERT_KEY, v);
  }, []);

  const setWallpaper = useCallback((id: WallpaperId) => {
    setWallpaperState(id);
    globalThis.localStorage?.setItem(WALLPAPER_KEY, id);
  }, []);

  const setScanlines = useCallback((v: boolean) => {
    setScanlinesState(v);
    persistBool(SCANLINES_KEY, v);
  }, []);

  const value = useMemo(
    () => ({ invert, wallpaper, scanlines, setInvert, setWallpaper, setScanlines }),
    [invert, wallpaper, scanlines, setInvert, setWallpaper, setScanlines],
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