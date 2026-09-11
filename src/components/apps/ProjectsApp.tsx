import React, { useState } from "react";
import {
  professionalProjects,
  personalProjects,
  type ProjectType,
} from "../../data/portfolio";
import { TechIcon } from "../apps/shared";
import { AppIcon } from "../AppIcons";

type Folder = "personal" | "professional";

const ProjectCard: React.FC<{
  project: ProjectType;
  onOpen: () => void;
}> = ({ project, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group flex cursor-pointer flex-col border border-os-border bg-os-surface2/50 p-2 text-left transition-colors hover:border-os-accent"
  >
    <div className="relative aspect-video overflow-hidden border border-os-border">
      <img
        src={project.screenshot}
        alt={project.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute left-1 top-1 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 text-[0.5rem] text-os-green">
        <AppIcon name="file" size={10} />
        <span className="truncate max-w-[120px]">{project.name}</span>
      </span>
    </div>
    <div className="mt-2 flex items-center gap-1 px-0.5">
      <AppIcon name="source" size={12} />
      <span className="text-[0.72rem] font-bold text-os-accent">
        {project.name}
      </span>
    </div>
    <p className="mt-1 line-clamp-2 px-0.5 text-[0.62rem] leading-relaxed text-os-dim">
      {project.description}
    </p>
  </button>
);

const ProjectDetail: React.FC<{
  project: ProjectType;
  onBack: () => void;
}> = ({ project, onBack }) => (
  <div className="p-4">
    <button
      type="button"
      onClick={onBack}
      className="mb-3 flex items-center gap-1 border border-os-border px-2 py-1 text-[0.62rem] text-os-text hover:border-os-accent hover:text-os-accent"
    >
      <span aria-hidden="true">&larr;</span> back to ~/projects
    </button>

    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="aspect-video overflow-hidden border border-os-border">
          <img
            src={project.screenshot}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.githubSrcCode && (
            <a
              href={project.githubSrcCode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-os-border px-2.5 py-1.5 text-[0.62rem] text-os-text hover:border-os-green hover:text-os-green"
            >
              <AppIcon name="github" size={13} /> Source Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-os-border px-2.5 py-1.5 text-[0.62rem] text-os-text hover:border-os-cyan hover:text-os-cyan"
            >
              <AppIcon name="demo" size={13} /> Live Demo
            </a>
          )}
        </div>
      </div>

      <div>
        <p className="text-[0.6rem] text-os-dim">
          ~/projects/
          {project.type === "professional" ? "work" : "personal"}/{project.name.replace(/\s+/g, "_")}
        </p>
        <h2 className="mt-1 text-lg font-bold text-os-green">{project.name}</h2>
        <p className="mt-2 text-[0.72rem] leading-relaxed text-os-text">
          {project.description}
        </p>

        <div className="mt-4">
          <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-widest text-os-dim">
            Languages &amp; Tools
          </p>
          <div className="flex flex-wrap items-end gap-3 pb-3">
            {project.languages?.map((l) => (
              <TechIcon key={l} name={l} size={26} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectsApp: React.FC = () => {
  const [folder, setFolder] = useState<Folder>("personal");
  const [selected, setSelected] = useState<ProjectType | null>(null);

  const projects =
    folder === "personal" ? personalProjects : professionalProjects;

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar */}
      <div className="hidden w-44 shrink-0 flex-col border-r border-os-border bg-os-surface/60 p-2 sm:flex">
        <p className="mb-2 px-1 text-[0.55rem] uppercase tracking-widest text-os-dim">
          ~/projects
        </p>
        <button
          type="button"
          onClick={() => {
            setFolder("personal");
            setSelected(null);
          }}
          className={`flex items-center gap-1.5 px-1.5 py-1 text-[0.68rem] transition-colors ${
            folder === "personal"
              ? "bg-os-blue/15 text-os-blue"
              : "text-os-text hover:bg-os-blue/10"
          }`}
        >
          <AppIcon name="folder" size={15} /> personal/
        </button>
        <button
          type="button"
          onClick={() => {
            setFolder("professional");
            setSelected(null);
          }}
          className={`flex items-center gap-1.5 px-1.5 py-1 text-[0.68rem] transition-colors ${
            folder === "professional"
              ? "bg-os-blue/15 text-os-blue"
              : "text-os-text hover:bg-os-blue/10"
          }`}
        >
          <AppIcon name="folder" size={15} /> work/
        </button>
        <div className="mt-4 border-t border-os-border pt-2">
          <p className="mb-1 px-1 text-[0.55rem] uppercase tracking-widest text-os-dim">
            Info
          </p>
          <p className="px-1 text-[0.6rem] leading-relaxed text-os-dim">
            {personalProjects.length} personal + {professionalProjects.length}{" "}
            work projects. Click a card to open details.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="min-h-0 flex-1">
        {selected ? (
          <ProjectDetail project={selected} onBack={() => setSelected(null)} />
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            {/* Header bar */}
            <div className="flex items-center gap-2 border-b border-os-border bg-os-surface2/40 px-3 py-2">
              <span className="flex items-center gap-1 text-[0.62rem] text-os-dim sm:hidden">
                <AppIcon name="folder" size={13} />
              </span>
              <p className="truncate font-mono text-[0.62rem] text-os-text">
                {folder === "personal" ? "~/projects/personal" : "~/projects/work"}
                <span className="hidden text-os-dim sm:inline">
                  {" "}
                  &#8212; {projects.length} {projects.length === 1 ? "entry" : "entries"}
                </span>
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.name}
                    project={p}
                    onOpen={() => setSelected(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsApp;