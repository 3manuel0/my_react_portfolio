/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { APPS, type AppId } from "../data/appRegistry";

export const TASKBAR_HEIGHT = 44;
export const WINDOW_MARGIN = 12;

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowManagerContextValue {
  windows: WindowInstance[];
  activeWindowId: string | null;
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  isAppOpen: (appId: AppId) => boolean;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null,
);

function getOpenGeometry(appId: AppId, index: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const def = APPS[appId].defaultSize;
  const width = Math.min(def.width, vw - WINDOW_MARGIN * 2);
  const height = Math.min(def.height, vh - TASKBAR_HEIGHT - WINDOW_MARGIN * 2);
  const baseX = Math.max(WINDOW_MARGIN, Math.round((vw - width) / 2));
  const baseY = Math.max(
    WINDOW_MARGIN,
    Math.round((vh - TASKBAR_HEIGHT - height) / 2),
  );
  const offset = (index % 6) * 28;
  if (vw < 640) {
    return {
      x: WINDOW_MARGIN,
      y: WINDOW_MARGIN,
      width: vw - WINDOW_MARGIN * 2,
      height: vh - TASKBAR_HEIGHT - WINDOW_MARGIN * 2,
    };
  }
  return {
    x: baseX + offset,
    y: baseY + offset,
    width,
    height,
  };
}

const APPS_BY_ID = Object.keys(APPS) as AppId[];

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const windowsRef = useRef<WindowInstance[]>([]);
  const zCounter = useRef(2);
  const openCount = useRef(0);

  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1;
    const next = zCounter.current;
    setActiveWindowId(id);
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: next } : w,
      ),
    );
  }, []);

  const openApp = useCallback(
    (appId: AppId) => {
      const existing = windowsRef.current.find((w) => w.appId === appId);
      if (existing) {
        setWindows((ws) =>
          ws.map((w) =>
            w.id === existing.id ? { ...w, minimized: false } : w,
          ),
        );
        focusWindow(existing.id);
        return;
      }
      const geo = getOpenGeometry(appId, openCount.current);
      openCount.current += 1;
      zCounter.current += 1;
      const id = `${appId}-${openCount.current}`;
      const newWindow: WindowInstance = {
        id,
        appId,
        title: APPS[appId].title,
        ...geo,
        zIndex: zCounter.current,
        minimized: false,
        maximized: false,
      };
      setWindows((ws) =>
        ws.some((w) => w.appId === appId) ? ws : [...ws, newWindow],
      );
      if (!windowsRef.current.some((w) => w.appId === appId)) {
        windowsRef.current = [...windowsRef.current, newWindow];
        setActiveWindowId(id);
        globalThis.history?.replaceState(null, "", `#/${appId}`);
      }
    },
    [focusWindow],
  );

  const openAppRef = useRef(openApp);
  useEffect(() => {
    openAppRef.current = openApp;
  }, [openApp]);

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveWindowId((cur) => {
      if (cur !== id) return cur;
      const next = windowsRef.current.find(
        (w) => w.id !== id && !w.minimized,
      );
      return next ? next.id : null;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
    setActiveWindowId((cur) => {
      if (cur !== id) return cur;
      const next = windowsRef.current.find(
        (w) => w.id !== id && !w.minimized,
      );
      return next ? next.id : null;
    });
  }, []);

  const toggleMaximize = useCallback(
    (id: string) => {
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
      );
      focusWindow(id);
    },
    [focusWindow],
  );

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id || w.maximized) return w;
        const clampedX = Math.min(
          Math.max(x, -w.width + 80),
          window.innerWidth - 80,
        );
        const clampedY = Math.min(
          Math.max(y, 0),
          window.innerHeight - TASKBAR_HEIGHT - 40,
        );
        return { ...w, x: clampedX, y: clampedY };
      }),
    );
  }, []);

  const resizeWindow = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((ws) =>
        ws.map((w) => {
          if (w.id !== id || w.maximized) return w;
          const min = APPS[w.appId].minSize ?? { width: 320, height: 240 };
          const maxW = window.innerWidth - WINDOW_MARGIN;
          const maxH = window.innerHeight - TASKBAR_HEIGHT - WINDOW_MARGIN;
          const nextW = Math.min(Math.max(width, min.width), maxW);
          const nextH = Math.min(Math.max(height, min.height), maxH);
          return { ...w, width: nextW, height: nextH };
        }),
      );
    },
    [],
  );

  const isAppOpen = useCallback(
    (appId: AppId) => windowsRef.current.some((w) => w.appId === appId),
    [],
  );

  // Hash routing: open apps from URL (#/about, #/projects, ...)
  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#\/?/, "").trim();
      if (!raw) return;
      const appId = APPS_BY_ID.find((a) => a === raw);
      if (appId) openAppRef.current(appId);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Keep windows on-screen and sized to the current viewport (rotation / resize)
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxW = vw - WINDOW_MARGIN * 2;
      const maxH = vh - TASKBAR_HEIGHT - WINDOW_MARGIN * 2;
      setWindows((ws) =>
        ws.map((w) => {
          if (w.maximized) return w;
          const width = Math.max(64, Math.min(w.width, maxW));
          const height = Math.max(64, Math.min(w.height, maxH));
          const x = Math.min(Math.max(w.x, -width + 80), vw - 80);
          const y = Math.min(Math.max(w.y, 0), vh - TASKBAR_HEIGHT - 40);
          return { ...w, x, y, width, height };
        }),
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const value: WindowManagerContextValue = {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
    resizeWindow,
    isAppOpen,
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return ctx;
}