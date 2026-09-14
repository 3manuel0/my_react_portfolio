import React from "react";
import { APP_LIST, type AppId } from "../../data/appRegistry";
import { AppIcon } from "../AppIcons";
import Wallpaper, { type WallpaperId } from "../Desktop/Wallpaper";

interface HomeScreenProps {
  wallpaper: WallpaperId;
  onOpen: (appId: AppId) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ wallpaper, onOpen }) => (
  <div className="phone-enter absolute inset-0 select-none" aria-label="Home screen">
    <Wallpaper variant={wallpaper} />
    <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

    {/* App grid */}
    <div className="absolute inset-x-0 top-12 bottom-14 flex flex-col justify-center">
      <div className="grid grid-cols-4 gap-x-2 gap-y-6 px-5">
        {APP_LIST.map((app) => (
          <button
            key={app.id}
            type="button"
            aria-label={`Open ${app.title}`}
            onClick={() => onOpen(app.id)}
            className="flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-colors hover:bg-white/10 active:bg-white/15"
            style={{ touchAction: "manipulation" }}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-os-surface/80 shadow-[0_6px_16px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              <AppIcon name={app.icon} size={36} />
            </span>
            <span className="max-w-full truncate text-[0.58rem] leading-tight text-white/95">
              {app.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default HomeScreen;