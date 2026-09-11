import type React from "react";
import type { IconName } from "../components/AppIcons";
import AboutApp from "../components/apps/AboutApp";
import ProjectsApp from "../components/apps/ProjectsApp";
import SkillsApp from "../components/apps/SkillsApp";
import ExperienceApp from "../components/apps/ExperienceApp";
import EducationApp from "../components/apps/EducationApp";
import ResumeApp from "../components/apps/ResumeApp";
import ContactApp from "../components/apps/ContactApp";
import GitHubApp from "../components/apps/GitHubApp";
import TerminalApp from "../components/apps/TerminalApp";
import SystemInfoApp from "../components/apps/SystemInfoApp";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "resume"
  | "contact"
  | "github"
  | "terminal"
  | "system";

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
    icon: "projects",
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
  resume: {
    id: "resume",
    title: "Resume",
    icon: "resume",
    defaultSize: { width: 680, height: 620 },
    component: ResumeApp,
    category: "System",
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
};

export const APP_LIST = Object.values(APPS);