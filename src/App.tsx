import { useEffect, useRef, useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import { Window } from "./components/Window/Window";
import {
  WindowManagerProvider,
  useWindowManager,
} from "./context/WindowManagerContext";

function DesktopEnvironment() {
  const { windows, openApp } = useWindowManager();
  const [booting, setBooting] = useState(true);
  const openedAbout = useRef(false);

  useEffect(() => {
    if (!booting && !openedAbout.current) {
      openedAbout.current = true;
      openApp("about");
    }
  }, [booting, openApp]);

  return (
    <div className="scanlines relative h-full w-full overflow-hidden bg-os-bg text-os-text">
      <Desktop />

      {/* Windows layer */}
      <div className="pointer-events-none absolute inset-0 isolate" data-testid="windows-layer">
        {windows.map((w) => (
          <Window key={w.id} window={w} />
        ))}
      </div>

      <Taskbar />

      {booting && <BootScreen onDone={() => setBooting(false)} />}
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