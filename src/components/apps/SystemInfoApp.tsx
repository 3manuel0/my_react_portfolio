import { useEffect, useState, type ReactNode } from "react";
import { profile } from "../../data/portfolio";
import { KERNEL_VERSION } from "../../data/constants";

const OS_ART = [
  "  .-------.",
  "  | 3m  OS|",
  "  |-------|",
  "  | $ _   |",
  "  |       |",
  "  |       |",
  "  '-------'",
];

const MEM_TOTAL = 16;

const SystemInfoApp: React.FC = () => {
  const [uptime, setUptime] = useState("0h 0m");
  const [memPct, setMemPct] = useState(82);

  useEffect(() => {
    const start = Date.now() - (26 * 60 + 14) * 60 * 1000;
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      setUptime(`${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setMemPct((p) => {
        const drift = Math.floor(Math.random() * 3) - 1;
        return Math.min(93, Math.max(68, p + drift));
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const memUsed = ((MEM_TOTAL * memPct) / 100).toFixed(1);
  const memBarFilled = Math.round(memPct / 10);

  const rows: [string, ReactNode][] = [
    ["OS", <span key="os"><span className="text-os-green">3manuelOS</span> (webassembly)</span>],
    ["Host", profile.website],
    ["Kernel", KERNEL_VERSION],
    ["Uptime", uptime],
    ["Shell", "bash 5.2.26"],
    ["CPU", "8 cores @ 3.8GHz (CISC, browser-safe)"],
    [
      "Memory",
      <span key="mem" className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className="whitespace-nowrap">
          <span className="text-os-green">{"█".repeat(memBarFilled)}</span>
          <span className="text-os-dim">{"░".repeat(10 - memBarFilled)}</span>
        </span>
        <span>{memUsed} GiB / {MEM_TOTAL} GiB</span>
      </span>,
    ],
    ["Disk", "953 GiB / 1024 GiB (93%)"],
    ["WM", "portfolio-wm v1.0.0"],
    ["Theme", "3manuel-dark [os]"],
  ];

  return (
    <div className="p-4 sm:p-5">
      <div className="mb-3 border border-os-border bg-os-surface2/60 px-3 py-2 font-mono text-[0.62rem]">
        <p className="text-os-dim">$ neofetch</p>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
        {/* ASCII */}
        <pre
          className="shrink-0 select-none whitespace-pre text-[0.8rem] leading-[1.25] text-os-green sm:text-[0.9rem]"
          aria-hidden="true"
        >
          {OS_ART.join("\n")}
        </pre>

        {/* Info */}
        <div className="min-w-0 flex-1 font-mono text-[0.68rem] leading-[1.6]">
          <p className="whitespace-nowrap">
            <span className="font-bold text-os-accent">{profile.alias}@localhost</span>
            <span className="text-os-dim">-------------------</span>
          </p>
          <p className="text-os-dim">{profile.title}</p>
          <div className="mt-2 space-y-0.5">
            {rows.map(([k, v]) => (
              <p key={k} className="flex flex-wrap gap-x-3">
                <span className="w-20 shrink-0 text-os-blue sm:w-24">{k}:</span>
                <span className="text-os-text">{v}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Fictional OS notice */}
      <div className="mt-4 border border-os-border bg-os-surface2/30 p-3 text-[0.6rem] leading-relaxed text-os-dim">
        <p>
          <span className="text-os-yellow">note:</span> this is the fictional
          portfolio desktop running in your browser — not your machine. The RAM
          and CPU below are decorative. No processes were harmed.
        </p>
      </div>
    </div>
  );
};

export default SystemInfoApp;