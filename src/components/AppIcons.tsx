import React from "react";

export type IconName =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "contact"
  | "github"
  | "linkedin"
  | "x"
  | "discord"
  | "terminal"
  | "system"
  | "game"
  | "folder"
  | "file"
  | "firefox"
  | "home"
  | "document"
  | "source"
  | "demo"
  | "location"
  | "star"
  | "fork"
  | "music"
  | "notes";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

// Raster icons — rendered as <img> instead of inline SVG. The game app uses
// the same Warrior logo the 2D Platformer game itself uses as its favicon.
const IMAGES: Partial<Record<IconName, string>> = {
  game: "/icons/game-logo.png",
};

interface PixelIcon {
  main: string;
  accent?: string;
}

const PIXELS: Record<IconName, string | PixelIcon> = {
  about: {
    main: "M0,7 h1 v1 h-1 Z M0,8 h1 v1 h-1 Z M1,6 h1 v1 h-1 Z M1,7 h1 v1 h-1 Z M1,8 h1 v1 h-1 Z M2,2 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M2,6 h1 v1 h-1 Z M2,7 h1 v1 h-1 Z M2,8 h1 v1 h-1 Z M3,1 h1 v1 h-1 Z M3,2 h1 v1 h-1 Z M3,3 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M3,6 h1 v1 h-1 Z M3,7 h1 v1 h-1 Z M3,8 h1 v1 h-1 Z M4,1 h1 v1 h-1 Z M4,2 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M4,6 h1 v1 h-1 Z M4,7 h1 v1 h-1 Z M4,8 h1 v1 h-1 Z M5,1 h1 v1 h-1 Z M5,2 h1 v1 h-1 Z M5,3 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z M5,6 h1 v1 h-1 Z M5,7 h1 v1 h-1 Z M5,8 h1 v1 h-1 Z M6,2 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M6,6 h1 v1 h-1 Z M6,7 h1 v1 h-1 Z M6,8 h1 v1 h-1 Z M7,7 h1 v1 h-1 Z M7,8 h1 v1 h-1 Z M8,8 h1 v1 h-1 Z",
    accent: "M3,1 h1 v1 h-1 Z M3,2 h1 v1 h-1 Z M4,1 h1 v1 h-1 Z",
  },
  projects: {
    main: "M0,2 h1 v1 h-1 Z M0,3 h1 v1 h-1 Z M0,4 h1 v1 h-1 Z M0,5 h1 v1 h-1 Z M0,6 h1 v1 h-1 Z M0,7 h1 v1 h-1 Z M0,8 h1 v1 h-1 Z M1,1 h1 v1 h-1 Z M1,2 h1 v1 h-1 Z M1,3 h1 v1 h-1 Z M1,4 h1 v1 h-1 Z M1,5 h1 v1 h-1 Z M1,6 h1 v1 h-1 Z M1,7 h1 v1 h-1 Z M1,8 h1 v1 h-1 Z M2,1 h1 v1 h-1 Z M2,2 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M2,4 h1 v1 h-1 Z M2,5 h1 v1 h-1 Z M2,6 h1 v1 h-1 Z M2,7 h1 v1 h-1 Z M2,8 h1 v1 h-1 Z M3,1 h1 v1 h-1 Z M3,2 h1 v1 h-1 Z M3,3 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M3,6 h1 v1 h-1 Z M3,7 h1 v1 h-1 Z M3,8 h1 v1 h-1 Z M4,2 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M4,6 h1 v1 h-1 Z M4,7 h1 v1 h-1 Z M4,8 h1 v1 h-1 Z M5,2 h1 v1 h-1 Z M5,3 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z M5,6 h1 v1 h-1 Z M5,7 h1 v1 h-1 Z M5,8 h1 v1 h-1 Z M6,2 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M6,4 h1 v1 h-1 Z M6,5 h1 v1 h-1 Z M6,6 h1 v1 h-1 Z M6,7 h1 v1 h-1 Z M6,8 h1 v1 h-1 Z M7,2 h1 v1 h-1 Z M7,3 h1 v1 h-1 Z M7,4 h1 v1 h-1 Z M7,5 h1 v1 h-1 Z M7,6 h1 v1 h-1 Z M7,7 h1 v1 h-1 Z M7,8 h1 v1 h-1 Z M8,2 h1 v1 h-1 Z M8,3 h1 v1 h-1 Z M8,4 h1 v1 h-1 Z M8,5 h1 v1 h-1 Z M8,6 h1 v1 h-1 Z M8,7 h1 v1 h-1 Z M8,8 h1 v1 h-1 Z",
    accent: "M1,3 h1 v1 h-1 Z M1,4 h1 v1 h-1 Z M1,5 h1 v1 h-1 Z M1,6 h1 v1 h-1 Z M1,7 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M2,4 h1 v1 h-1 Z M2,5 h1 v1 h-1 Z M2,6 h1 v1 h-1 Z M2,7 h1 v1 h-1 Z M3,3 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M3,6 h1 v1 h-1 Z M3,7 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M4,6 h1 v1 h-1 Z M4,7 h1 v1 h-1 Z M5,3 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z M5,6 h1 v1 h-1 Z M5,7 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M6,4 h1 v1 h-1 Z M6,5 h1 v1 h-1 Z M6,6 h1 v1 h-1 Z M6,7 h1 v1 h-1 Z M7,3 h1 v1 h-1 Z M7,4 h1 v1 h-1 Z M7,5 h1 v1 h-1 Z M7,6 h1 v1 h-1 Z M7,7 h1 v1 h-1 Z",
  },
  skills: {
    main: "M1,3 h1 v1 h-1 Z M1,4 h1 v1 h-1 Z M1,5 h1 v1 h-1 Z M1,6 h1 v1 h-1 Z M2,2 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M2,4 h1 v1 h-1 Z M2,5 h1 v1 h-1 Z M2,6 h1 v1 h-1 Z M2,7 h1 v1 h-1 Z M3,1 h1 v1 h-1 Z M3,2 h1 v1 h-1 Z M3,3 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M3,6 h1 v1 h-1 Z M3,7 h1 v1 h-1 Z M3,8 h1 v1 h-1 Z M4,1 h1 v1 h-1 Z M4,2 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M4,6 h1 v1 h-1 Z M4,7 h1 v1 h-1 Z M4,8 h1 v1 h-1 Z M5,1 h1 v1 h-1 Z M5,2 h1 v1 h-1 Z M5,3 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z M5,6 h1 v1 h-1 Z M5,7 h1 v1 h-1 Z M5,8 h1 v1 h-1 Z M6,1 h1 v1 h-1 Z M6,2 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M6,4 h1 v1 h-1 Z M6,5 h1 v1 h-1 Z M6,6 h1 v1 h-1 Z M6,7 h1 v1 h-1 Z M6,8 h1 v1 h-1 Z M7,2 h1 v1 h-1 Z M7,3 h1 v1 h-1 Z M7,4 h1 v1 h-1 Z M7,5 h1 v1 h-1 Z M7,6 h1 v1 h-1 Z M7,7 h1 v1 h-1 Z M8,3 h1 v1 h-1 Z M8,4 h1 v1 h-1 Z M8,5 h1 v1 h-1 Z M8,6 h1 v1 h-1 Z",
    accent: "M4,4 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z",
  },
  experience:
    "M1,0 L6,0 6,5 1,5 Z M0,1 L7,1 7,8 0,8 Z M2,2 L5,2 5,3 2,3 Z M1,4 L6,4 6,5 1,5 Z M3,5 L4,5 4,6 3,6 Z",
  education:
    "M0,3 L10,3 10,4 9,4 9,8 10,8 10,9 0,9 0,8 1,8 1,4 0,4 Z M2,4 L8,4 8,8 2,8 Z",
  contact:
    "M0,2 L10,2 10,8 0,8 Z M1,3 L3,5 1,7 Z M9,3 L7,5 9,7 Z M3.5,5.5 L5,6.8 6.5,5.5 9,8 1,8 Z",
  github:
    "M5,0 C2.24,0 0,2.24 0,5 C0,7.21 1.42,9.1 3.4,9.8 C3.65,9.85 3.75,9.7 3.75,9.57 C3.75,9.45 3.75,9.1 3.74,8.63 C2.35,8.93 2.06,7.97 2.06,7.97 C1.84,7.36 1.51,7.2 1.51,7.2 C1.05,6.9 1.55,6.9 1.55,6.9 C2.06,6.94 2.32,7.43 2.32,7.43 C2.75,8.16 3.45,7.95 3.76,7.84 C3.81,7.51 3.95,7.28 4.1,7.15 C3,7.04 1.84,6.62 1.84,4.71 C1.84,4.17 2.05,3.73 2.36,3.39 C2.3,3.28 2.11,2.78 2.38,2.09 C2.38,2.09 2.8,1.98 3.74,2.62 C4.13,2.52 4.55,2.47 4.97,2.47 C5.39,2.47 5.81,2.52 6.2,2.62 C7.14,1.98 7.56,2.09 7.56,2.09 C7.83,2.78 7.64,3.28 7.58,3.39 C7.89,3.73 8.1,4.17 8.1,4.71 C8.1,6.63 6.93,7.04 5.83,7.15 C6.02,7.31 6.18,7.62 6.18,8.11 C6.18,8.8 6.17,9.37 6.17,9.57 C6.17,9.7 6.27,9.85 6.53,9.8 C8.58,9.1 10,7.21 10,5 C10,2.24 7.76,0 5,0 Z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  discord: "M3,1 L7,1 7,3 8,3 8,5 7,5 7,7 8,7 8,9 7,9 3,9 2,9 2,7 3,7 3,5 2,5 2,3 3,3 Z",
  terminal:
    "M0,1 L10,1 10,9 0,9 Z M1,2 L3,4.5 1,7 Z M4,5 L5,5 5,7 4,7 Z M6,5 L8,5 8,7 6,7 Z",
  system:
    "M1,1 L9,1 9,7 1,7 Z M4,7 L4,8 3,9 7,9 6,8 6,7 Z",
  folder:
    "M1,2 L9,2 9,3 1,3 Z M0,3 L10,3 0,3 0,8 10,8 0,8 Z",
  firefox:
    "M1,3 L2,2 5,3 6,3 9,2 9,6 7,7 7,5 6,5 6,8 5,8 5,7 4,7 4,8 2,8 1,6 Z M7,6 L7,8 8,8 8,6 Z",
  file:
    "M1,1 L7,1 7,9 1,9 Z M7,1 L9,3 9,9 7,9 Z",
  home:
    "M1,5 L5,1 9,5 9,8 1,8 Z",
  document:
    "M2,1 L6,1 6,2 7,2 7,3 8,3 8,8 2,8 Z",
  source:
    "M2.5,2 L0,4.5 2.5,7 Z M7.5,2 L10,4.5 7.5,7 Z",
  demo: "M3,2 L9,5 3,8 Z",
  location: "M5,0 C6.1,0 7.5,1 7.5,2.5 C7.5,4 5,6 5,6 C5,6 2.5,4 2.5,2.5 C2.5,1 3.9,0 5,0 Z M5,2.5 C5.55,2.5 6,2.95 6,3.5 C6,4.05 5.55,4.5 5,4.5 C4.45,4.5 4,4.05 4,3.5 C4,2.95 4.45,2.5 5,2.5 Z",
  star: "M5,1 L6,3.4 8.5,3.7 6.7,5.5 7.2,8 5,6.8 2.8,8 3.3,5.5 1.5,3.7 4,3.4 Z",
  fork: "M3,1 L3,5 C3,6 4,6.5 5,6.5 C6,6.5 7,6 7,5 L7,1 Z M3,1 C3,0.5 3.5,0 4,0 C4.5,0 5,0.5 5,1 M5,1 L7,1 C7,0.5 7.5,0 8,0 C8.5,0 9,0.5 9,1 L9,5 C9,7 7,8 5,8 C3,8 1,7 1,5 Z",
  game: {
    main: "M3,2 h1 v1 h-1 Z M4,2 h1 v1 h-1 Z M5,2 h1 v1 h-1 Z M6,2 h1 v1 h-1 Z M2,3 h1 v1 h-1 Z M3,3 h1 v1 h-1 Z M4,3 h1 v1 h-1 Z M5,3 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M7,3 h1 v1 h-1 Z M1,4 h1 v1 h-1 Z M2,4 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M5,4 h1 v1 h-1 Z M6,4 h1 v1 h-1 Z M7,4 h1 v1 h-1 Z M8,4 h1 v1 h-1 Z M0,5 h1 v1 h-1 Z M1,5 h1 v1 h-1 Z M2,5 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M4,5 h1 v1 h-1 Z M5,5 h1 v1 h-1 Z M6,5 h1 v1 h-1 Z M7,5 h1 v1 h-1 Z M8,5 h1 v1 h-1 Z M0,6 h1 v1 h-1 Z M1,6 h1 v1 h-1 Z M7,6 h1 v1 h-1 Z M8,6 h1 v1 h-1 Z M3,7 h1 v1 h-1 Z M4,7 h1 v1 h-1 Z M5,7 h1 v1 h-1 Z M6,7 h1 v1 h-1 Z M4,8 h1 v1 h-1 Z M5,8 h1 v1 h-1 Z",
    accent: "M3,3 h1 v1 h-1 Z M2,4 h1 v1 h-1 Z M3,4 h1 v1 h-1 Z M4,4 h1 v1 h-1 Z M3,5 h1 v1 h-1 Z M6,3 h1 v1 h-1 Z M7,4 h1 v1 h-1 Z M6,5 h1 v1 h-1 Z",
  },
  music: "M3,1 h1 v6 h-1 Z M3,6 h2 v2 h-1 Z M6,1 h1 v6 h-1 Z M6,6 h2 v2 h-1 Z",
  notes: {
    main: "M1,0 h7 v1 h-7 Z M1,0 h1 v9 h-1 Z M8,0 h1 v9 h-1 Z M1,8 h7 v1 h-7 Z",
    accent:
      "M3,2 h3 v1 h-3 Z M3,4 h4 v1 h-4 Z M3,6 h3 v1 h-3 Z M8,6 h1 v1 h-1 Z M7,7 h2 v1 h-2 Z",
  },
};

const COLORS: Record<string, string> = {
  about: "#9ece6a",
  projects: "#7aa2f7",
  skills: "#bb9af7",
  experience: "#e0af68",
  education: "#7dcfff",
  contact: "#f7768e",
  github: "#c8d1e0",
  linkedin: "#7aa2f7",
  x: "#7dcfff",
  discord: "#5865F2",
  music: "#5eead4",
  terminal: "#5eead4",
  system: "#7aa2f7",
  folder: "#7aa2f7",
  file: "#78829a",
  firefox: "#e0af68",
  home: "#7dcfff",
  document: "#e0af68",
  source: "#9ece6a",
  demo: "#5eead4",
  location: "#7dcfff",
  star: "#e0af68",
  fork: "#78829a",
  game: "#f7768e",
  notes: "#7dcfff",
};

const ACCENTS: Partial<Record<IconName, string>> = {
  about: "#c9e89a",
  projects: "#9cc0fb",
  skills: "#d6c9fb",
  game: "#ffb3c1",
  notes: "#e6f8ff",
};

const BRANDS: Partial<Record<IconName, string>> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  discord:
    "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z",
  music:
    "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
};

export const AppIcon: React.FC<IconProps> = ({ name, size = 48, className }) => {
  const img = IMAGES[name];
  if (img) {
    return (
      <img
        src={img}
        width={size}
        height={size}
        alt=""
        draggable={false}
        className={className}
        style={{ imageRendering: "pixelated" }}
      />
    );
  }
  const brand = BRANDS[name];
  if (brand) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <path d={brand} fill={COLORS[name] ?? "#7aa2f7"} />
      </svg>
    );
  }
  const d = typeof PIXELS[name] === "string" ? (PIXELS[name] as string) : PIXELS[name].main;
  const accent =
    typeof PIXELS[name] === "object" ? PIXELS[name].accent : undefined;
  const fill = COLORS[name] ?? "#7aa2f7";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={className}
      aria-hidden="true"
      style={{ shapeRendering: "crispEdges" }}
    >
      <path d={d} fill={fill} opacity={0.35} transform="translate(0.5,0.5)" />
      <path d={d} fill={fill} />
      {accent && <path d={accent} fill={ACCENTS[name] ?? fill} />}
    </svg>
  );
};

