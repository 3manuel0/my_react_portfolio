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
  | "terminal"
  | "system"
  | "folder"
  | "file"
  | "firefox"
  | "home"
  | "document"
  | "source"
  | "demo"
  | "location"
  | "star"
  | "fork";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

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
};

const ACCENTS: Partial<Record<IconName, string>> = {
  about: "#c9e89a",
  projects: "#9cc0fb",
  skills: "#d6c9fb",
};

const BRANDS: Partial<Record<IconName, string>> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
};

export const AppIcon: React.FC<IconProps> = ({ name, size = 48, className }) => {
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

