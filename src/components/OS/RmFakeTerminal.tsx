import React, { useEffect, useRef, useState } from "react";

interface RmFakeTerminalProps {
  onFinished: () => void;
}

interface Line {
  text: string;
  kind?: "ok" | "warn" | "err";
}

const LINES: Line[] = [
  { text: "root@3manuel-desktop:~# sudo rm -rf /" },
  { text: "removing /home/3manuel/.bashrc ... found only aliases for life wisdom" },
  { text: "removing /home/3manuel/Desktop/roadmap.md ... it had shapes, not directions" },
  { text: "removing /usr/bin/firefox ... but it was a webassembly enthusiast all along" },
  { text: "removing /home/3manuel/Downloads/ ... they were all just reminders" },
  { text: "removing /etc/hosts ... no device behind those doors" },
  { text: "permission denied: /proc/1/root", kind: "err" },
  { text: "removing /var/log/kernel ... no syscalls left to syscall" },
  { text: "removing /usr/share/todo.md ... nothing left to do" },
  { text: "removing /boot/vmlinuz ... it was holding the door open for hours" },
  { text: "removing /dev/mem ... the winning move is not to read the cards", kind: "warn" },
  { text: "removing /home/3manuel/.ssh/known_hosts ... strangers anyway" },
  { text: "removing /home/3manuel/projects/ ... wait, not the portfolio", kind: "warn" },
  { text: "removing / ... whoami: nobody. pwd: /nowhere" },
  { text: "sync ... flushing the feels (flushed)" },
  { text: "panic: no stack left to trace", kind: "err" },
];

const INTERVAL_MS = 350;

const RmFakeTerminal: React.FC<RmFakeTerminalProps> = ({ onFinished }) => {
  const [seen, setSeen] = useState(1);
  const done = useRef(false);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setSeen((s) => {
        if (s >= LINES.length) {
          window.clearInterval(iv);
          return s;
        }
        return s + 1;
      });
    }, INTERVAL_MS);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    if (seen >= LINES.length) {
      const t = window.setTimeout(() => {
        if (!done.current) {
          done.current = true;
          onFinished();
        }
      }, 1000);
      return () => window.clearTimeout(t);
    }
  }, [seen, onFinished]);

  const pct = Math.min(100, Math.round((seen / LINES.length) * 100));

  return (
    <div
      className="fixed inset-0 z-[10000] select-none overflow-hidden p-5 font-mono text-sm leading-relaxed"
      style={{ background: "#04070b" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="mb-3 flex items-center gap-2 text-[0.6rem] text-os-dim">
        <span className="h-2.5 w-2.5 bg-os-red" aria-hidden="true" />
        <span className="h-2.5 w-2.5 bg-os-yellow" aria-hidden="true" />
        <span className="h-2.5 w-2.5 bg-os-green" aria-hidden="true" />
        <span className="ml-2">phil - 3manuelos emergency shell</span>
        <span className="ml-auto">rm --recursive --force --verbose /</span>
      </div>
      <div className="flex h-[calc(100%-2rem)] flex-col justify-end">
        {LINES.slice(0, seen).map((l, i) => (
          <p
            key={i}
            className={
              l.kind === "err"
                ? "text-os-red"
                : l.kind === "warn"
                  ? "text-os-yellow"
                  : i === 0
                    ? "text-os-text"
                    : "text-os-dim"
            }
          >
            {i === 0 ? "" : "  "}
            {l.text}
          </p>
        ))}
        <p className="text-os-green">
          <span className="pointer-events-none">$ </span>
          <span className="terminal-block-cursor" />
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-os-border p-2">
        <div className="flex items-center justify-between pb-1 font-mono text-[0.6rem] text-os-dim">
          <span>destroying filesystem...</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden bg-os-surface2">
          <div
            className="h-full bg-os-green transition-[width]"
            style={{ width: `${pct}%`, transitionDuration: "320ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RmFakeTerminal;