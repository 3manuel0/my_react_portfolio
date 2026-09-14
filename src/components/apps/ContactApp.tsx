import React, { useState } from "react";
import { profile } from "../../data/portfolio";
import { AppIcon } from "../AppIcons";

interface MailItem {
  id: number;
  from: string;
  subject: string;
  url: string;
  body: string[];
  type: "github" | "linkedin" | "x" | "web";
}

const MAILS: MailItem[] = [
  {
    id: 1,
    from: "GitHub",
    subject: "Check out my repositories",
    url: "https://github.com/3manuel0",
    body: [
      "You'll find C libraries, a GB emulator, WebAssembly experiments, an Android app, a Rust/Slint desktop app and more.",
      "Everything here is open source. Feel free to browse, open issues, or send a PR.",
    ],
    type: "github",
  },
  {
    id: 2,
    from: "LinkedIn",
    subject: "Let's connect professionally",
    url: "https://www.linkedin.com/in/said-bennaji/",
    body: [
      "Connect with me on LinkedIn to follow my career and reach out for opportunities.",
    ],
    type: "linkedin",
  },
  {
    id: 3,
    from: "X / Twitter",
    subject: "Follow my timeline",
    url: "https://x.com/3manuel_s",
    body: [
      "I share updates on the systems and web projects I'm working on.",
    ],
    type: "x",
  },
  {
    id: 4,
    from: "Website",
    subject: "Visit my portfolio",
    url: profile.website,
    body: [
      "My personal site built as an interactive desktop experience.",
      "Browse projects, skills, and everything I'm working on.",
    ],
    type: "web",
  },
];

const TYPE_ICON: Record<MailItem["type"], string> = {
  github: "github",
  linkedin: "linkedin",
  x: "x",
  web: "home",
};

const ContactApp: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);

  const active = selected !== null ? MAILS[selected] : MAILS[0];
  const activeIdx = selected ?? 0;

  return (
    <div className="flex h-full min-h-0">
      {/* Inbox sidebar */}
      <div className="hidden w-56 shrink-0 flex-col border-r border-os-border bg-os-surface/60 sm:flex">
        <div className="border-b border-os-border px-3 py-2">
          <p className="font-mono text-[0.6rem] text-os-dim">/var/mail/3manuel</p>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {MAILS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex w-full items-center gap-2 px-2 py-2 text-left transition-colors ${
                activeIdx === i
                  ? "bg-os-blue/15 text-os-blue"
                  : "text-os-text hover:bg-os-blue/10"
              }`}
            >
              <AppIcon name={TYPE_ICON[m.type] as never} size={15} />
              <span className="min-w-0">
                <span className="block truncate text-[0.68rem] font-bold">
                  {m.from}
                </span>
                <span className="block truncate text-[0.58rem] text-os-dim">
                  {m.subject}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Message pane */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <p className="text-[0.6rem] text-os-dim">From: {active.from}</p>
        <h2 className="mt-0.5 text-sm font-bold text-os-text">{active.subject}</h2>

        <div className="my-3 border border-os-border bg-os-surface2/50 p-3">
          {active.body.map((line) => (
            <p key={line} className="mb-2 text-[0.7rem] leading-relaxed text-os-text">
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${active.from} contact`}
            className="flex items-center gap-1.5 border border-os-accent bg-os-accent/10 px-3 py-1.5 text-[0.65rem] text-os-accent hover:bg-os-accent hover:text-black"
          >
            <AppIcon name={TYPE_ICON[active.type] as never} size={14} />
            Open {active.from}
          </a>
          <span className="text-[0.58rem] text-os-dim">{active.url}</span>
        </div>

        <div className="mt-5 border-t border-os-border pt-3 font-mono text-[0.6rem] text-os-dim">
          <p>
            <span className="text-os-green">{">"} _</span> replies usually within 24h
            &#8212; {profile.website}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactApp;