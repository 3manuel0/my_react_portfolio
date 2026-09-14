import React, { useEffect, useState } from "react";
import { AppIcon } from "../AppIcons";

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="phone-enter absolute inset-0 z-[90] flex cursor-pointer flex-col items-center justify-between select-none bg-[#070a12]/85 pt-14 text-white"
      onClick={onUnlock}
      onContextMenu={(e) => {
        e.preventDefault();
        onUnlock();
      }}
      style={{ backdropFilter: "blur(10px)", touchAction: "manipulation" }}
    >
      <div className="flex flex-col items-center gap-1 pt-8">
        <p className="text-7xl font-light tracking-tight" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>
          {time}
        </p>
        <p className="mt-1 text-sm capitalize text-white/80">{date}</p>
      </div>

      <div className="flex flex-col items-center gap-3 pb-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10">
          <AppIcon name="system" size={20} />
        </div>
        <p className="phone-lock-hint text-[0.6rem] uppercase tracking-[0.25em] text-white/60">
          &nbsp;tap anywhere to unlock&nbsp;
        </p>
      </div>
    </div>
  );
};

export default LockScreen;