import React, { useCallback, useEffect, useRef, useState } from "react";
import { contactLinks, education, experience, profile, skills } from "../../data/portfolio";
import { useWindowManager } from "../../context/WindowManagerContext";

interface Line {
  input?: string;
  output: React.ReactNode;
}

const NEOFETCH_ART = `       .--.
      |o_o |
      |:_/ |
     //   \\ \\
    (|     | )
   /'\\_   _/\`\\
   \\___)=(___/`;

const HELP: [string, string][] = [
  ["help", "show this help"],
  ["about", "about the developer"],
  ["projects", "list projects"],
  ["skills", "list skills"],
  ["experience", "list experience"],
  ["education", "list education"],
  ["contact", "show contact info"],
  ["github", "open github profile"],
  ["neofetch", "system info"],
  ["whoami", "who am I"],
  ["clear", "clear the screen"],
  ["sudo", "try it"],
];

const TerminalApp: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef("");
  valueRef.current = input;

  const { windows, activeWindowId } = useWindowManager();
  const terminalWindow = windows.find((w) => w.appId === "terminal");
  const isActive = !!terminalWindow && activeWindowId === terminalWindow.id;

  useEffect(() => {
    setLines([
      {
        output: (
          <div>
            <p>3manuel OS shell -- type <span className="text-os-yellow">help</span> to get started.</p>
            <p>portfolio-wm v1.0.0 / kernel 6.9.0-webassembly</p>
          </div>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines]);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "clear") {
      processCommand(cmd);
      return;
    }
    const out = processCommand(cmd);
    setLines((prev) => [...prev, { input: raw, output: out }]);
  }, []);

  const runSubmit = useCallback(() => {
    const text = valueRef.current;
    if (!text.trim()) return;
    setHistory((h) => [text, ...h]);
    setHistIdx(-1);
    runCommand(text);
    setInput("");
  }, [runCommand]);

  const navHistory = useCallback(
    (dir: 1 | -1) => {
      if (dir === 1) {
        const next = Math.min(histIdx + 1, history.length - 1);
        if (history[next]) {
          setHistIdx(next);
          setInput(history[next]);
        }
      } else {
        const next = histIdx - 1;
        if (next < 0) {
          setHistIdx(-1);
          setInput("");
        } else {
          setHistIdx(next);
          setInput(history[next]);
        }
      }
    },
    [history, histIdx],
  );

  // Terminal-wide key capture: typing reaches the shell no matter where focus is
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }
      if (!isActive) return;

      if (e.key === "Enter") {
        e.preventDefault();
        runSubmit();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setInput((v) => v.slice(0, -1));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setInput((v) => v + "    ");
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        navHistory(1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navHistory(-1);
        return;
      }
      if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        setLines((prev) => [...prev, { input: "^C", output: null }]);
        setInput("");
        setHistIdx(-1);
        return;
      }
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setLines([]);
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setInput((v) => v + e.key);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [isActive, runSubmit, navHistory]);

  const processCommand = (cmd: string): React.ReactNode => {
    const name = cmd.split(/\s+/)[0];

    switch (name) {
      case "":
        return null;
      case "help":
        return (
          <div>
            {HELP.map(([c, d]) => (
              <p key={c}>
                <span className="text-os-green">{c.padEnd(10)}</span>
                <span className="text-os-dim">{d}</span>
              </p>
            ))}
          </div>
        );
      case "clear":
        setLines([]);
        return null;
      case "whoami":
        return (
          <div className="whitespace-pre">
            {`${profile.alias}\n\n${profile.title}\nC/C++ · Linux · WebAssembly · React`}
          </div>
        );
      case "neofetch":
        return (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <pre className="shrink-0 whitespace-pre text-os-green text-[0.6rem] leading-tight">
              {NEOFETCH_ART}
            </pre>
            <div className="text-[0.62rem] leading-5">
              <p>
                <span className="text-os-accent">{profile.alias}@localhost</span>
                <span className="text-os-text">---------------</span>
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">OS:</span>{" "}
                {profile.alias} OS
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Host:</span>{" "}
                {profile.website}
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Kernel:</span>{" "}
                6.9.0-webassembly
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Shell:</span>{" "}
                portfolio
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Theme:</span>{" "}
                dark
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Stack:</span>{" "}
                React + TypeScript
              </p>
              <p>
                <span className="inline-block w-24 text-os-blue">Uptime:</span>{" "}
                2022 2026
              </p>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="whitespace-pre">
            {`${profile.name}\n${profile.title}\n${profile.location}\n\n${profile.bio}\n\nwaiting for: ${profile.lookingFor}`}
          </div>
        );
      case "projects":
        return (
          <div>
            {experience_flatProjects()}
            <p className="text-os-dim">open the Projects app for details, screenshots and demos.</p>
          </div>
        );
      case "skills":
        return (
          <div>
            {Object.entries(skills).map(([cat, tools]) => (
              <p key={cat}>
                <span className="text-os-blue">{cat}:</span>{" "}
                <span className="text-os-text">{tools.join(", ")}</span>
              </p>
            ))}
          </div>
        );
      case "experience":
        return (
          <div>
            {experience.map((g) => (
              <div key={g.year}>
                <p className="text-os-yellow">[{g.year}]</p>
                {g.entries.map((e) => (
                  <p key={e.role} className="text-os-text">
                    {"  "}
                    {e.role} <span className="text-os-dim">@ {e.company}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        );
      case "education":
        return (
          <div>
            {education.map((e) => (
              <p key={e.school} className="text-os-text">
                <span className="text-os-accent">{e.degree}</span> — {e.field}{" "}
                <span className="text-os-dim">@{e.school}</span>
              </p>
            ))}
          </div>
        );
      case "contact":
        return (
          <div>
            {contactLinks.map((c) => (
              <p key={c.name}>
                <span className="text-os-blue">{c.name.padEnd(8)}</span>
                <span className="text-os-text">{c.handle}</span>
                <span className="text-os-dim"> ({c.url})</span>
              </p>
            ))}
          </div>
        );
      case "github":
        window.open("https://github.com/3manuel0", "_blank", "noopener,noreferrer");
        return <p className="text-os-dim">opening github.com/3manuel0 in a new tab...</p>;
      case "sudo":
        return <p className="text-os-red">3manuel is not in the sudoers file. This incident will be reported.</p>;
      case "date":
        return <p className="text-os-text">{new Date().toString()}</p>;
      case "ls":
        return <p className="text-os-text">about/ projects/ skills/ experience/ education/ resume.txt contact/ terminal</p>;
      case "exit":
        return <p className="text-os-dim">this is the portfolio shell -- there is no exit. try "help".</p>;
      default:
        return (
          <p className="text-os-red">
            {name}: command not found. type <span className="text-os-yellow">help</span> for available commands.
          </p>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSubmit();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navHistory(-1);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 cursor-text flex-col bg-[#0d1219] font-mono"
      onClick={() => inputRef.current?.focus()}
      role="log"
      aria-label="Terminal output"
    >
      <div className="flex-1 overflow-y-auto px-3 py-2 text-[0.68rem] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className="mb-1">
            {l.input !== undefined && (
              <p>
                <span className="text-os-green">3manuel@localhost</span>
                <span className="text-os-dim">:~$</span>
                <span className="inline-block w-2" />
                <span className="text-os-text">{l.input}</span>
              </p>
            )}
            {l.output && <div className="text-os-text">{l.output}</div>}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-0">
          <label className="shrink-0 cursor-text">
            <span className="text-os-green">3manuel@localhost</span>
            <span className="text-os-dim">:~$</span>
            <span className="inline-block w-2" />
          </label>
          <span className="relative flex min-w-0 flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command input"
              autoComplete="off"
              spellCheck={false}
              className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none"
            />
            <span className="pointer-events-none select-none whitespace-pre-wrap break-all">
              <span className="text-os-text">{input}</span>
              <span
                className="terminal-block-cursor"
                aria-hidden="true"
              />
            </span>
          </span>
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
};

function experience_flatProjects(): React.ReactNode {
  return (
    <div>
      <p className="text-os-accent">~/projects</p>
      {[
        "C3SV (C)",
        "Lib3man (C)",
        "3bs_Downloader (Python)",
        "Cloud Infrastructure & SecOps",
        "2d Platformer Game (C/Raylib/WASM)",
        "Gameboy Emulator (C)",
        "FToP — File to PNG (C/WASM)",
        "Sphia Discord Bot (C++)",
        "Chinese Flashcards (Rust/Slint)",
        "Audio Player (Kotlin/Android)",
      ].map((p) => (
        <p key={p} className="text-os-text">
          {"  "}
          {p}
        </p>
      ))}
    </div>
  );
}

export default TerminalApp;