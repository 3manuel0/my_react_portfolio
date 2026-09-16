import React, { useMemo, useState } from "react";
import { allNoteTags, notes, type Note } from "../../data/notes";
import { AppIcon } from "../AppIcons";
import { NoteBody } from "./notesRenderer";

const NotesApp: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(notes[0]?.slug ?? null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (activeTag && !n.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeTag]);

  const current = filtered.find((n) => n.slug === selected) ?? null;

  const toggleTag = (tag: string | null) => {
    setActiveTag((cur) => (cur === tag ? null : tag));
  };

  const openNote = (slug: string) => {
    setSelected(slug);
    setQuery("");
    setActiveTag(null);
  };

  return (
    <div className="flex h-full min-h-0 bg-os-surface">
      {/* List column */}
      <aside
        aria-label="Notes list"
        className={`shrink-0 flex-col border-r border-os-border ${
          current ? "hidden w-full max-w-full lg:flex lg:w-64" : "flex w-full lg:w-64"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-os-border bg-os-surface2/40 px-3 py-2">
          <AppIcon name="notes" size={15} />
          <p className="font-mono text-[0.66rem] font-bold text-os-text">
            notes://3manuel
          </p>
          <span className="ml-auto font-mono text-[0.55rem] text-os-dim">
            {filtered.length}/{notes.length}
          </span>
        </div>

        <div className="border-b border-os-border px-3 py-2.5">
          <label className="flex items-center gap-2 border border-os-border bg-os-surface2/70 px-2 py-1.5 focus-within:border-os-accent">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              aria-hidden="true"
              className="shrink-0 text-os-dim"
            >
              <circle cx="4.5" cy="4.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 7 L10 10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filter notes..."
              aria-label="Filter notes"
              className="w-full bg-transparent text-[0.65rem] text-os-text placeholder:text-os-dim/70"
            />
          </label>

          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => toggleTag(null)}
              className={`border px-1.5 py-0.5 text-[0.55rem] transition-colors ${
                activeTag === null
                  ? "border-os-accent bg-os-accent/15 text-os-accent"
                  : "border-os-border text-os-dim hover:border-os-accent hover:text-os-accent"
              }`}
            >
              all
            </button>
            {allNoteTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`border px-1.5 py-0.5 text-[0.55rem] transition-colors ${
                  activeTag === tag
                    ? "border-os-accent bg-os-accent/15 text-os-accent"
                    : "border-os-border text-os-dim hover:border-os-accent hover:text-os-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="p-4 text-center text-[0.62rem] text-os-dim">
              no notes match
              {query.trim() !== "" || activeTag !== null ? " those filters" : ""}.
            </p>
          )}
          {filtered.map((n) => {
            const active = n.slug === current?.slug;
            return (
              <button
                key={n.slug}
                type="button"
                onClick={() => openNote(n.slug)}
                className={`block w-full border-b border-os-border/50 px-3 py-2.5 text-left transition-colors ${
                  active ? "bg-os-blue/10" : "hover:bg-os-surface2/60"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[0.55rem] text-os-dim">{n.date}</span>
                  <span className="ml-auto font-mono text-[0.55rem] text-os-dim">
                    {n.readMinutes} min
                  </span>
                </span>
                <span
                  className={`mt-0.5 block text-[0.7rem] font-bold leading-snug ${
                    active ? "text-os-accent" : "text-os-text"
                  }`}
                >
                  {n.title}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {n.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-os-border px-1 text-[0.5rem] text-os-dim"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Article column */}
      <main
        aria-label="Notes reader"
        className={`min-w-0 flex-1 ${current ? "block" : "hidden lg:block"}`}
      >
        {current ? (
          <NoteArticle
            note={current}
            onOpen={openNote}
            onBack={() => setSelected(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <AppIcon name="notes" size={34} />
            <p className="text-[0.7rem] text-os-dim">
              {filtered.length === 0
                ? "no notes match those filters."
                : "pick a note on the left."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const NoteArticle: React.FC<{
  note: Note;
  onOpen: (slug: string) => void;
  onBack: () => void;
}> = ({ note, onOpen, onBack }) => {
  const idx = notes.findIndex((n) => n.slug === note.slug);
  const prev = idx > 0 ? notes[idx - 1] : null;
  const next = idx >= 0 && idx < notes.length - 1 ? notes[idx + 1] : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-os-border bg-os-surface2/40 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to list"
          className="flex h-6 w-6 items-center justify-center border border-os-border text-os-dim hover:border-os-accent hover:text-os-text lg:hidden"
        >
          &#8592;
        </button>
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-os-dim">
          reading&nbsp;/&nbsp;{note.slug}.md
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.6rem] text-os-dim">{note.date}</p>
        <h1 className="mt-1 text-lg font-bold leading-snug text-os-text">
          {note.title}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.58rem] text-os-dim">
          <span>{note.readMinutes} min read</span>
          <span aria-hidden="true">&#183;</span>
          {note.tags.map((t) => (
            <span key={t} className="border border-os-border px-1 py-px text-os-accent">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-2 border-t border-os-border/60 pt-1">
          <NoteBody content={note.content} />
        </div>

        <p className="mt-4 border-t border-os-border pt-3 text-[0.55rem] leading-relaxed text-os-dim">
          <span className="text-os-green">$</span> man 3manuel &#8212; rendered by the
          same tiny markdown engine that powers{" "}
          <span className="text-os-yellow">~/notes</span> in the terminal. Written with no
          account, no likes, no cookies.
        </p>
      </div>

      {(prev || next) && (
        <div className="flex items-center justify-between gap-2 border-t border-os-border bg-os-surface2/30 px-3 py-2">
          {prev ? (
            <NavButton note={prev} dir="prev" onPick={() => onOpen(prev.slug)} />
          ) : (
            <span />
          )}
          {next ? (
            <NavButton note={next} dir="next" onPick={() => onOpen(next.slug)} />
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
};

const NavButton: React.FC<{
  note: Note;
  dir: "prev" | "next";
  onPick: () => void;
}> = ({ note, dir, onPick }) => (
  <button
    type="button"
    onClick={onPick}
    className="max-w-[45%] border border-os-border px-2.5 py-1.5 text-left hover:border-os-accent"
  >
    <span className="block font-mono text-[0.5rem] text-os-dim">
      {dir === "prev" ? "&#8592; prev" : "next &#8594;"}
    </span>
    <span className="block truncate text-[0.62rem] text-os-text">{note.title}</span>
  </button>
);

export default NotesApp;