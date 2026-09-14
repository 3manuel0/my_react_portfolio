import React, { useMemo, useState } from "react";
import {
  buildPortfolioFS,
  normalizePath,
  resolvePath,
  HOME,
  type FSFile,
  type FSNode,
} from "../../data/terminalFs";

const FilesApp: React.FC = () => {
  const fs = useMemo(() => buildPortfolioFS(), []);
  const [cwd, setCwd] = useState(HOME);
  const [openFile, setOpenFile] = useState<{
    name: string;
    parent: string;
    node: FSFile;
  } | null>(null);

  const segments = cwd.split("/").filter(Boolean);

  const navigateTo = (path: string) => {
    setOpenFile(null);
    setCwd("/" + path);
  };

  const navigateInto = (name: string) => {
    const next = normalizePath(cwd, name);
    const node = resolvePath(fs, cwd, name);
    if (!node || node.type !== "dir") return;
    setOpenFile(null);
    setCwd(next);
  };

  const openFileEntry = (name: string) => {
    const node = resolvePath(fs, cwd, name);
    if (!node || node.type !== "file") return;
    setOpenFile({ name, parent: cwd, node });
  };

  const goBack = () => {
    if (openFile) {
      setOpenFile(null);
      return;
    }
    if (segments.length === 0) return;
    const parent = "/" + segments.slice(0, -1).join("/");
    setCwd(parent || "/");
  };

  const current = resolvePath(fs, cwd, ".");
  const entries =
    current && current.type === "dir"
      ? (Object.entries(current.children) as [string, FSNode][])
          .sort(([a, na], [b, nb]) => {
            if (na.type !== nb.type) return na.type === "dir" ? -1 : 1;
            return a.localeCompare(b);
          })
      : [];

  return (
    <div className="flex h-full min-h-0 flex-col bg-os-surface">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-os-border px-3 py-2">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="flex h-6 w-6 shrink-0 items-center justify-center border border-os-border text-os-dim hover:border-os-accent hover:text-os-text disabled:opacity-30"
          disabled={segments.length === 0 && !openFile}
        >
          ←
        </button>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto text-[0.62rem]">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="shrink-0 px-1 py-0.5 text-os-dim hover:text-os-accent"
          >
            /
          </button>
          {segments.map((seg, i) => {
            const fullPath = "/" + segments.slice(0, i + 1).join("/");
            return (
              <React.Fragment key={fullPath}>
                <span className="text-os-dim">/</span>
                <button
                  type="button"
                  onClick={() => navigateTo(fullPath)}
                  className="shrink-0 px-1 py-0.5 text-os-dim hover:text-os-accent"
                >
                  {seg}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* File content view */}
      {openFile && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-os-border bg-os-surface2/40 px-3 py-1.5">
            <span className="text-[0.62rem] text-os-accent">{openFile.name}</span>
            <span className="text-[0.55rem] text-os-dim">— {openFile.parent}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3 text-[0.65rem] leading-relaxed text-os-text">
            {openFile.node.content}
          </div>
        </div>
      )}

      {/* Directory listing */}
      {!openFile && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {entries.length === 0 && (
            <p className="p-4 text-center text-[0.62rem] text-os-dim">
              empty directory
            </p>
          )}
          {entries.map(([name, node]) => {
            const isDir = node.type === "dir";
            return (
              <button
                key={name}
                type="button"
                onClick={() =>
                  isDir ? navigateInto(name) : openFileEntry(name)
                }
                className="flex w-full items-center gap-2 border-b border-os-border/50 px-3 py-2 text-left hover:bg-os-surface2/40"
              >
                <span className="w-4 shrink-0 text-center text-[0.7rem]">
                  {isDir ? "📁" : "📄"}
                </span>
                <span
                  className={`min-w-0 truncate text-[0.65rem] ${
                    isDir ? "text-os-accent" : "text-os-text"
                  }`}
                >
                  {name}
                </span>
                {isDir && (
                  <span className="ml-auto shrink-0 text-[0.55rem] text-os-dim">
                    {Object.keys(node.children).length} items
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilesApp;
