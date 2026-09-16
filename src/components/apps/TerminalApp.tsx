import React, { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "../../data/portfolio";
import { KERNEL_VERSION } from "../../data/constants";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useOsSound } from "../../context/OsSoundContext";
import type { AppId } from "../../data/appRegistry";
import {
  HOME,
  buildPortfolioFS,
  completePath,
  formatLsChildren,
  normalizePath,
  resolvePath,
  type FSNode,
} from "../../data/terminalFs.tsx";

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

const COMMANDS = [
  "help",
  "ls",
  "cd",
  "pwd",
  "cat",
  "echo",
  "clear",
  "open",
  "whoami",
  "neofetch",
  "sudo",
  "date",
  "uname",
  "history",
  "github",
  "exit",
  "rm",
];

const HELP: [string, string][] = [
  ["help", "show this help"],
  ["ls", "list directory contents"],
  ["cd <path>", "change directory"],
  ["pwd", "print working directory"],
  ["cat <file>", "read a file"],
  ["echo <text>", "print text"],
  ["open <app>", "open an app window"],
  ["whoami", "who am I"],
  ["neofetch", "system info"],
  ["history", "command history"],
  ["clear", "clear the screen"],
  ["tab", "autocomplete commands & paths"],
  ["↑ ↓", "navigate history"],
];

const TerminalApp: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState(HOME);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef("");
  const cwdRef = useRef(HOME);
  valueRef.current = input;
  cwdRef.current = cwd;

  const { windows, activeWindowId, openApp } = useWindowManager();
  const { play } = useOsSound();
  const terminalWindow = windows.find((w) => w.appId === "terminal");
  const isActive = !!terminalWindow && activeWindowId === terminalWindow.id;

  const fsRef = useRef<FSNode | null>(null);
  if (!fsRef.current) fsRef.current = buildPortfolioFS();

  const shortCwd = (path: string) =>
    path === HOME ? "~" : path.startsWith(HOME + "/") ? "~" + path.slice(HOME.length) : path;

  useEffect(() => {
    setLines([
      {
        output: (
          <div>
            <p>
              <span className="font-bold text-os-green">3manuel OS</span>{" "}
              <span className="text-os-dim">{`shell -- portfolio-wm v1.0 / kernel ${KERNEL_VERSION}`}</span>
            </p>
            <p className="text-os-dim">
              a real little filesystem, full tab completion. type{" "}
              <span className="text-os-yellow">help</span> to get started.
            </p>
          </div>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(valueRef.current.length, valueRef.current.length);
      setCursor(valueRef.current.length);
    }
  }, [isActive]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, input]);

  const print = useCallback((raw: string, out: React.ReactNode) => {
    setLines((prev) => [...prev, { input: raw, output: out }]);
  }, []);

  const processCommand = useCallback(
    (raw: string): React.ReactNode => {
      const trimmed = raw.trim();
      const [name, ...args] = trimmed.split(/\s+/).filter(Boolean);
      const fs = fsRef.current!;
      const cwdNow = cwdRef.current;

      const noSuch = (target: string) => (
        <p className="text-os-red">
          {name}: cannot access &lsquo;{target}&rsquo;: No such file or directory
        </p>
      );

      switch (name) {
        case "":
          return null;
        case "help":
          return (
            <div>
              {HELP.map(([c, d]) => (
                <p key={c}>
                  <span className="text-os-green">{c.padEnd(16)}</span>
                  <span className="text-os-dim">{d}</span>
                </p>
              ))}
            </div>
          );
        case "clear":
          setLines([]);
          return null;
        case "pwd":
          return <p className="text-os-text">{cwdNow}</p>;
        case "echo":
          return <p className="text-os-text">{args.join(" ")}</p>;
        case "ls": {
          const target = args[0] ?? ".";
          const node = resolvePath(fs, cwdNow, target);
          if (!node) return noSuch(target);
          if (node.type === "file") {
            return <p className="text-os-text">{target}</p>;
          }
          const listing = formatLsChildren(node);
          if (!listing) return <p className="text-os-dim">(empty)</p>;
          return (
            <p className="text-os-text">
              {listing.split("   ").map((n) => (
                <span
                  key={n}
                  className={
                    n.endsWith("/")
                      ? "mr-3 text-os-blue"
                      : "mr-3 text-os-text"
                  }
                >
                  {n}
                </span>
              ))}
            </p>
          );
        }
        case "cd": {
          const target = args[0] ?? HOME;
          const node = resolvePath(fs, cwdNow, target);
          if (!node) return noSuch(target);
          if (node.type !== "dir") {
            return (
              <p className="text-os-red">
                cd: not a directory: {target}
              </p>
            );
          }
          setCwd(normalizePath(cwdNow, target));
          return null;
        }
        case "cat": {
          const target = args[0];
          if (!target) {
            return (
              <p className="text-os-red">
                usage: cat &lt;file&gt;
              </p>
            );
          }
          const node = resolvePath(fs, cwdNow, target);
          if (!node) return noSuch(target);
          if (node.type === "dir") {
            return (
              <p className="text-os-red">
                cat: {target}: Is a directory
              </p>
            );
          }
          return node.content;
        }
        case "open": {
          const target = args[0];
          if (!target) {
            return (
              <p className="text-os-red">
                usage: open &lt;about|projects|skills|experience|education|contact|github|terminal|system|game|files|notes|settings&gt;
              </p>
            );
          }
          const map: Record<string, AppId> = {
            about: "about",
            projects: "projects",
            skills: "skills",
            experience: "experience",
            education: "education",
            contact: "contact",
            github: "github",
            terminal: "terminal",
            system: "system",
            sysinfo: "system",
            game: "game",
            platformer: "game",
            files: "files",
            explorer: "files",
            notes: "notes",
            blog: "notes",
            settings: "settings",
            control: "settings",
          };
          const appId = map[target.toLowerCase()];
          if (!appId) {
            return (
              <p className="text-os-red">
                open: unknown app: {target}
              </p>
            );
          }
          openApp(appId);
          return <p className="text-os-dim">opening {target}...</p>;
        }
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
                  {KERNEL_VERSION}
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
        case "sudo":
          play("error");
          if (args[0] === "rm" && args.includes("-rf") && args.includes("/")) {
            return <p className="text-os-red">3manuel is not in the sudoers file. This incident will be reported.</p>;
          }
          return <p className="text-os-red">3manuel is not in the sudoers file. This incident will be reported.</p>;
        case "rm":
          return <p className="text-os-yellow">nice try. use the resumé, not the filesystem.</p>;
        case "date":
          return <p className="text-os-text">{new Date().toString()}</p>;
        case "uname":
          return <p className="text-os-text">3manuel-os webassembly 6.9.0-generic x86_64</p>;
        case "history":
          return (
            <div>
              {history.map((h, i) => (
                <p key={i} className="text-os-dim">{`${String(history.length - i).padStart(3)}  ${h}`}</p>
              ))}
              {history.length === 0 && <p className="text-os-dim">no history yet. type something.</p>}
            </div>
          );
        case "github":
          window.open("https://github.com/3manuel0", "_blank", "noopener,noreferrer");
          return <p className="text-os-dim">opening github.com/3manuel0 in a new tab...</p>;
        case "exit":
          return <p className="text-os-dim">this is the portfolio shell -- there is no exit. try "help".</p>;
        case "ls -l":
        case "ll":
          return <p className="text-os-dim">aliases are still being written. try `ls`.</p>;
        default:
          play("error");
          return (
            <p className="text-os-red">
              {name}: command not found. type <span className="text-os-yellow">help</span> for available commands.
            </p>
          );
      }
    },
    [history, openApp, play],
  );

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (cmd === "clear") {
        processCommand(cmd);
        return;
      }
      const out = processCommand(raw);
      setLines((prev) => [...prev, { input: raw, output: out }]);
    },
    [processCommand],
  );

  const runSubmit = useCallback(() => {
    const text = valueRef.current;
    if (!text.trim()) return;
    setHistory((h) => [text, ...h]);
    setHistIdx(-1);
    runCommand(text);
    setInput("");
    setCursor(0);
  }, [runCommand]);

  const navHistory = useCallback(
    (dir: 1 | -1) => {
      if (dir === 1) {
        const next = Math.min(histIdx + 1, history.length - 1);
        if (history[next]) {
          setHistIdx(next);
          setInput(history[next]);
          setCursor(history[next].length);
        }
      } else {
        const next = histIdx - 1;
        if (next < 0) {
          setHistIdx(-1);
          setInput("");
          setCursor(0);
        } else {
          setHistIdx(next);
          setInput(history[next]);
          setCursor(history[next].length);
        }
      }
    },
    [history, histIdx],
  );

  const complete = useCallback(() => {
    const text = valueRef.current;
    const tokens = text.split(/\s+/).filter(Boolean);
    const appMaps: string[] = [];
    if (tokens.length <= 1) {
      const partial = (tokens[0] ?? "").toLowerCase();
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0]);
        setCursor(matches[0].length);
      } else if (matches.length > 1) {
        print(text, (
          <p className="text-os-text">
            {matches.map((m) => (
              <span key={m} className="mr-3 text-os-blue">{m}</span>
            ))}
          </p>
        ));
      }
      void appMaps;
      return;
    }
    const first = tokens[0].toLowerCase();
    if (["cd", "cat", "ls", "open"].includes(first)) {
      const partial = tokens[tokens.length - 1];
      const matches = completePath(fsRef.current!, cwdRef.current, partial);
      if (matches.length === 1) {
        const next = tokens.slice(0, -1).join(" ") + " " + matches[0];
        setInput(next);
        setCursor(next.length);
      } else if (matches.length > 1) {
        print(text, (
          <p className="text-os-text">
            {matches.map((m) => (
              <span key={m} className="mr-3 text-os-blue">{m}</span>
            ))}
          </p>
        ));
      }
    }
  }, [print]);

  // Terminal-wide key capture: typing reaches the shell no matter where focus is
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setLines([]);
        return;
      }
      if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        setLines((prev) => [...prev, { input: "^C", output: null }]);
        setInput("");
        setCursor(0);
        setHistIdx(-1);
        return;
      }

      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        runSubmit();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setInput((v) => v.slice(0, -1));
        setCursor(Math.max(0, valueRef.current.length - 1));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        complete();
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
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setInput((v) => v + e.key);
        setCursor(valueRef.current.length + 1);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [isActive, runSubmit, navHistory, complete]);

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navHistory(-1);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 cursor-text flex-col bg-os-bg font-mono"
      onClick={() => inputRef.current?.focus()}
      role="log"
      aria-label="Terminal output"
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-2 text-[0.68rem] leading-relaxed"
        style={{ overscrollBehavior: "contain" }}
      >
        {lines.map((l, i) => (
          <div key={i} className="mb-1">
            {l.input !== undefined && (
              <p className="whitespace-pre-wrap break-all">
                <span className="text-os-green">3manuel</span>
                <span className="text-os-dim">@localhost</span>
                <span className="text-os-blue">{shortCwd(cwd)}</span>
                <span className="text-os-dim">$ </span>
                <span className="text-os-text">{l.input}</span>
              </p>
            )}
            {l.output && <div className="text-os-text">{l.output}</div>}
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSubmit();
          }}
          className="flex items-center gap-0"
        >
          <label className="shrink-0 cursor-text" aria-hidden="true">
            <span className="text-os-green">3manuel</span>
            <span className="text-os-dim">@localhost</span>
            <span className="text-os-blue">{shortCwd(cwd)}</span>
            <span className="text-os-dim">$ </span>
          </label>
          <span className="relative flex min-w-0 flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.currentTarget.value);
                setCursor(e.currentTarget.selectionStart ?? e.currentTarget.value.length);
              }}
              onSelect={(e) =>
                setCursor(e.currentTarget.selectionStart ?? e.currentTarget.value.length)
              }
              onKeyDown={onKeyDownInput}
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none"
            />
            <span className="pointer-events-none select-none whitespace-pre-wrap break-all">
              <span className="text-os-text">{input.slice(0, cursor)}</span>
              <span className="terminal-block-cursor" aria-hidden="true" />
              {input.length > cursor && (
                <span className="text-os-text">{input.slice(cursor)}</span>
              )}
            </span>
          </span>
        </form>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TerminalApp;