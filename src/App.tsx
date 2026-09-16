import { useEffect, useRef, useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import { WALLPAPER_IDS, type WallpaperId } from "./components/Desktop/Wallpaper";
import OsChrome from "./components/OS/ContextMenu";
import PhoneShell from "./components/Phone/PhoneShell";
import Taskbar from "./components/Taskbar/Taskbar";
import { Window } from "./components/Window/Window";
import {
  WindowManagerProvider,
  useWindowManager,
} from "./context/WindowManagerContext";
import { OsModeProvider, useOsMode } from "./context/OsModeContext";
import { OsSoundProvider, useOsSound } from "./context/OsSoundContext";

const WALLPAPER_KEY = "3manuelos.wallpaper";

function loadWallpaper(): WallpaperId {
  const stored = globalThis.localStorage?.getItem(WALLPAPER_KEY);
  return (WALLPAPER_IDS as string[]).includes(stored ?? "")
    ? (stored as WallpaperId)
    : "tron";
}

interface DesktopEnvProps {
  booting: boolean;
  invert: boolean;
  onInvert: (v: boolean) => void;
  wallpaper: WallpaperId;
  onWallpaper: (id: WallpaperId) => void;
}

function DesktopEnvironment({
  booting,
  invert,
  onInvert,
  wallpaper,
  onWallpaper,
}: DesktopEnvProps) {
  const { windows, openApp } = useWindowManager();
  const openedAbout = useRef(false);

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

      <OsChrome
        invert={invert}
        onInvert={onInvert}
        wallpaper={wallpaper}
        onWallpaper={onWallpaper}
      />
    </div>
  );
}

function Root() {
  const { mode } = useOsMode();
  const { play } = useOsSound();
  const [booting, setBooting] = useState(true);
  const [invert, setInvert] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperId>(loadWallpaper);

  const changeWallpaper = (next: WallpaperId) => {
    setWallpaper(next);
    globalThis.localStorage?.setItem(WALLPAPER_KEY, next);
  };

  return (
    <>
      {mode === "phone" ? (
        <PhoneShell
          wallpaper={wallpaper}
          invert={invert}
          onInvert={setInvert}
        />
      ) : (
        <DesktopEnvironment
          booting={booting}
          invert={invert}
          onInvert={setInvert}
          wallpaper={wallpaper}
          onWallpaper={changeWallpaper}
        />
      )}

      {booting && (
        <BootScreen
          onDone={() => {
            play("startup");
            setBooting(false);
          }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <OsModeProvider>
      <OsSoundProvider>
        <WindowManagerProvider>
          <Root />
        </WindowManagerProvider>
      </OsSoundProvider>
    </OsModeProvider>
  );
}

export default App;