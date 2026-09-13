import { useEffect, useRef, useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import { WALLPAPER_IDS, type WallpaperId } from "./components/Desktop/Wallpaper";
import OsChrome from "./components/OS/ContextMenu";
import Taskbar from "./components/Taskbar/Taskbar";
import { Window } from "./components/Window/Window";
import {
  WindowManagerProvider,
  useWindowManager,
} from "./context/WindowManagerContext";

const WALLPAPER_KEY = "3manuelos.wallpaper";

function loadWallpaper(): WallpaperId {
  const stored = globalThis.localStorage?.getItem(WALLPAPER_KEY);
  return (WALLPAPER_IDS as string[]).includes(stored ?? "")
    ? (stored as WallpaperId)
    : "tron";
}

function DesktopEnvironment() {
  const { windows, openApp } = useWindowManager();
  const [booting, setBooting] = useState(true);
  const [invert, setInvert] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperId>(loadWallpaper);
  const openedAbout = useRef(false);

  const changeWallpaper = (next: WallpaperId) => {
    setWallpaper(next);
    globalThis.localStorage?.setItem(WALLPAPER_KEY, next);
  };

  useEffect(() => {
    if (!booting && !openedAbout.current) {
      openedAbout.current = true;
      openApp("about");
    }
  }, [booting, openApp]);

  return (
    <div
      className={`scanlines relative h-full w-full overflow-hidden bg-os-bg text-os-text ${
        invert ? "os-invert" : ""
      }`}
    >
      <Desktop wallpaper={wallpaper} />

      {/* Windows layer */}
      <div className="pointer-events-none absolute inset-0 isolate" data-testid="windows-layer">
        {windows.map((w) => (
          <Window key={w.id} window={w} />
        ))}
      </div>

      <Taskbar />

      {booting && <BootScreen onDone={() => setBooting(false)} />}

      <OsChrome
        invert={invert}
        onInvert={setInvert}
        wallpaper={wallpaper}
        onWallpaper={changeWallpaper}
      />
    </div>
  );
}

function App() {
  return (
    <WindowManagerProvider>
      <DesktopEnvironment />
    </WindowManagerProvider>
  );
}

export default App;