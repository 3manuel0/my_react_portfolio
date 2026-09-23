import React from "react";
import { education } from "../../data/portfolio";

const EducationApp: React.FC = () => {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 border border-os-border bg-os-surface2/60 p-3 font-mono text-[0.68rem]">
        <p className="text-os-dim">$ neofetch --education</p>
        <p className="text-os-accent">3manuel@localhost:~$ </p>
      </div>

      <div className="space-y-3">
        {education.map((ed) => (
          <div
            key={`${ed.degree}-${ed.school}`}
            className="border border-os-border bg-os-surface2/40 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-os-dim">
                  {ed.school}
                </p>
                <h2 className="mt-0.5 text-sm font-bold text-os-text">
                  {ed.degree}
                </h2>
                <p className="text-[0.7rem] text-os-blue">{ed.field}</p>
                {ed.location && (
                  <p className="mt-0.5 text-[0.62rem] text-os-dim">{ed.location}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-[0.58rem] text-os-dim">{ed.period}</p>
                {ed.status && (
                  <span className="mt-1 inline-block border border-os-green/40 px-2 py-0.5 text-[0.58rem] text-os-green">
                    {ed.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-os-border pt-3 font-mono text-[0.62rem] leading-relaxed text-os-dim">
        <p>
          <span className="text-os-green">status:</span> actively studying
          computer engineering while shipping side projects in C and beyond.
        </p>
      </div>
    </div>
  );
};

export default EducationApp;