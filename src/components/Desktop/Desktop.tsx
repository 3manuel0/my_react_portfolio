import React from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import type { AppId } from "../../data/appRegistry";
import DesktopIcon from "./DesktopIcon";
import Wallpaper, { type WallpaperId } from "./Wallpaper";

const DESKTOP_ICONS: { appId: AppId; label: string }[] = [
  { appId: "about", label: "About Me" },
  { appId: "projects", label: "Projects" },
  { appId: "skills", label: "Skills" },
  { appId: "github", label: "GitHub" },
  { appId: "contact", label: "Contact" },
  { appId: "terminal", label: "Terminal" },
  { appId: "system", label: "System" },
];

interface DesktopProps {
  wallpaper: WallpaperId;
}

const Desktop: React.FC<DesktopProps> = ({ wallpaper }) => {
  const { openApp } = useWindowManager();

  return (
    <div className="absolute inset-0 select-none overflow-hidden" aria-label="Desktop">
      <Wallpaper variant={wallpaper} />
      <div className="absolute inset-x-0 bottom-[52px] top-2 flex flex-col flex-wrap content-start gap-x-2 gap-y-1 px-3">
        {DESKTOP_ICONS.map(({ appId, label }) => (
          <DesktopIcon
            key={appId}
            appId={appId}
            label={label}
            onOpen={(a) => openApp(a)}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;