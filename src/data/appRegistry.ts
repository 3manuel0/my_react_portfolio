import type React from "react";
import type { IconName } from "../components/AppIcons";
import AboutApp from "../components/apps/AboutApp";
import ProjectsApp from "../components/apps/ProjectsApp";
import SkillsApp from "../components/apps/SkillsApp";
import ExperienceApp from "../components/apps/ExperienceApp";
import EducationApp from "../components/apps/EducationApp";
import ContactApp from "../components/apps/ContactApp";
import GitHubApp from "../components/apps/GitHubApp";
import TerminalApp from "../components/apps/TerminalApp";
import SystemInfoApp from "../components/apps/SystemInfoApp";
import GameApp from "../components/apps/GameApp";
import FilesApp from "../components/apps/FilesApp";
import MediaPlayerApp from "../components/apps/MediaPlayerApp";
import NotesApp from "../components/apps/NotesApp";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "contact"
  | "github"
  | "terminal"
  | "system"
  | "game"
  | "files"
  | "media"
  | "notes";

export interface AppDescriptor {
  id: AppId;
  title: string;
  icon: IconName;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  component: React.ComponentType;
  category: "Development" | "Portfolio" | "System" | "Apps";
}

export const APPS: Record<AppId, AppDescriptor> = {
  about: {
    id: "about",
    title: "About Me",
    icon: "about",
    defaultSize: { width: 720, height: 560 },
    component: AboutApp,
    category: "Portfolio",
  },
  projects: {
    id: "projects",
    title: "Projects",
    icon: "source",
    defaultSize: { width: 760, height: 560 },
    component: ProjectsApp,
    category: "Portfolio",
  },
  skills: {
    id: "skills",
    title: "Skills",
    icon: "skills",
    defaultSize: { width: 640, height: 520 },
    component: SkillsApp,
    category: "Development",
  },
  experience: {
    id: "experience",
    title: "Experience",
    icon: "experience",
    defaultSize: { width: 620, height: 540 },
    component: ExperienceApp,
    category: "Portfolio",
  },
  education: {
    id: "education",
    title: "Education",
    icon: "education",
    defaultSize: { width: 620, height: 460 },
    component: EducationApp,
    category: "Portfolio",
  },
  contact: {
    id: "contact",
    title: "Contact",
    icon: "contact",
    defaultSize: { width: 620, height: 480 },
    component: ContactApp,
    category: "System",
  },
  github: {
    id: "github",
    title: "GitHub",
    icon: "github",
    defaultSize: { width: 720, height: 560 },
    component: GitHubApp,
    category: "Development",
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    defaultSize: { width: 680, height: 460 },
    component: TerminalApp,
    category: "Development",
  },
  system: {
    id: "system",
    title: "System Info",
    icon: "system",
    defaultSize: { width: 640, height: 520 },
    component: SystemInfoApp,
    category: "System",
  },
  game: {
    id: "game",
    title: "2D Platformer",
    icon: "game",
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 400, height: 320 },
    component: GameApp,
    category: "Apps",
  },
  files: {
    id: "files",
    title: "Files",
    icon: "projects",
    defaultSize: { width: 640, height: 480 },
    component: FilesApp,
    category: "System",
  },
  media: {
    id: "media",
    title: "Media Player",
    icon: "music",
    defaultSize: { width: 480, height: 520 },
    component: MediaPlayerApp,
    category: "Apps",
  },
  notes: {
    id: "notes",
    title: "Notes",
    icon: "notes",
    defaultSize: { width: 800, height: 560 },
    component: NotesApp,
    category: "Portfolio",
  },
};

export const APP_LIST = Object.values(APPS);