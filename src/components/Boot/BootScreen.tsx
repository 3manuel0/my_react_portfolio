import React, { useCallback, useEffect, useRef, useState } from "react";
import { KERNEL_VERSION } from "../../data/constants";

const BOOT_LINES = [
  "Initializing portfolio... [ OK ]",
  "Loading projects...        [ OK ]",
  "Loading skills...          [ OK ]",
  "Mounting /dev/3manuel...   [ OK ]",
];

const BootScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fade, setFade] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 160);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setFade(true), 250);
    const t2 = setTimeout(finish, 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visibleLines, finish]);

  // Let an impatient visitor skip the intro with any key.
  useEffect(() => {
    const onKey = () => finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  return (
    <div
      className={`absolute inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#070a12] transition-opacity duration-300 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Booting 3manuel OS"
      onClick={finish}
    >
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="w-[320px] sm:w-[400px] font-mono text-[0.72rem] leading-relaxed">
        <p className="text-lg font-bold text-os-accent">3manuel OS</p>
        <p className="mb-3 text-os-dim">
          {`3manuel-os ${new Date().getFullYear()} -- kernel ${KERNEL_VERSION}`}
        </p>
        <div className="border border-os-border p-3">
          {Array.from({ length: visibleLines }).map((_, i) => (
            <p key={i} className="boot-line flex justify-between text-os-text">
              <span>{BOOT_LINES[i].split(" [ OK ]")[0]}</span>
              <span className="text-os-green">[ OK ]</span>
            </p>
          ))}
          {visibleLines === BOOT_LINES.length && (
            <p className="boot-line mt-1 text-os-accent">
              <span className="crt-flicker inline-block">&#9618;</span> Starting
              desktop...
            </p>
          )}
        </div>
        <p className="mt-3 flex justify-between text-os-dim">
          <span>
            {visibleLines === BOOT_LINES.length ? "login:" : " "}
          </span>
          <span>
            {visibleLines === BOOT_LINES.length ? "3manuel" : ""}
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute bottom-4 right-4 border border-os-border px-2.5 py-1 text-[0.6rem] text-os-dim transition-colors hover:border-os-accent hover:text-os-accent"
      >
        skip intro
      </button>
    </div>
  );
};

export default BootScreen;
