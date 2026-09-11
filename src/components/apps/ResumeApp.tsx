import React from "react";
import { contactLinks, education, experience, profile, skills } from "../../data/portfolio";
import { AppIcon } from "../AppIcons";

const ResumeApp: React.FC = () => {
  const summary = [
    "Full-Stack Web Developer and Software Engineering student.",
    "Deep focus on C/C++, manual memory management, and low-level systems.",
    "Currently implementing Machine Learning concepts from the ground up in C.",
    "Shipped games, emulators, CLI tools, web apps, and infrastructure.",
  ];

  const skillRows = Object.entries(skills);

  return (
    <div className="mx-auto max-w-[620px] p-4 sm:p-6">
      {/* Document toolbar */}
      <div className="mb-4 flex items-center justify-between border border-os-border bg-os-surface2/60 px-2.5 py-1.5">
        <p className="font-mono text-[0.6rem] text-os-dim">
          resume_3manuel.txt
        </p>
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 border border-os-border px-2 py-1 text-[0.6rem] text-os-text hover:border-os-accent hover:text-os-accent"
        >
          <AppIcon name="home" size={12} /> 3manuel.dev
        </a>
      </div>

      {/* Header */}
      <header className="border-b-2 border-os-border pb-3">
        <h1 className="font-arcade text-xl text-os-text">Said &#183; 3manuel</h1>
        <p className="mt-1 text-[0.7rem] text-os-blue">{profile.title}</p>
        <p className="text-[0.62rem] text-os-dim">
          {profile.location} &#183; {profile.website} &#183; github.com/{profile.githubUsername}
        </p>
      </header>

      {/* Summary */}
      <section className="py-3">
        <h2 className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-os-green">
          Profile
        </h2>
        <div className="space-y-1">
          {summary.map((s) => (
            <p key={s} className="text-[0.68rem] leading-relaxed text-os-text">
              <span className="mr-1.5 text-os-dim" aria-hidden="true">&bull;</span>
              {s}
            </p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="py-3">
        <h2 className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-os-green">
          Skills
        </h2>
        <div className="space-y-1">
          {skillRows.map(([cat, tools]) => (
            <p key={cat} className="text-[0.68rem] leading-relaxed text-os-text">
              <span className="inline-block w-36 shrink-0 text-os-blue">{cat}:</span>
              <span className="text-os-dim">{tools.join(", ")}</span>
            </p>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="py-3">
        <h2 className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-os-green">
          Experience
        </h2>
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
      </section>

      {/* Education */}
      <section className="py-3">
        <h2 className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-os-green">
          Education
        </h2>
        {education.map((e) => (
          <p key={e.school} className="text-[0.68rem] leading-relaxed text-os-text">
            <span className="font-bold text-os-accent">
              {e.degree} &#8212; {e.field}
            </span>
            <span className="text-os-dim"> &#183; {e.school} ({e.status})</span>
          </p>
        ))}
      </section>

      {/* Contact footer */}
      <footer className="mt-2 border-t border-os-border pt-3">
        <h2 className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-os-green">
          Contact
        </h2>
        <div className="flex flex-wrap gap-2">
          {contactLinks.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-os-border px-2 py-1.5 text-[0.62rem] text-os-text hover:border-os-accent hover:text-os-accent"
            >
              <AppIcon name={c.name === "Email" ? "contact" : c.name === "GitHub" ? "github" : "about"} size={13} />
              {c.name}
              <span className="text-os-dim">{c.handle}</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-[0.58rem] text-os-dim">
          This resume is rendered live from the same data powering this desktop.
        </p>
      </footer>
    </div>
  );
};

export default ResumeApp;