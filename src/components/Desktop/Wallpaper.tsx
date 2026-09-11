import React from "react";

const Wallpaper: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: "#0a0d13" }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#14243a" />
            <stop offset="55%" stopColor="#0c1322" />
            <stop offset="100%" stopColor="#070a12" />
          </radialGradient>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#1b2638" strokeWidth="1" />
          </pattern>
          <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141c2e" />
            <stop offset="100%" stopColor="#0a0e18" />
          </linearGradient>
          <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#172740" />
            <stop offset="100%" stopColor="#101a2c" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#glow)" />

        {/* faint retro sun */}
        <circle cx="1085" cy="210" r="78" fill="#1d2c47" opacity="0.7" />
        <rect x="1085" y="220" width="120" height="46" fill="#0c1322" />

        {/* grid overlay */}
        <rect width="1440" height="900" fill="url(#grid)" opacity="0.5" />

        {/* mountains */}
        <path
          d="M0 720 L180 520 L330 660 L470 470 L640 690 L800 540 L960 700 L1120 540 L1280 680 L1440 560 L1440 900 L0 900 Z"
          fill="url(#mountain)"
        />
        <path
          d="M0 780 L220 640 L400 760 L560 620 L740 790 L920 620 L1100 760 L1300 640 L1440 780 L1440 900 L0 900 Z"
          fill="url(#skyline)"
          opacity="0.9"
        />

        {/* pixel stars */}
        <g fill="#5a6f94" opacity="0.6">
          <rect x="120" y="90" width="3" height="3" />
          <rect x="320" y="160" width="3" height="3" />
          <rect x="540" y="80" width="3" height="3" />
          <rect x="760" y="140" width="3" height="3" />
          <rect x="880" y="70" width="3" height="3" />
          <rect x="230" y="260" width="3" height="3" />
          <rect x="950" y="230" width="3" height="3" />
          <rect x="420" y="50" width="3" height="3" />
        </g>

        {/* corner brackets */}
        <g stroke="#22324f" strokeWidth="2" fill="none" opacity="0.8">
          <path d="M16 36 V16 H36" />
          <path d="M1424 16 H1404 V36" />
        </g>
      </svg>
    </div>
  );
};

export default Wallpaper;