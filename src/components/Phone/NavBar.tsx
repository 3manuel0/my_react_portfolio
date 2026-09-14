import React from "react";

interface NavBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecents: () => void;
}

const BackIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const RecentsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 12 a8 8 0 1 0 8 -8 M4 7 v5 h5" />
  </svg>
);

const NavBar: React.FC<NavBarProps> = ({ onBack, onHome, onRecents }) => (
  <div
    role="toolbar"
    aria-label="Navigation bar"
    className="pointer-events-auto absolute inset-x-0 bottom-0 z-50 flex h-12 items-center justify-around px-8 text-white/90"
    style={{
      paddingBottom: "env(safe-area-inset-bottom)",
      background:
        "linear-gradient(to top, rgba(8,10,16,0.92), rgba(8,10,16,0.55))",
      backdropFilter: "blur(6px)",
    }}
  >
    <button
      type="button"
      aria-label="Back"
      onClick={onBack}
      className="flex h-10 w-14 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/20"
      style={{ touchAction: "manipulation" }}
    >
      <BackIcon />
    </button>
    <button
      type="button"
      aria-label="Home"
      onClick={onHome}
      className="flex h-10 w-14 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/20"
      style={{ touchAction: "manipulation" }}
    >
      <HomeIcon />
    </button>
    <button
      type="button"
      aria-label="Recents"
      onClick={onRecents}
      className="flex h-10 w-14 items-center justify-center rounded-full transition-colors hover:bg-white/10 active:bg-white/20"
      style={{ touchAction: "manipulation" }}
    >
      <RecentsIcon />
    </button>
  </div>
);

export default NavBar;