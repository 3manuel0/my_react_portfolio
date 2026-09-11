import React, { useRef, useState } from "react";
import type { AppId } from "../../data/appRegistry";
import { APPS } from "../../data/appRegistry";
import { AppIcon } from "../AppIcons";

interface DesktopIconProps {
  appId: AppId;
  label?: string;
  onOpen: (appId: AppId) => void;
}

const DOUBLE_CLICK_MS = 400;

const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, label, onOpen }) => {
  const [selected, setSelected] = useState(false);
  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desc = APPS[appId];

  const open = () => {
    setSelected(false);
    onOpen(appId);
  };

  const handleClick = () => {
    const isTouch =
      (window.matchMedia?.("(pointer: coarse)").matches ?? false) ||
      navigator.maxTouchPoints > 0;
    if (armTimer.current !== null) {
      clearTimeout(armTimer.current);
      armTimer.current = null;
      if (isTouch) {
        open();
      }
      return;
    }
    setSelected(true);
    armTimer.current = setTimeout(() => {
      armTimer.current = null;
    }, DOUBLE_CLICK_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${label ?? desc?.title ?? appId}`}
      className={`touch-manipulation flex w-20 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-sm p-1.5 outline-none transition-colors ${
        selected
          ? "bg-os-blue/20 outline-1 outline-dashed outline-os-blue/60"
          : "hover:bg-os-blue/10"
      }`}
      onClick={handleClick}
      onDoubleClick={open}
      onKeyDown={handleKeyDown}
    >
      <AppIcon name={desc.icon} size={40} className="drop-shadow-[0_3px_2px_rgba(0,0,0,0.7)]" />
      <span className="text-outline w-full truncate text-center text-[0.62rem] leading-tight text-os-text">
        {label ?? desc?.title ?? appId}
      </span>
    </div>
  );
};

export default DesktopIcon;