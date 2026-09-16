import { useEffect, useRef, useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import Desktop from "./components/Desktop/Desktop";
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
import {
  OsSettingsProvider,
  useOsSettings,
} from "./context/OsSettingsContext";

function DesktopEnvironment({ booting }: { booting: boolean }) {
  const { windows, openApp } = useWindowManager();
  const { invert, wallpaper, scanlines } = useOsSettings();
  const openedAbout = useRef(false);

  useEffect(() => {
    if (!booting && !openedAbout.current) {
      openedAbout.current = true;
      openApp("about");
    }
  }, [booting, openApp]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-os-bg text-os-text ${
        invert ? "os-light" : ""
      } ${scanlines ? "scanlines" : ""}`}
    >
      <Desktop wallpaper={wallpaper} />

      {/* Light mode: wash the (dark) wallpaper so the light UI reads clearly */}
      {invert && (
        <div
          className="pointer-events-none absolute inset-0 bg-white/40"
          aria-hidden="true"
        />
      )}

      {/* Windows layer */}
      <div className="pointer-events-none absolute inset-0 isolate" data-testid="windows-layer">
        {windows.map((w) => (
          <Window key={w.id} window={w} />
        ))}
      </div>

      <Taskbar />

      <OsChrome />
    </div>
  );
}

function Root() {
  const { mode } = useOsMode();
  const { play } = useOsSound();
  const [booting, setBooting] = useState(true);

  return (
    <>
      {mode === "phone" ? (
        <PhoneShell />
      ) : (
        <DesktopEnvironment booting={booting} />
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
        <OsSettingsProvider>
          <WindowManagerProvider>
            <Root />
          </WindowManagerProvider>
        </OsSettingsProvider>
      </OsSoundProvider>
    </OsModeProvider>
  );
}

export default App;
