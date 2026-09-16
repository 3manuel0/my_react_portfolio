# 3manuel OS — Portfolio Desktop

A retro-themed "operating system" portfolio built with **React + TypeScript + Vite + Tailwind CSS**. Your resume runs as a fully functional desktop environment in the browser.

> This project was built with the assistance of AI (code generated and reviewed by an AI assistant).

## Features

- **Window manager** — drag, resize, minimize, maximize and focus windows
- **Boot screen** — a short animated boot sequence before the desktop appears
- **Taskbar + start menu** — click the `3manuel` button to launch apps; open windows appear with live status
- **Desktop icons** — double-click (or single tap on touch) to open an app
- **Apps** — About, Projects (personal & work), Skills, Experience, Education, GitHub, Contact, System Info, a **Notes** reader, and a working **Terminal** shell (`help` to list commands / `neofetch` / `sudo` for a surprise)
- **Notes** — a lightweight blog/notes reader (`#/notes`) with a tiny markdown renderer, tag & search filtering, and plain-text exports available in the terminal's virtual `~/notes` directory
- **Sound effects** — synthesized retro WebAudio blips (boot, window open/close, minimize/maximize, terminal errors). No audio files; they respect the taskbar's master volume slider and mute toggle
- **Easter eggs** — right-click the desktop for the context menu: enter the Matrix, invert colors, change the **wallpaper**, lock the screen, `sudo rm -rf /` (a theatrical BSOD — nothing is deleted), restart, or shut down
- **Hash routing** — deep-link to an app with `#/about`, `#/projects`, etc.
- **Responsive** — works with one-handed phone use down to 320px wide
- **Accessible** — keyboard navigable, with ARIA labels throughout

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Alt+→` / `Ctrl+Alt+←` | Cycle to next / previous open window |
| `Ctrl+Alt+Q` | Close the active window |
| `Ctrl+Alt+T` | Open the Terminal |

> Alt+Tab / Alt+F4 are reserved by the OS and browser, so the window manager uses `Ctrl+Alt` combos instead.

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
│   ├── OS/          # context menu, matrix rain, fake rm -rf terminal
│   ├── Taskbar/     # taskbar, start menu, clock
│   ├── Window/      # draggable/resizable window chrome
│   └── apps/        # the actual portfolio content apps
├── audio/           # WebAudio UI sound effects (no audio files)
├── context/
│   ├── WindowManagerContext.tsx   # window state, focus, hotkeys, routing
│   ├── OsSoundContext.tsx         # master volume/mute + sfx playback
│   └── OsModeContext.tsx          # phone/desktop device mode
├── data/
│   ├── appRegistry.ts             # app metadata (titles, sizes, icons)
│   ├── portfolio.ts               # all resume content + project data
│   └── notes.ts                   # blog/notes content (markdown-ish)
└── index.css                      # CRT/retro theme, fonts, animations
```

## Theming

- Colors, fonts and the `os-*` utility palette live in `tailwind.config.js`
- Wallpapers are pure SVG in `src/components/Desktop/Wallpaper.tsx` — add variants and they appear automatically in the right-click menu
- The dark "CRT" look (scanlines, flicker, pixel icons) is defined in `src/index.css`