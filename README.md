# 3manuel OS — Portfolio Desktop

A retro-themed "operating system" portfolio built with **React + TypeScript + Vite + Tailwind CSS**. Your resume runs as a fully functional desktop environment in the browser.

> This project was built with the assistance of AI (code generated and reviewed by an AI assistant).

## Features

- **Window manager** — drag, resize, minimize, maximize and focus windows
- **Boot screen** — a short animated boot sequence before the desktop appears
- **Taskbar + start menu** — click the `3manuel` button to launch apps; open windows appear with live status
- **Desktop icons** — double-click (or single tap on touch) to open an app
- **Apps** — About, Projects (personal & work), Skills, Experience, Education, GitHub, Contact, System Info, a **Notes** reader, and a working **Terminal** shell (`help` / `neofetch` / `sudo` for a surprise — plus `grep`, `tree`, `man <cmd>`, and `uptime`)
- **Notes** — a lightweight blog/notes reader (`#/notes`) with a tiny markdown renderer, tag & search filtering, and plain-text exports available in the terminal's virtual `~/notes` directory
- **Sound effects** — synthesized retro WebAudio blips (boot, window open/close, minimize/maximize, terminal errors). No audio files; they respect the taskbar's master volume slider and mute toggle
- **Easter eggs** — right-click the desktop for the context menu: invert colors, change the **wallpaper**, pick an **accent color**, lock the screen, `sudo rm -rf /` (a theatrical BSOD — nothing is deleted), restart, or shut down
- **First-visit tour** — a short guided overlay the first time you boot, pointing out icons, the taskbar, right-click easter eggs and shortcuts
- **Hash routing** — deep-link to an app with `#/about`, `#/projects`, etc.
- **Responsive** — works with one-handed phone use down to 320px wide
- **Accessible** — keyboard navigable, with ARIA labels throughout

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Alt+→` / `Ctrl+Alt+←` | Cycle to next / previous open window |
| `Ctrl+Alt+Q` | Close the active window |
| `Ctrl+Alt+T` | Open the Terminal |
| `Shift` or `Ctrl` + drag | Snap a dragging window to the 8px grid |

> Alt+Tab / Alt+F4 are reserved by the OS and browser, so the window manager uses `Ctrl+Alt` combos instead.

## Terminal

The built-in shell runs a tiny virtual filesystem (`~/` with resumé, projects and notes) and remembers your history between reloads.

| Command | What it does |
| --- | --- |
| `help` | list all commands |
| `ls [path]` | list directory contents (files colored by type) |
| `cd <path>` | change directory |
| `pwd` | print working directory |
| `cat <file>` | read a file |
| `grep <pat> [path]` | search file contents (case-insensitive regex, recursive) |
| `tree [path]` | print a directory tree |
| `man <cmd>` | read a command manual (`cmd --help` also works) |
| `uptime` | session uptime + total time spent in the portfolio |
| `echo <text>` | print text |
| `open <app>` | open an app window |
| `whoami` / `neofetch` | identity / system info |
| `history` | command history (persisted) |
| `clear` | clear the screen |
| `tab` | autocomplete commands & paths |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build
npm run lint      # ESLint
npm run preview   # preview the production build
npm run deploy    # build and publish to GitHub Pages
```

## Project structure

```
src/
├── components/
│   ├── Boot/        # boot screen
│   ├── Desktop/     # wallpaper + desktop icons
│   ├── OS/          # context menu, welcome tour, fake rm -rf terminal
│   ├── Taskbar/     # taskbar, start menu, clock
│   ├── Window/      # draggable/resizable window chrome
│   └── apps/        # the actual portfolio content apps
├── audio/           # WebAudio UI sound effects (no audio files)
├── context/
│   ├── WindowManagerContext.tsx   # window state, focus, hotkeys, routing
│   ├── OsSettingsContext.tsx      # invert, wallpaper, scanlines, accent palettes
│   ├── OsSoundContext.tsx         # master volume/mute + sfx playback
│   └── OsModeContext.tsx          # phone/desktop device mode
├── data/
│   ├── appRegistry.ts             # app metadata (titles, sizes, icons)
│   ├── portfolio.ts               # all resume content + project data
│   ├── notes.ts                   # blog/notes content (markdown-ish)
│   └── terminalFs.tsx             # virtual filesystem for the terminal
└── index.css                      # CRT/retro theme, fonts, animations
```

## Theming

- Colors, fonts and the `os-*` utility palette live in `tailwind.config.js`
- Eight **accent palettes** are available (Settings → Appearance or the context menu), driven by the `os-accent` CSS variable
- Wallpapers are pure SVG in `src/components/Desktop/Wallpaper.tsx` — add variants and they appear automatically in the right-click menu
- The dark "CRT" look (scanlines, flicker, pixel icons) is defined in `src/index.css`

## Changelog

### 2026-10-10

- **Terminal** — new `grep`, `tree`, `man`/`--help` and `uptime` commands, coloring for `ls`, and command history now persists to `localStorage`; Tab-completion covers the new commands
- **First-visit tour** — a guided 6-step overlay on the first boot (icons, taskbar, right-click easter eggs, shortcuts), skippable and shown once
- **Accent palettes** — eight selectable accent colors in Settings → Appearance and the right-click menu; the terminal cursor follows the accent
- **Window snap-to-grid** — hold `Shift`/`Ctrl` while dragging a window to snap it to an 8px grid (with a dashed outline hint)
- **Stats easter egg** — `uptime` reports time spent in the portfolio since your first visit
- **Bug fixes** — double-clicking the minimize/maximize/close buttons no longer also toggles maximize; Projects app gains a folder switcher on phone
- **Removed** the Matrix Rain easter egg