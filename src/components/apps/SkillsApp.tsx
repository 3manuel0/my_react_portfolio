import React from "react";
import { skills } from "../../data/portfolio";
import { TechIcon } from "../apps/shared";

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "text-os-green border-os-green/40",
  "Web Development": "text-os-cyan border-os-cyan/40",
  Databases: "text-os-purple border-os-purple/40",
  Other: "text-os-yellow border-os-yellow/40",
};

const skillsCategories = Object.keys(skills);

const displayName = (t: string) => {
  switch (t) {
    case "Javascript":
      return "JavaScript";
    case "Typescript":
      return "TypeScript";
    case "Nodejs":
      return "Node.js";
    case "Postgresql":
      return "PostgreSQL";
    case "Mongodb":
      return "MongoDB";
    case "Mysql":
      return "MySQL";
    case "Sqlite":
      return "SQLite";
    default:
      return t;
  }
};

const SkillsApp: React.FC = () => {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 border border-os-border bg-os-surface2/60 p-3 font-mono text-[0.68rem] leading-relaxed">
        <p className="text-os-dim">$ cat /proc/3manuel/skills.kernel</p>
        <p className="text-os-accent">3manuel@localhost:~$ </p>
        <p className="text-os-text">
          <span className="text-os-yellow">Available toolchains</span> in active
          environment: <span className="text-os-green">{skillsCategories.length}</span>{" "}
          categories,{" "}
          <span className="text-os-green">
            {skillsCategories.reduce((n, c) => n + skills[c as keyof typeof skills].length, 0)}
          </span>{" "}
          tools registered.
        </p>
      </div>

      <div className="space-y-4">
        {skillsCategories.map((cat) => (
          <div
            key={cat}
            className={`border ${CATEGORY_COLORS[cat] ?? "border-os-border"} bg-os-surface2/30 p-3`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-widest">
                {cat}
              </h2>
              <span className="text-[0.55rem] text-os-dim">
                {skills[cat as keyof typeof skills].length}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 pb-2">
              {skills[cat as keyof typeof skills].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 border border-transparent px-1 py-0.5 transition-colors hover:border-os-border"
                >
                  <TechIcon name={t} size={24} />
                  <span className="text-[0.68rem] text-os-text">{displayName(t)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsApp;