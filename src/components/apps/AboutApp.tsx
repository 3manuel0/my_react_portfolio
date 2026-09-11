import React from "react";
import { contactLinks, education, experience, profile, skills } from "../../data/portfolio";
import { TechIcon, Title } from "./shared";
import { AppIcon } from "../AppIcons";

const AboutApp: React.FC = () => {
  const categories = [
    "Languages",
    "Web Development",
    "Databases",
    "Other",
  ] as const;

  const iconFor = (name: string): "github" | "linkedin" | "x" | "about" =>
    name === "GitHub" ? "github" : name === "LinkedIn" ? "linkedin" : name === "X (Twitter)" ? "x" : "about";

  const summary = [
    "Full-Stack Web Developer and Software Engineering student.",
    "Deep focus on C/C++, manual memory management, and low-level systems.",
    "Currently implementing Machine Learning concepts from the ground up in C.",
    "Shipped games, emulators, CLI tools, web apps, and infrastructure.",
  ];

  return (
    <div className="mx-auto max-w-[720px] p-4 sm:p-6">
      {/* Document toolbar */}
      <div className="mb-4 flex items-center justify-between border border-os-border bg-os-surface2/60 px-2.5 py-1.5">
        <p className="font-mono text-[0.6rem] text-os-dim">resume_3manuel.txt</p>
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 border border-os-border px-2 py-1 text-[0.6rem] text-os-text hover:border-os-accent hover:text-os-accent"
        >
          <AppIcon name="home" size={12} /> 3manuel.dev
        </a>
      </div>

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
            {profile.location} &#183; {profile.website} &#183; github.com/{profile.githubUsername}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {contactLinks.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              title={c.name}
              aria-label={c.name}
              className="flex h-9 w-9 items-center justify-center border border-os-border bg-os-surface2 text-os-dim transition-colors hover:border-os-accent hover:text-os-accent"
            >
              <AppIcon name={iconFor(c.name)} size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.75fr_0.8fr]">
        {/* Main */}
        <div>
          <div>
            <Title>Profile</Title>
            <div className="space-y-1">
              {summary.map((s) => (
                <p key={s} className="text-[0.68rem] leading-relaxed text-os-text">
                  <span className="mr-1.5 text-os-dim" aria-hidden="true">&bull;</span>
                  {s}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Title>Development Profile</Title>
            <p className="text-[0.75rem] leading-relaxed text-os-text">{profile.bio}</p>
          </div>

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
            <Title>Experience</Title>
            <div className="space-y-3">
              {experience
                .flatMap((g) => g.entries)
                .map((e) => (
                  <p key={e.role} className="text-[0.68rem] leading-relaxed text-os-text">
                    <span className="font-bold text-os-accent">{e.role}</span>
                    <span className="text-os-dim"> &#8212; {e.company}</span>
                    <span className="block text-os-dim">{e.description}</span>
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-5">
            <Title>Education</Title>
            {education.map((e) => (
              <p key={e.school} className="text-[0.68rem] leading-relaxed text-os-text">
                <span className="font-bold text-os-accent">
                  {e.degree} &#8212; {e.field}
                </span>
                <span className="text-os-dim"> &#183; {e.school} ({e.status})</span>
              </p>
            ))}
          </div>

          <div className="mt-5 border-t border-os-border pt-3">
            <Title>Contact</Title>
            <div className="flex flex-wrap gap-2">
              {contactLinks.map((c) => (
                <a
                  key={c.name}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-os-border px-2 py-1.5 text-[0.62rem] text-os-text hover:border-os-accent hover:text-os-accent"
                >
                  <AppIcon name={iconFor(c.name)} size={13} />
                  {c.name}
                  <span className="text-os-dim">{c.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tech tree */}
        <div className="max-w-[360px] border-l border-os-border pl-3">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <Title>{cat}</Title>
              <div className="flex flex-wrap gap-2.5 pb-2 pt-0.5">
                {skills[cat].map((t) => (
                  <TechIcon key={t} name={t} size={18} />
                ))}
              </div>
            </div>
          ))}
          <p className="mt-2 text-[0.55rem] leading-relaxed text-os-dim">
            Rendered live from the same data powering this desktop.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;