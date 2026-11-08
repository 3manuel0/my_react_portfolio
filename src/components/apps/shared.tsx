import React, { useState } from "react";

const ICON_FILES: Record<string, string> = {
  "C++": "Cpp",
  "C#": "Csharp",
};

export const TechIcon: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 22,
}) => {
  const [failed, setFailed] = useState(false);
  const fallback = (name.length > 2 ? name.slice(0, 2) : name).toUpperCase();
  const file = ICON_FILES[name] ?? name;

  if (failed) {
    return (
      <div className="group relative flex flex-col items-center justify-center">
        <span
          className="grid place-items-center border border-os-border bg-os-surface2 text-[0.45rem] font-bold text-os-dim"
          style={{ width: size, height: size }}
          aria-label={name}
        >
          {fallback}
        </span>
        <span className="text-outline pointer-events-none absolute -bottom-6 z-10 whitespace-nowrap text-[0.74rem] text-os-text opacity-0 transition-opacity group-hover:opacity-100">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col items-center justify-center">
      <img
        style={{ width: size, height: size }}
        src={`/icons/skills/${encodeURIComponent(file)}.svg`}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <span className="text-outline pointer-events-none absolute -bottom-6 z-10 whitespace-nowrap text-[0.74rem] text-os-text opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block border border-os-border px-2 py-0.5 text-[0.74rem] text-os-text">
    {children}
  </span>
);

export const AppSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-4">{children}</div>
);

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-2 text-[0.76rem] font-bold uppercase tracking-widest text-os-accent">
    {children}
  </h2>
);

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border border-os-border bg-os-surface2/60 p-3">{children}</div>
);

export const ExternalLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-os-blue underline decoration-dotted underline-offset-2 hover:text-os-green"
  >
    {children}
  </a>
);