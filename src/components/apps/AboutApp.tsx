import React from "react";
import { contactLinks, profile, skills } from "../../data/portfolio";
import { TechIcon, Title } from "../apps/shared";
import { AppIcon } from "../AppIcons";

const AboutApp: React.FC = () => {
  const categories = [
    "Languages",
    "Web Development",
    "Databases",
    "Other",
  ] as const;

  return (
    <div className="p-4 sm:p-6">
      {/* Intro */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.6rem] text-os-dim">$ whoami</p>
          <h1 className="mt-1 text-xl font-bold text-os-text sm:text-2xl">
            <span className="text-os-green">Said</span> AKA{" "}
            <span className="text-os-accent">3manuel</span>
          </h1>
          <p className="mt-0.5 text-xs text-os-blue">{profile.title}</p>
          <p className="mt-1 text-[0.7rem] text-os-dim">
            <span aria-hidden="true">&#128205;</span> {profile.location}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {contactLinks.slice(0, 4).map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              title={c.name}
              aria-label={c.name}
              className="flex h-9 w-9 items-center justify-center border border-os-border bg-os-surface2 text-os-dim transition-colors hover:border-os-accent hover:text-os-accent"
            >
              <AppIcon name={c.name === "GitHub" ? "github" : c.name === "Email" ? "contact" : "about"} size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Bio */}
        <div>
          <Title>Development Profile</Title>
          <p className="text-[0.75rem] leading-relaxed text-os-text">{profile.bio}</p>

          <div className="mt-5">
            <Title>Current Focus</Title>
            <ul className="space-y-1.5 text-[0.72rem] text-os-text">
              <li className="flex gap-2">
                <span className="text-os-green">&#9654;</span>
                Exploring Machine Learning by implementing concepts from the ground up
                in C
              </li>
              <li className="flex gap-2">
                <span className="text-os-green">&#9654;</span>
                Low-level systems: emulators, custom runtimes, and manual memory
                management
              </li>
              <li className="flex gap-2">
                <span className="text-os-green">&#9654;</span>
                Bringing C/Raylib and WebAssembly to the browser
              </li>
            </ul>
          </div>

          <div className="mt-5">
            <Title>What I&apos;m looking for</Title>
            <p className="text-[0.72rem] text-os-text">{profile.lookingFor}</p>
          </div>
        </div>

        {/* Tech tree */}
        <div className="border-l border-os-border pl-4">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <Title>{cat}</Title>
              <div className="flex flex-wrap gap-2.5 pb-2 pt-0.5">
                {skills[cat].map((t) => (
                  <TechIcon key={t} name={t} size={20} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutApp;