import { describe, expect, it } from "vitest";
import {
  HOME,
  buildPortfolioFS,
  completePath,
  formatLsChildren,
  fsNodeToText,
  normalizePath,
  resolvePath,
  walkDir,
  type FSNode,
} from "./terminalFs";

describe("terminal filesystem", () => {
  it("normalizes relative, home, and parent paths", () => {
    expect(normalizePath(HOME, "~/projects")).toBe("/home/3manuel/projects");
    expect(normalizePath(HOME, "../..")).toBe("/");
    expect(normalizePath("/home/3manuel/projects", ".")).toBe(
      "/home/3manuel/projects",
    );
  });

  it("resolves files and rejects missing paths", () => {
    const fs = buildPortfolioFS();
    const about = resolvePath(fs, HOME, "about.txt");
    expect(about?.type).toBe("file");
    expect(fsNodeToText(about!)).toContain("Said BENNAJI");
    expect(resolvePath(fs, HOME, "nope.txt")).toBeNull();
  });

  it("completes paths and lists directory children", () => {
    const fs = buildPortfolioFS();
    const home = resolvePath(fs, HOME, ".");
    expect(home?.type).toBe("dir");
    expect(formatLsChildren(home!)).toContain("projects/");
    expect(completePath(fs, HOME, "ab")[0]?.trim()).toBe("about.txt");
  });

  it("walks and renders the tree", () => {
    const fs = buildPortfolioFS();
    const files: { path: string; node: FSNode }[] = [];
    walkDir(fs, "", files);
    expect(files.length).toBeGreaterThan(10);
    expect(files.some((f) => f.path.endsWith("about.txt"))).toBe(true);
  });
});
