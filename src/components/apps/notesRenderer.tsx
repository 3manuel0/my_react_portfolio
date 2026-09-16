import React, { type ReactNode } from "react";

// Tiny markdown-ish renderer for the Notes app. Supports:
//   # h3 / ## h4 headings, > quotes, - lists, ``` code fences,
//   paragraphs, and inline **bold** / `code` / [label](url).

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts = text.split(INLINE_RE);
  return parts.map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-bold text-os-text">
          {renderInline(part.slice(2, -2), key)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={key} className="text-os-yellow">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      return (
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-os-blue underline decoration-dotted underline-offset-2 hover:text-os-green"
        >
          {link[1]}
        </a>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function parseBlocks(content: string): ReactNode[] {
  const lines = content.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => String(k++);

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const fence: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        fence.push(lines[i]);
        i++;
      }
      i++;
      out.push(
        <pre
          key={key()}
          className="my-2 overflow-x-auto border border-os-border bg-os-bg p-3 font-mono text-[0.62rem] leading-relaxed text-os-green"
        >
          {fence.join("\n")}
        </pre>,
      );
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(
        <h3 key={key()} className="mt-5 mb-1 text-[0.82rem] font-bold text-os-accent">
          {renderInline(line.slice(2), key())}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        <h4 key={key()} className="mt-4 mb-1 text-[0.73rem] font-bold text-os-blue">
          {renderInline(line.slice(3), key())}
        </h4>,
      );
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={key()}
          className="my-2 border-l-2 border-os-accent bg-os-surface2/60 px-3 py-2 text-[0.68rem] italic text-os-dim"
        >
          {renderInline(line.slice(2), key())}
        </blockquote>,
      );
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      out.push(
        <ul key={key()} className="my-2 list-disc space-y-1 pl-5 text-[0.68rem] text-os-text">
          {items.map((it, j) => (
            <li key={`${key()}-${j}`}>{renderInline(it, key())}</li>
          ))}
        </ul>,
      );
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("# ") &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ")
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={key()} className="my-2 text-[0.68rem] leading-relaxed text-os-text">
        {renderInline(para.join("\n"), key())}
      </p>,
    );
  }
  return out;
}

export const NoteBody: React.FC<{ content: string }> = ({ content }) => (
  <div>{parseBlocks(content)}</div>
);