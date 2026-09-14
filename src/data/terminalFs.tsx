import React from "react";
import {
  contactLinks,
  education,
  experience,
  personalProjects,
  professionalProjects,
  profile,
  skills,
} from "./portfolio";

export interface FSDir {
  type: "dir";
  children: Record<string, FSNode>;
}

export interface FSFile {
  type: "file";
  content: React.ReactNode;
}

export type FSNode = FSDir | FSFile;

export const HOME = "/home/3manuel";

const dir = (children: Record<string, FSNode> = {}): FSDir => ({
  type: "dir",
  children,
});

const file = (content: React.ReactNode): FSFile => ({ type: "file", content });

function block(...lines: React.ReactNode[]): React.ReactNode {
  return (
    <div>
      {lines.map((l, i) => (
        <p key={i} className="whitespace-pre leading-relaxed">
          {l}
        </p>
      ))}
    </div>
  );
}

function projectFiles(projects: typeof personalProjects): Record<string, FSNode> {
  const out: Record<string, FSNode> = {};
  for (const p of projects) {
    const slug = p.name.replace(/\s+/g, "_").toLowerCase();
    out[`${slug}.txt`] = file(
      block(
        <span className="font-bold text-os-accent">{p.name}</span>,
        p.description,
        ...(p.context
          ? [`context: ${p.context}`]
          : []),
        ...(p.languages?.length
          ? [`stack: ${p.languages.join(", ")}`]
          : []),
        ...(p.demo
          ? ["", <a key="demo" className="text-os-blue underline decoration-dotted underline-offset-2" href={p.demo} target="_blank" rel="noopener noreferrer">demo &rarr; {p.demo}</a>]
          : []),
        ...(p.githubSrcCode
          ? ["", <a key="src" className="text-os-blue underline decoration-dotted underline-offset-2" href={p.githubSrcCode} target="_blank" rel="noopener noreferrer">source &rarr; {p.githubSrcCode}</a>]
          : []),
      ),
    );
  }
  return out;
}

export function buildPortfolioFS(): FSDir {
  const root = dir();
  root.children["home"] = dir({
    "3manuel": dir({
      "about.txt": file(
        block(
          <span className="font-bold text-os-green">
            {profile.name} <span className="text-os-dim">({profile.alias})</span>
          </span>,
          <span className="text-os-blue">{profile.title}</span>,
          <span className="text-os-dim">{profile.location}</span>,
          "",
          profile.bio,
        ),
      ),
      "skills.txt": file(
        block(
          ...Object.entries(skills).map(([cat, tools]) => (
            <span key={cat}>
              <span className="text-os-yellow">{cat.padEnd(16)}</span>
              <span className="text-os-text">{tools.join(", ")}</span>
            </span>
          )),
        ),
      ),
      "experience.log": file(
        block(
          ...experience.flatMap((g) => [
            <span key={g.year} className="font-bold text-os-yellow">[{g.year}]</span>,
            ...g.entries.map((e) => (
              <span key={`${g.year}-${e.role}`} className="text-os-text">
                {"  "}
                {e.role} <span className="text-os-dim">@ {e.company}</span>
              </span>
            )),
            "",
          ]),
        ),
      ),
      "education.txt": file(
        block(
          ...education.map((e) => [
            <span key={e.degree}>
              <span className="text-os-accent">{e.degree}</span>
              <span className="text-os-dim"> — {e.field}</span>
            </span>,
            <span key={`${e.degree}-s`} className="text-os-dim">
              {"  "}{e.school} ({e.status})
            </span>,
            <span key={`${e.degree}-p`} className="text-os-dim">  {e.period}</span>,
            "",
          ]),
        ),
      ),
      contact: dir({
        "now.md": file(
          block(
            "welcome to 3manuel os",
            "this terminal reads straight from the same data",
            "that renders the desktop apps.",
          ),
        ),
        ...Object.fromEntries(
          contactLinks.map((c) => [
            `${c.name.toLowerCase().replace(/\s+/g, "_")}.txt`,
            file(
              block(
                <span className="font-bold text-os-green">{c.name}</span>,
                <span className="text-os-text">handle: {c.handle}</span>,
                <a className="text-os-blue underline decoration-dotted underline-offset-2" href={c.url} target="_blank" rel="noopener noreferrer">{c.url}</a>,
              ),
            ),
          ]),
        ),
      }),
      projects: dir({
        personal: dir(projectFiles(personalProjects)),
        work: dir(projectFiles(professionalProjects)),
        "README.txt": file(
          block(
            "~/projects",
            "  personal/  — personal projects",
            "  work/      — internship & freelance work",
            "",
            "  ~/projects/personal/c3sv.txt  (one file per project)",
            "  ~/projects/personal/less",
          ),
        ),
      }),
      ".bashrc": file(
        block(
          "# 3manuel os shell rc",
          'alias ll="ls -l"',
          'alias la="ls -a"',
          'alias h="help"',
          'echo "welcome to 3manuel os. type help to get started."',
        ),
      ),
    }),
  });
  return root;
}

export function normalizePath(cwd: string, target: string): string {
  let targetResolved = target;
  if (targetResolved === "~") targetResolved = HOME;
  else if (targetResolved.startsWith("~/")) targetResolved = HOME + targetResolved.slice(1);

  let parts: string[] = [];
  if (!targetResolved.startsWith("/")) {
    parts = cwd.split("/").filter(Boolean);
  }
  for (const seg of targetResolved.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

export function resolvePath(fs: FSNode, cwd: string, target: string): FSNode | null {
  const parts = normalizePath(cwd, target)
    .split("/")
    .filter(Boolean);
  let cur = fs;
  for (const seg of parts) {
    if (cur.type !== "dir" || !(seg in cur.children)) return null;
    cur = cur.children[seg];
  }
  return cur;
}

export function completePath(
  fs: FSNode,
  cwd: string,
  partial: string,
): string[] {
  const lastSlash = partial.lastIndexOf("/");
  const head = lastSlash === -1 ? "" : partial.slice(0, lastSlash + 1);
  const tail = lastSlash === -1 ? partial : partial.slice(lastSlash + 1);
  const base = resolvePath(fs, cwd, head === "" ? "." : head);
  if (!base || base.type !== "dir") return [];
  return Object.keys(base.children)
    .filter((n) => n.startsWith(tail))
    .sort()
    .map((n) => {
      const node = base.children[n];
      return head + n + (node.type === "dir" ? "/" : " ");
    });
}

export function formatLsChildren(node: FSNode): string {
  if (node.type !== "dir") return "";
  const names = Object.keys(node.children).sort();
  return names
    .map((n) => {
      const c = node.children[n];
      return c.type === "dir" ? `${n}/` : n;
    })
    .join("   ");
}