import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useOsSound } from "../../context/OsSoundContext";
import type { AppId } from "../../data/appRegistry";

const TOUR_KEY = "3manuelos.tour.seen";
const ARRIVED_KEY = "3manuelos.arrived";

interface Step {
  title: string;
  body: string;
  /** CSS selector to spotlight. Omit for a centered card. */
  target?: string;
  placement?: "top" | "bottom" | "left" | "right";
  cta?: { label: string; app: AppId };
}

const STEPS: Step[] = [
  {
    title: "welcome to 3manuel OS",
    body: "The whole résumé is a tiny windowed desktop. Give me 20 seconds and I'll show you around.",
  },
  {
    title: "your apps live here",
    body: "Double-click any desktop icon to open a window. There's Projects, Notes, Files, a real terminal, and even a little platformer.",
    target: "[data-tour='desktop-icons']",
    placement: "right",
  },
  {
    title: "the taskbar",
    body: "Hit the «3manuel» button for the application menu — every app in one place. Open windows show up next to it.",
    target: "[data-start-button]",
    placement: "top",
  },
  {
    title: "right-click anything",
    body: "Right-click the desktop for easter eggs: change the wallpaper, invert colors, lock the screen, or tempt fate with sudo rm -rf /.",
    target: "[data-tour='desktop']",
    placement: "top",
  },
  {
    title: "keyboard shortcuts",
    body: "Ctrl+Alt+←/→ cycles windows, Ctrl+Alt+T opens the terminal, and double-clicking a title bar maximizes. Hold Shift (or Ctrl) while dragging to snap windows to a grid.",
  },
  {
    title: "that's the tour",
    body: "You're all set. The terminal is a good place to start — try `help`, `neofetch`, or `uptime`.",
    cta: { label: "open the terminal", app: "terminal" },
  },
];

interface WelcomeTourProps {
  onOpenApp: (id: AppId) => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onOpenApp }) => {
  const { play } = useOsSound();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [card, setCard] = useState({ w: 300, h: 160 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Show once, and record the first-visit timestamp for the uptime easter egg.
  useEffect(() => {
    try {
      if (!localStorage.getItem(ARRIVED_KEY)) {
        localStorage.setItem(ARRIVED_KEY, String(Date.now()));
      }
      if (localStorage.getItem(TOUR_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  const step = STEPS[index];

  // Measure the spotlighted element for the current step.
  useLayoutEffect(() => {
    if (!open) return;
    if (!step.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    setRect(el.getBoundingClientRect());
  }, [open, index, step.target]);

  // Keep it anchored if the viewport changes.
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (!step.target) return;
      const el = document.querySelector(step.target) as HTMLElement | null;
      setRect(el ? el.getBoundingClientRect() : null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, step.target]);

  // Track card size so we can position it without a flash.
  useLayoutEffect(() => {
    if (!open || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setCard((c) => (c.w === r.width && c.h === r.height ? c : { w: r.width, h: r.height }));
  }, [open, index, rect]);

  const next = useCallback(() => {
    play("click");
    if (index >= STEPS.length - 1) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  }, [index, finish, play]);

  const back = useCallback(() => {
    play("click");
    setIndex((i) => Math.max(0, i - 1));
  }, [play]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "Enter" || e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, finish, next, back]);

  if (!open) return null;

  const M = 12;
  const placement = step.target ? step.placement ?? "bottom" : "center";
  let left = window.innerWidth / 2 - card.w / 2;
  let top = window.innerHeight / 2 - card.h / 2;
  if (rect && placement !== "center") {
    if (placement === "right") {
      left = rect.right + M;
      top = rect.top + rect.height / 2 - card.h / 2;
    } else if (placement === "left") {
      left = rect.left - card.w - M;
      top = rect.top + rect.height / 2 - card.h / 2;
    } else if (placement === "top") {
      left = rect.left + rect.width / 2 - card.w / 2;
      top = rect.top - card.h - M;
    } else {
      left = rect.left + rect.width / 2 - card.w / 2;
      top = rect.bottom + M;
    }
  }
  left = Math.max(M, Math.min(left, window.innerWidth - card.w - M));
  top = Math.max(M, Math.min(top, window.innerHeight - card.h - M));

  const isLast = index === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[9990]" role="dialog" aria-modal="true" aria-label="Welcome tour">
      {/* Spotlight / backdrop */}
      {rect ? (
        <div
          className="pointer-events-none absolute border-2 border-os-accent transition-all duration-200"
          style={{
            left: rect.left - 4,
            top: rect.top - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className="menu-enter absolute w-[19rem] max-w-[calc(100vw-2rem)] border-2 border-os-accent bg-os-surface/98 p-4 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur"
        style={{ left, top }}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-arcade text-[0.8rem] text-os-accent">{step.title}</p>
          <span className="shrink-0 font-mono text-[0.55rem] text-os-dim">
            {index + 1}/{STEPS.length}
          </span>
        </div>
        <p className="text-[0.68rem] leading-relaxed text-os-text">{step.body}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              play("click");
              finish();
            }}
            className="font-mono text-[0.6rem] text-os-dim transition-colors hover:text-os-text"
          >
            skip
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="border border-os-border2 px-3 py-1 font-mono text-[0.6rem] text-os-text transition-colors hover:border-os-accent hover:text-os-accent"
              >
                back
              </button>
            )}
            {isLast && step.cta ? (
              <button
                type="button"
                onClick={() => {
                  play("click");
                  onOpenApp(step.cta!.app);
                  finish();
                }}
                className="border border-os-accent bg-os-accent px-3 py-1 font-mono text-[0.6rem] text-black transition-opacity hover:opacity-90"
              >
                {step.cta.label}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="border border-os-accent bg-os-accent px-3 py-1 font-mono text-[0.6rem] text-black transition-opacity hover:opacity-90"
              >
                {isLast ? "done" : "next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour;
