import React, { useMemo, useState } from "react";
import { personalProjects, profile } from "../../data/portfolio";
import { AppIcon } from "../AppIcons";

const githubUsername = profile.githubUsername;

const STATS_IMG_URL =
  `https://github-readme-stats-fast.vercel.app/api?username=${githubUsername}` +
  `&show_icons=true&theme=dark&title_color=5EEAD4&text_color=C8D1E0&bg_color=0D1219` +
  `&border_color=3A4256&icon_color=7AA2F7&border_radius=4&hide_rank=true`;

const FOLLOWERS_BADGE =
  `https://img.shields.io/github/followers/${githubUsername}` +
  `?style=for-the-badge&label=Followers&labelColor=11151F&color=5EEAD4`;

const STARS_BADGE =
  `https://img.shields.io/github/stars/${githubUsername}` +
  `?style=for-the-badge&label=Stars&labelColor=11151F&color=7AA2F7`;

const TOP_LANGS_URL =
  `https://github-readme-stats-fast.vercel.app/api/top-langs/?username=${githubUsername}` +
  `&layout=compact&theme=dark&title_color=5EEAD4&text_color=C8D1E0&bg_color=0D1219` +
  `&border_color=3A4256&icon_color=7AA2F7&border_radius=4&langs_count=8&card_width=520&hide_progress=false`;

const CURATED_REPOS = personalProjects.filter((p) => p.githubSrcCode);

interface Curated {
  repo: (typeof personalProjects)[number];
  slug: string;
  url: string;
}

const REPOS: Curated[] = CURATED_REPOS.map((repo) => ({
  repo,
  slug: (repo.githubSrcCode?.split("/").pop() ?? repo.name).toLowerCase(),
  url: repo.githubSrcCode ?? "",
}));

const LANG_COLORS: Record<string, string> = {
  C: "#555555",
  "C++": "#f34b7d",
  Python: "#3572a5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  Go: "#00add8",
  Lua: "#000080",
  Shell: "#89e051",
  Java: "#b07219",
};

const RemoteImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}> = ({ src, alt, className, loading }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
};

const GitHubApp: React.FC = () => {
  const [search, setSearch] = useState("");

  const repos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return REPOS;
    return REPOS.filter(
      (r) =>
        r.slug.includes(q) ||
        r.repo.name.toLowerCase().includes(q) ||
        (r.repo.description ?? "").toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-os-border bg-os-surface2/40 px-3 py-2">
        <AppIcon name="github" size={16} />
        <p className="truncate text-[0.68rem] text-os-text">
          github.com/
          <span className="font-bold text-os-green">{githubUsername}</span>
        </p>
        <div className="ml-auto flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M6 2 L10 2 10 6 9 6 9 3 6 3 Z M8 8 L4 8 4 4 5 4 5 7 8 7 Z" fill="#7aa2f7" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search repositories"
            placeholder="Find a repo..."
            className="w-32 border border-os-border bg-os-surface px-2 py-1 text-[0.62rem] text-os-text placeholder:text-os-dim focus:border-os-accent sm:w-44"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-os-border px-3 py-3">
        <img
          src={`https://github.com/${githubUsername}.png`}
          alt="GitHub avatar"
          className="h-14 w-14 border border-os-border bg-os-surface2"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-os-text">{profile.name}</p>
          <p className="text-[0.62rem] text-os-dim">@{githubUsername}</p>
          <p className="mt-0.5 max-w-xs truncate text-[0.62rem] text-os-text/90">
            {profile.title}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[0.6rem] text-os-dim">
          {profile.location && (
            <span className="hidden items-center gap-1 sm:flex" title="Location">
              <AppIcon name="location" size={12} />
              {profile.location}
            </span>
          )}
          <span>{CURATED_REPOS.length} featured repos</span>
        </div>
        <a
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile in new tab"
          className="flex shrink-0 items-center gap-1.5 border border-os-border px-2.5 py-1.5 text-[0.62rem] text-os-text hover:border-os-green hover:text-os-green"
        >
          <AppIcon name="github" size={13} /> Open Profile
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-os-border bg-os-surface2/30 px-3 py-2">
        <RemoteImage src={FOLLOWERS_BADGE} alt="GitHub followers" className="h-6" loading="lazy" />
        <RemoteImage src={STARS_BADGE} alt="GitHub total stars" className="h-6" loading="lazy" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="border border-os-border bg-os-surface2/40 p-3">
            <p className="mb-2 text-[0.6rem] uppercase tracking-widest text-os-dim">
              GitHub Stats
            </p>
            <RemoteImage
              src={STATS_IMG_URL}
              alt="GitHub stats: stars, commits, pull requests"
              className="w-full max-w-[420px]"
              loading="lazy"
            />
          </div>
          <div className="border border-os-border bg-os-surface2/40 p-3">
            <p className="mb-2 text-[0.6rem] uppercase tracking-widest text-os-dim">
              Top Languages
            </p>
            <RemoteImage
              src={TOP_LANGS_URL}
              alt="Top languages from GitHub profile"
              className="w-full max-w-[540px]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-3 border-t border-os-border pt-3">
          {repos.length === 0 && (
            <p className="pb-6 text-center text-[0.68rem] text-os-dim">
              No repositories match &ldquo;{search}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {repos.map(({ repo, slug, url }) => (
              <div
                key={slug}
                className="flex flex-col border border-os-border bg-os-surface2/40 p-3"
              >
                <div className="flex items-center gap-1.5">
                  <AppIcon name="folder" size={13} />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[0.7rem] font-bold text-os-accent hover:text-os-green"
                  >
                    {githubUsername}/{slug}
                  </a>
                </div>
                <div className="mt-1.5 flex gap-1.5 overflow-hidden">
                  {repo.languages?.map((l) => (
                    <span key={l} className="flex items-center gap-1 text-[0.55rem] text-os-dim">
                      <span
                        className="h-1.5 w-1.5"
                        style={{ backgroundColor: LANG_COLORS[l] ?? "#bb9af7" }}
                        aria-hidden="true"
                      />
                      {l}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 line-clamp-2 text-[0.62rem] leading-relaxed text-os-dim">
                  {repo.description}
                </p>
                <div className="mt-2 aspect-video overflow-hidden border border-os-border bg-os-bg">
                  <img
                    src={repo.screenshot}
                    alt={`${repo.name} screenshot`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform hover:scale-105"
                  />
                </div>
                <div className="mt-auto flex items-center gap-3 pt-2 text-[0.55rem] text-os-dim">
                  <span className="ml-auto">open on github</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubApp;