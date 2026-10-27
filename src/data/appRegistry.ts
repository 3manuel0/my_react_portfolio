import { lazy, type ComponentType } from "react";
import type { IconName } from "../components/AppIcons";

const AboutApp = lazy(() => import("../components/apps/AboutApp"));
const ProjectsApp = lazy(() => import("../components/apps/ProjectsApp"));
const SkillsApp = lazy(() => import("../components/apps/SkillsApp"));
const ExperienceApp = lazy(() => import("../components/apps/ExperienceApp"));
const EducationApp = lazy(() => import("../components/apps/EducationApp"));
const ContactApp = lazy(() => import("../components/apps/ContactApp"));
const GitHubApp = lazy(() => import("../components/apps/GitHubApp"));
const TerminalApp = lazy(() => import("../components/apps/TerminalApp"));
const SystemInfoApp = lazy(() => import("../components/apps/SystemInfoApp"));
const GameApp = lazy(() => import("../components/apps/GameApp"));
const FilesApp = lazy(() => import("../components/apps/FilesApp"));
const NotesApp = lazy(() => import("../components/apps/NotesApp"));
const SettingsApp = lazy(() => import("../components/apps/SettingsApp"));

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
  | "notes"
  | "settings";

export interface AppDescriptor {
  id: AppId;
  title: string;
  icon: IconName;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  component: ComponentType;
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
  notes: {
    id: "notes",
    title: "Notes",
    icon: "notes",
    defaultSize: { width: 800, height: 560 },
    component: NotesApp,
    category: "Portfolio",
  },
  settings: {
    id: "settings",
    title: "Settings",
    icon: "settings",
    defaultSize: { width: 420, height: 460 },
    component: SettingsApp,
    category: "System",
  },
};

export const APP_LIST = Object.values(APPS);