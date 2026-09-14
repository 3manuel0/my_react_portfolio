import React from "react";
import { APPS, type AppId } from "../../data/appRegistry";
import { useWindowManager } from "../../context/WindowManagerContext";
import { AppIcon } from "../AppIcons";

interface RecentsScreenProps {
  onClose: () => void;
}

const RecentsScreen: React.FC<RecentsScreenProps> = ({ onClose }) => {
  const { windows, closeWindow, focusWindow, activeWindowId } =
    useWindowManager();

  const openWindows = windows
    .slice()
    .sort((a, b) => b.zIndex - a.zIndex);

  const openApp = (appId: AppId) => {
    const win = openWindows.find((w) => w.appId === appId);
    if (win) focusWindow(win.id);
    onClose();
  };

  return (
    <div
      className="phone-enter pointer-events-auto absolute inset-0 z-[80] flex flex-col bg-[#0a0d16]/90 pt-14 pb-16"
      onClick={onClose}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <p className="mb-2 px-5 text-[0.6rem] uppercase tracking-[0.25em] text-white/60">
        Recents
      </p>
      <div className="flex-1 space-y-2.5 overflow-y-auto px-5 pb-4">
        {openWindows.length === 0 && (
          <p className="pt-8 text-center text-[0.66rem] text-white/50">
            No apps open.
          </p>
        )}
        {openWindows.map((w, i) => {
          const desc = APPS[w.appId];
          const isActive = activeWindowId === w.id;
          return (
            <div
              key={w.id}
              className={`phone-scale-enter flex items-center gap-3 rounded-2xl border bg-os-surface/90 p-3 ${
                isActive
                  ? "border-os-accent/60"
                  : "border-white/10"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                openApp(w.appId);
              }}
              style={{ animationDelay: `${Math.min(i, 6) * 24}ms` }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-os-surface2 ring-1 ring-white/10">
                <AppIcon name={desc.icon} size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.7rem] text-os-text">
                  {desc.title}
                </span>
                <span className="block text-[0.55rem] text-os-dim">
                  {isActive ? "active" : "tap to open"}
                </span>
              </span>
              <button
                type="button"
                aria-label={`Close ${desc.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(w.id);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-os-dim transition-colors hover:bg-os-red/20 hover:text-os-red"
                style={{ touchAction: "manipulation" }}
              >
                &#10005;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentsScreen;