import { useCallback, useEffect, useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import OsChrome from "./components/OS/ContextMenu";
import { ErrorBoundary } from "./components/OS/ErrorBoundary";
import WelcomeTour from "./components/OS/WelcomeTour";
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
import { hasInitialAppHash } from "./data/hash";

const BOOT_SEEN_KEY = "3manuelos.boot.seen";

// Survives desktop <-> phone mode switches so About does not reopen every time.
let hasAutoOpenedAbout = false;

function readBootSeen(): boolean {
  try {
    return globalThis.sessionStorage?.getItem(BOOT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootSeen(): void {
  try {
    globalThis.sessionStorage?.setItem(BOOT_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

function DesktopEnvironment({ booting }: { booting: boolean }) {
  const { windows, openApp } = useWindowManager();
  const { invert, wallpaper, scanlines } = useOsSettings();

  useEffect(() => {
    if (booting || hasAutoOpenedAbout) return;
    // A deep link already opened its app, and an existing window means the
    // visitor got here with intent — don't stack About on top of it.
    if (hasInitialAppHash() || windows.length > 0) return;
    hasAutoOpenedAbout = true;
    openApp("about", { updateHash: false });
  }, [booting, openApp, windows.length]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-os-bg text-os-text ${
        invert ? "os-invert" : ""
      } ${scanlines ? "scanlines" : ""}`}
    >
      <Desktop wallpaper={wallpaper} />

      {/* Windows layer */}
      <div className="pointer-events-none absolute inset-0 isolate" data-testid="windows-layer">
        {windows.map((w) => (
          <Window key={w.id} window={w} />
        ))}
      </div>

      <Taskbar />

      <OsChrome />

      {!booting && <WelcomeTour onOpenApp={openApp} />}
    </div>
  );
}

function Root() {
  const { mode } = useOsMode();
  const { play } = useOsSound();
  const [booting, setBooting] = useState(
    () => !hasInitialAppHash() && !readBootSeen(),
  );

  const finishBoot = useCallback(() => {
    markBootSeen();
    play("startup");
    setBooting(false);
  }, [play]);

  return (
    <>
      {mode === "phone" ? (
        <PhoneShell />
      ) : (
        <DesktopEnvironment booting={booting} />
      )}

      {booting && <BootScreen onDone={finishBoot} />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary label="3manuelOS crashed">
      <OsModeProvider>
        <OsSoundProvider>
          <OsSettingsProvider>
            <WindowManagerProvider>
              <Root />
            </WindowManagerProvider>
          </OsSettingsProvider>
        </OsSoundProvider>
      </OsModeProvider>
    </ErrorBoundary>
  );
}

export default App;
