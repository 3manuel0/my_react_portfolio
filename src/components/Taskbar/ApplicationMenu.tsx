import React, { useEffect, useRef } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { APPS, type AppId } from "../../data/appRegistry";
import { AppIcon } from "../AppIcons";

interface ApplicationMenuProps {
  onClose: () => void;
}

interface MenuCategory {
  label: string;
  apps: AppId[];
}

const MENU_STRUCTURE: MenuCategory[] = [
  {
    label: "Development",
    apps: ["terminal", "github", "skills"],
  },
  {
    label: "Apps",
    apps: ["game", "media"],
  },
  {
    label: "Portfolio",
    apps: ["notes", "about", "projects", "experience", "education"],
  },
  {
    label: "System",
    apps: ["files", "contact", "system", "settings"],
  },
];

const ApplicationMenu: React.FC<ApplicationMenuProps> = ({ onClose }) => {
  const { openApp, isAppOpen } = useWindowManager();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (
        ref.current &&
        target &&
        !ref.current.contains(target) &&
        !(target instanceof Element && target.closest("[data-start-button]"))
      ) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const launch = (appId: AppId) => {
    openApp(appId);
    onClose();
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Application menu"
      className="menu-enter absolute bottom-12 left-1 z-50 w-[330px] max-w-[calc(100vw-0.5rem)] border border-os-border2 bg-os-surface/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur"
    >
      <div className="mb-3 border-b border-os-border pb-3">
        <p className="font-arcade text-[1.7rem] leading-none text-os-accent">
          3manuel<span className="text-os-text">OS</span>
        </p>
        <p className="mt-1.5 text-[0.6rem] text-os-dim">portfolio-wm 1.0</p>
      </div>

      {MENU_STRUCTURE.map((cat) => (
        <div key={cat.label} className="mb-1.5">
          <p className="px-1.5 pb-1 text-[0.6rem] uppercase tracking-widest text-os-dim">
            {cat.label}
          </p>
          <div className="grid grid-cols-2">
            {cat.apps.map((appId) => {
              const desc = APPS[appId];
              const open = isAppOpen(appId);
              return (
                <button
                  key={appId}
                  type="button"
                  role="menuitem"
                  onClick={() => launch(appId)}
                  className={`flex items-center gap-2.5 px-2 py-2 text-left text-[0.72rem] transition-colors ${
                    open
                      ? "text-os-green"
                      : "text-os-text hover:bg-os-blue/10 hover:text-os-accent"
                  }`}
                >
                  <AppIcon name={desc.icon} size={24} />
                  <span className="truncate">{desc.title}</span>
                  {open && (
                    <span className="ml-auto block h-1.5 w-1.5 bg-os-green" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-2 border-t border-os-border pt-2">
        <a
          href="https://github.com/3manuel0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 text-[0.72rem] text-os-text hover:bg-os-blue/10"
        >
          <span className="font-arcade text-base text-os-accent">&gt;_</span>
          github.com/3manuel0
        </a>
      </div>
    </div>
  );
};

export default ApplicationMenu;