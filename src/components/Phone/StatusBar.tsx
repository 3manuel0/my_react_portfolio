import React, { useEffect, useState } from "react";

interface StatusBarProps {
  title?: string;
  onOpenShade: () => void;
}

const SignalIcon: React.FC = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" style={{ shapeRendering: "crispEdges" }}>
    <path d="M0 8 h2 v2 h-2 Z M3 6 h2 v4 h-2 Z M6 4 h2 v6 h-2 Z M9 2 h2 v8 h-2 Z M12 0 h2 v10 h-2 Z" fill="currentColor" />
  </svg>
);

const WifiIcon: React.FC = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" fill="currentColor">
    <path d="M7 8.5 a1.3 1.3 0 1 1 0 0.001 Z" />
    <path d="M4.2 6.4 a4 4 0 0 1 5.6 0 l-0.9 1 a2.6 2.6 0 0 0 -3.8 0 Z" />
    <path d="M1.6 3.8 a7 7 0 0 1 10.8 0 l-0.9 1 a5.6 5.6 0 0 0 -9 0 Z" />
  </svg>
);

const BatteryIcon: React.FC<{ level: number }> = ({ level }) => (
  <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden="true" style={{ shapeRendering: "crispEdges" }}>
    <rect x="0.5" y="0.5" width="18" height="10" fill="none" stroke="currentColor" opacity="0.75" />
    <rect x="2" y="2" width={Math.max(1, Math.round((14 * level) / 100))} height="7" fill="currentColor" />
    <rect x="19.5" y="3" width="2" height="5" fill="currentColor" opacity="0.75" />
  </svg>
);

const StatusBar: React.FC<StatusBarProps> = ({ title, onOpenShade }) => {
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

  return (
    <button
      type="button"
      role="status"
      aria-label={`Phone status bar${title ? ` — ${title}` : ""}`}
      onClick={onOpenShade}
      className="no-select pointer-events-auto absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-2 px-3 pb-1 pt-[max(env(safe-area-inset-top),0.5rem)] text-[0.66rem] font-medium text-white/95"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {title ? (
          <span className="truncate text-os-text/90">{title}</span>
        ) : (
          <span className="text-os-text/90">3manuel</span>
        )}
      </span>

      <span className="pointer-events-none flex shrink-0 items-center gap-1.5">
        <span className="text-os-text/90">{time}</span>
        <span className="text-os-text/90"><SignalIcon /></span>
        <span className="text-os-text/90"><WifiIcon /></span>
        <span className="text-os-text/90"><BatteryIcon level={72} /></span>
      </span>
    </button>
  );
};

export default StatusBar;