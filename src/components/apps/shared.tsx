import React from "react";
import { gitContentBase } from "../../data/portfolio";

export const TechIcon: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 22,
}) => {
  return (
    <div className="group relative flex flex-col items-center justify-center">
      <img
        className="cursor-pointer"
        style={{ width: size, height: size }}
        src={gitContentBase + name + ".svg"}
        alt={name}
        loading="lazy"
      />
      <span className="text-outline pointer-events-none absolute -bottom-6 z-10 whitespace-nowrap text-[0.55rem] text-os-text opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block border border-os-border px-2 py-0.5 text-[0.62rem] text-os-text">
    {children}
  </span>
);

export const AppSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-4">{children}</div>
);

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-os-accent">
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