import React, { Suspense, useState } from "react";
import { runAppBack } from "../../context/appBack";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useOsSettings } from "../../context/OsSettingsContext";
import type { AppId } from "../../data/appRegistry";
import { APPS } from "../../data/appRegistry";
import { ErrorBoundary } from "../OS/ErrorBoundary";
import StatusBar from "./StatusBar";
import NavBar from "./NavBar";
import LockScreen from "./LockScreen";
import HomeScreen from "./HomeScreen";
import RecentsScreen from "./RecentsScreen";
import QuickSettings from "./QuickSettings";

const PhoneShell: React.FC = () => {
  const { windows, activeWindowId, openApp, closeWindow } =
    useWindowManager();
  const { invert, wallpaper, scanlines } = useOsSettings();
  const [locked, setLocked] = useState(true);
  const [homeView, setHomeView] = useState(true);
  const [shadeOpen, setShadeOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);

  const openWindows = windows
    .filter((w) => !w.minimized)
    .slice()
    .sort((a, b) => b.zIndex - a.zIndex);
  const focused =
    openWindows.find((w) => w.id === activeWindowId) ?? openWindows[0];

  const openAppFromHome = (appId: AppId) => {
    openApp(appId);
    setHomeView(false);
    setShadeOpen(false);
    setRecentsOpen(false);
  };

  const goHome = () => {
    setHomeView(true);
    setShadeOpen(false);
    setRecentsOpen(false);
  };

  const goBack = () => {
    if (shadeOpen) {
      setShadeOpen(false);
      return;
    }
    if (recentsOpen) {
      setRecentsOpen(false);
      return;
    }
    if (focused) {
      // Let the app consume back first (project detail, note article, folder).
      if (runAppBack(focused.appId)) return;
      closeWindow(focused.id);
      const rest = openWindows.filter((w) => w.id !== focused.id);
      if (rest.length === 0) setHomeView(true);
      return;
    }
    setHomeView(true);
  };

  const screen: "home" | "app" = homeView || !focused ? "home" : "app";

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-os-bg text-os-text ${
        invert ? "os-invert" : ""
      } ${scanlines ? "scanlines" : ""}`}
      data-testid="phone-shell"
    >
      {/* Background for app view (behind everything, above wallpaper) */}
      <div className="absolute inset-0 bg-os-bg" aria-hidden="true" />

      {/* Content area between the phone bars */}
      <div className="absolute inset-x-0 top-8 bottom-12">
        {screen === "home" ? (
          <HomeScreen wallpaper={wallpaper} onOpen={openAppFromHome} />
        ) : (
          <div
            key={focused!.id}
            className="phone-app-enter h-full w-full overflow-auto"
            aria-label={APPS[focused!.appId].title}
          >
            <ErrorBoundary
              key={focused!.id}
              label={`${APPS[focused!.appId].title} crashed.`}
            >
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-os-bg">
                    <span className="animate-pulse font-mono text-[0.65rem] text-os-dim">
                      [LOADING...]
                    </span>
                  </div>
                }
              >
                {(() => {
                  const AppComponent = APPS[focused!.appId].component;
                  return <AppComponent />;
                })()}
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
      </div>

      <StatusBar
        title={screen === "app" && focused ? APPS[focused.appId].title : undefined}
        onOpenShade={() => setShadeOpen((v) => !v)}
      />

      <NavBar onBack={goBack} onHome={goHome} onRecents={() => setRecentsOpen(true)} />

      {shadeOpen && <QuickSettings onClose={() => setShadeOpen(false)} />}

      {recentsOpen && <RecentsScreen onClose={() => setRecentsOpen(false)} />}

      {locked && (
        <LockScreen
          onUnlock={() => {
            setLocked(false);
            if (homeView && openWindows.length > 0) setHomeView(false);
          }}
        />
      )}
    </div>
  );
};

export default PhoneShell;
