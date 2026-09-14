import React from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { APP_LIST, type AppId } from "../../data/appRegistry";
import DesktopIcon from "./DesktopIcon";
import Wallpaper, { type WallpaperId } from "./Wallpaper";

const LABEL_OVERRIDES: Partial<Record<AppId, string>> = {
  game: "2D Platformer",
};

const DESKTOP_ICONS = APP_LIST.map((app) => ({
  appId: app.id,
  label: LABEL_OVERRIDES[app.id] ?? app.title,
}));

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