import React from "react";
import { experience } from "../../data/portfolio";

const ExperienceApp: React.FC = () => {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 border border-os-border bg-os-surface2/60 p-3 font-mono text-[0.68rem]">
        <p className="text-os-dim">$ cat experience.log</p>
        <p className="text-os-accent">3manuel@localhost:~$ </p>
      </div>

      <div className="space-y-6">
        {experience.map((group) => (
          <div key={group.year}>
            <h2 className="mb-2 flex items-center gap-2 font-arcade text-sm text-os-blue">
              <span aria-hidden="true">&#9654;</span> {group.year}
              <span className="flex-1 border-t border-os-border" aria-hidden="true" />
            </h2>
            <div className="space-y-3">
              {group.entries.map((entry) => (
                <div
                  key={`${entry.role}-${entry.company}`}
                  className="border border-os-border bg-os-surface2/40 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-[0.72rem] font-bold text-os-green">
                      {entry.role}
                    </p>
                    <p className="text-[0.6rem] text-os-dim">{entry.company}</p>
                  </div>
                  <p className="mt-1.5 text-[0.68rem] leading-relaxed text-os-text">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* live log tail */}
        <div className="border border-os-border bg-os-surface2/30 p-3 font-mono text-[0.62rem] leading-relaxed text-os-dim">
          <p>
            <span className="text-os-green">[active]</span> now: available for
            freelance &amp; internships &#8212; see Contact app.
          </p>
          <p>
            <span className="text-os-yellow">[pending]</span> awaiting next
            commit...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceApp;