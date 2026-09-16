import React, { useState, type FormEvent } from "react";
import { profile } from "../../data/portfolio";
import { useOsSound } from "../../context/OsSoundContext";
import type { IconName } from "../AppIcons";
import { AppIcon } from "../AppIcons";

const EMAIL = "saiddimension@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${EMAIL}`;

interface MailItem {
  id: number;
  from: string;
  subject: string;
  url?: string;
  copy?: string;
  body?: string[];
  type: "github" | "linkedin" | "x" | "discord" | "form";
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
    from: "Direct Email",
    subject: "Compose a message",
    type: "form",
  },
  {
    id: 3,
    from: "LinkedIn",
    subject: "Let's connect professionally",
    url: "https://www.linkedin.com/in/said-bennaji/",
    body: [
      "Connect with me on LinkedIn to follow my career and reach out for opportunities.",
    ],
    type: "linkedin",
  },
  {
    id: 4,
    from: "X / Twitter",
    subject: "Follow my timeline",
    url: "https://x.com/3manuel_s",
    body: [
      "I share updates on the systems and web projects I'm working on.",
    ],
    type: "x",
  },
  {
    id: 5,
    from: "Discord",
    subject: "Message me on Discord",
    copy: "3manuel",
    body: [
      "Username: 3manuel",
      "Copy it and send me a friend request to start a chat.",
    ],
    type: "discord",
  },
];

const TYPE_ICON: Record<MailItem["type"], IconName> = {
  github: "github",
  linkedin: "linkedin",
  x: "x",
  discord: "discord",
  form: "contact",
};

const ContactApp: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(0);

  const active = selected !== null ? MAILS[selected] : MAILS[0];
  const activeIdx = selected ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Desktop sidebar */}
      <div className="hidden h-full min-h-0 sm:flex">
        <div className="w-56 shrink-0 flex-col border-r border-os-border bg-os-surface/60">
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
                <AppIcon name={TYPE_ICON[m.type]} size={15} />
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

        {/* Message pane (desktop) */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <MessageContent active={active} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex min-h-0 flex-1 flex-col sm:hidden">
        {/* Contact tabs row */}
        <div className="flex shrink-0 overflow-x-auto border-b border-os-border bg-os-surface/60">
          {MAILS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-[0.62rem] transition-colors ${
                activeIdx === i
                  ? "border-os-blue text-os-blue"
                  : "border-transparent text-os-dim hover:text-os-text"
              }`}
            >
              <AppIcon name={TYPE_ICON[m.type]} size={14} />
              <span className="whitespace-nowrap">{m.from}</span>
            </button>
          ))}
        </div>

        {/* Message pane (mobile) */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <MessageContent active={active} />
        </div>
      </div>
    </div>
  );
};

const MessageContent: React.FC<{ active: MailItem }> = ({ active }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(active.copy ?? "").catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (active.type === "form") {
    return <ComposeForm />;
  }

  return (
    <div>
      <p className="text-[0.6rem] text-os-dim">From: {active.from}</p>
      <h2 className="mt-0.5 text-sm font-bold text-os-text">{active.subject}</h2>

      <div className="my-3 border border-os-border bg-os-surface2/50 p-3">
        {active.body?.map((line) => (
          <p key={line} className="mb-2 text-[0.7rem] leading-relaxed text-os-text">
            {line}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {active.copy ? (
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${active.from} username`}
            className="flex items-center gap-1.5 border border-os-accent bg-os-accent/10 px-3 py-1.5 text-[0.65rem] text-os-accent hover:bg-os-accent hover:text-black"
          >
            <AppIcon name={TYPE_ICON[active.type]} size={14} />
            {copied ? "Copied!" : "Copy username"}
          </button>
        ) : (
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${active.from} contact`}
            className="flex items-center gap-1.5 border border-os-accent bg-os-accent/10 px-3 py-1.5 text-[0.65rem] text-os-accent hover:bg-os-accent hover:text-black"
          >
            <AppIcon name={TYPE_ICON[active.type]} size={14} />
            Open {active.from}
          </a>
        )}
        <span className="min-w-0 truncate text-[0.58rem] text-os-dim">
          {active.copy ?? active.url}
        </span>
      </div>

    <div className="mt-5 border-t border-os-border pt-3 font-mono text-[0.6rem] text-os-dim">
        <p>
          <span className="text-os-green">{">"} _</span> replies usually within 24h
          &#8212; {profile.website}
        </p>
      </div>
    </div>
  );
};

type FormStatus = "idle" | "sending" | "sent" | "error";

const INPUT_CLS =
  "w-full border border-solid border-os-border bg-os-surface2/60 px-2.5 py-2 text-[0.72rem] text-os-text placeholder:text-os-dim/70 focus:border-os-accent";

const ComposeForm: React.FC = () => {
  const { play } = useOsSound();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const canSend = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `[3manuel.dev] message from ${name.trim()}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (res.ok && data.success) {
        setStatus("sent");
        play("notify");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <p className="text-[0.6rem] text-os-dim">To: {EMAIL}</p>
      <h2 className="mt-0.5 text-sm font-bold text-os-text">
        Send me a message
      </h2>
      <p className="mt-1 text-[0.62rem] leading-relaxed text-os-dim">
        Landed here from the terminal of the internet &#8212; drop a hello, a job
        offer, or a bug report. Replies land in my inbox.
      </p>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2.5">
        <label className="flex flex-col gap-1">
          <span className="text-[0.58rem] uppercase tracking-widest text-os-dim">
            your name <span className="text-os-red">*</span>
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className={INPUT_CLS}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[0.58rem] uppercase tracking-widest text-os-dim">
            your email <span className="text-os-red">*</span>
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@example.com"
            className={INPUT_CLS}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[0.58rem] uppercase tracking-widest text-os-dim">
            message <span className="text-os-red">*</span>
          </span>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message goes here..."
            className={`${INPUT_CLS} resize-y leading-relaxed`}
          />
        </label>

        {status === "sent" && (
          <div className="border border-os-green bg-os-green/10 px-3 py-2 text-[0.68rem] text-os-green">
            &#10003; message sent &#8212; thanks! I'll get back to you.
          </div>
        )}

        {status === "error" && (
          <div className="border border-os-red bg-os-red/10 px-3 py-2 text-[0.68rem] text-os-red">
            &#9888; relay didn't pick up. Use the mail client link below instead.
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={status === "sending"}
            onClick={() => status === "idle" && play("click")}
            className="border border-os-accent bg-os-accent/10 px-3 py-2 text-[0.65rem] text-os-accent transition-colors hover:bg-os-accent hover:text-black disabled:cursor-wait disabled:opacity-60"
          >
            {status === "sending"
              ? "sending..."
              : status === "sent"
                ? "send another"
                : "\u25b6 send message"}
          </button>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("[3manuel.dev] hi")}`}
            className="border border-os-border bg-os-surface2/60 px-3 py-2 text-[0.65rem] text-os-dim transition-colors hover:text-os-accent"
          >
            open mail client
          </a>
        </div>
      </form>
    </div>
  );
};

export default ContactApp;