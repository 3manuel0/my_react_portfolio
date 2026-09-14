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

export type OsModeOverride = "auto" | "phone" | "desktop";
export type OsMode = "phone" | "desktop";

const STORAGE_KEY = "3manuelos.mode";

const PHONE_QUERY = "(max-width: 820px)";

function readOverride(): OsModeOverride {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
  return raw === "phone" || raw === "desktop" ? raw : "auto";
}

function detectAuto(): OsMode {
  const narrow = globalThis.matchMedia?.(PHONE_QUERY)?.matches ?? false;
  const coarse =
    globalThis.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const fineWidth = globalThis.innerWidth ?? window.innerWidth;
  // Touch devices under ~1000px, or any viewport narrower than a phone, go phone.
  return narrow || (coarse && fineWidth < 1024) ? "phone" : "desktop";
}

interface OsModeContextValue {
  mode: OsMode;
  override: OsModeOverride;
  setOverride: (next: OsModeOverride) => void;
}

const OsModeContext = createContext<OsModeContextValue | null>(null);

export function OsModeProvider({ children }: { children: ReactNode }) {
  const [override, setOverrideState] = useState<OsModeOverride>(readOverride);
  const [auto, setAuto] = useState<OsMode>(detectAuto);

  useEffect(() => {
    const mq = globalThis.matchMedia?.(PHONE_QUERY);
    if (!mq) return;
    const onChange = () => setAuto(detectAuto());
    mq.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  const setOverride = useCallback((next: OsModeOverride) => {
    setOverrideState(next);
    globalThis.localStorage?.setItem(STORAGE_KEY, next);
  }, []);

  const mode: OsMode = override === "auto" ? auto : override;

  const value = useMemo(
    () => ({ mode, override, setOverride }),
    [mode, override, setOverride],
  );

  return (
    <OsModeContext.Provider value={value}>{children}</OsModeContext.Provider>
  );
}

export function useOsMode() {
  const ctx = useContext(OsModeContext);
  if (!ctx) {
    throw new Error("useOsMode must be used within an OsModeProvider");
  }
  return ctx;
}