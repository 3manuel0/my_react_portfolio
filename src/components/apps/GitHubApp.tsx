import React, { useEffect, useMemo, useState } from "react";
import { profile } from "../../data/portfolio";
import { AppIcon } from "../AppIcons";

const githubUsername = profile.githubUsername;

const TOP_LANGS_URL =
  `https://github-readme-stats-fast.vercel.app/api/top-langs/?username=${githubUsername}` +
  `&layout=compact&theme=dark&title_color=5EEAD4&text_color=C8D1E0&bg_color=0D1219` +
  `&border_color=3A4256&icon_color=7AA2F7&border_radius=4&langs_count=8&card_width=520&hide_progress=false`;

// committers.top rank badge — the default SVG is a stock shields pill; we fetch
// it just to parse the rank out, then render our own theme-styled badge.
const RANK_AREA = "morocco";
const RANK_BADGE_URL = `https://user-badge.committers.top/${RANK_AREA}/${githubUsername}.svg`;

interface CommitterRank {
  area: string;
  rank: string;
  metric: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

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
  Kotlin: "#a97bff",
  Roff: "#ecebe9",
  Shell: "#89e051",
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

const StarIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.9 1-5 4.9 1.2 6.9L12 17.9 5.9 21l1.2-6.9-5-4.9 6.9-1Z" />
  </svg>
);

const ForkIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M6 7 v3 a3 3 0 0 0 3 3 h6 a3 3 0 0 0 3 -3 V7 M12 13 v4" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6 9a6 6 0 0 0 12 0" />
    <rect x="4" y="2" width="16" height="4" rx="1" />
    <path d="M9 22v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
    <path d="M6 9V2h12v7" />
  </svg>
);

const GitHubApp: React.FC = () => {
  const [search, setSearch] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<CommitterRank | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const data = (await res.json()) as GitHubRepo[];
        if (!cancelled) setRepos(data);
      } catch (err) {
        if (!cancelled) {
          console.error("[GitHub] repo fetch failed", err);
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch the committers.top rank badge (just the SVG text), parse out the
  // rank number, and render our own custom badge in the OS theme.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(RANK_BADGE_URL);
        if (!res.ok) return;
        const svg = await res.text();
        // aria-label="committers.top rank: Morocco #83 (public commits)"
        const m = svg.match(
          /rank:\s*([^#]+?)\s*#([\d,]+)\s*\(([^)]+)\)/i,
        );
        if (m && !cancelled)
          setRank({ area: m[1].trim(), rank: m[2].trim(), metric: m[3].trim() });
      } catch {
        // Network/CORS error — badge is decorative, ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!repos) return [];
    const list = repos.filter((r) => !r.fork);
    if (!q) return list;
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q),
    );
  }, [repos, search]);

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

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex flex-wrap items-center gap-3 pb-3">
          <img
            src={`https://github.com/${githubUsername}.png`}
            alt="GitHub avatar"
            className="h-16 w-16 rounded-full border border-os-accent/40 bg-os-surface2 object-cover"
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
            {repos && (
              <span>{repos.filter((r) => !r.fork).length} public repos</span>
            )}
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

        {rank && (
          <a
            href={`https://committers.top/${RANK_AREA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex items-center gap-3 border-y border-os-green/30 bg-os-green/5 px-3 py-2 hover:bg-os-green/10"
          >
            <TrophyIcon className="shrink-0 text-os-green" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.55rem] uppercase tracking-[0.18em] text-os-dim">
                {rank.area} · {rank.metric}
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-arcade text-xl leading-none text-os-green">
                  #{rank.rank}
                </span>
                <span className="text-[0.62rem] text-os-text">committers.top</span>
              </p>
            </div>
            <span className="shrink-0 text-[0.62rem] text-os-green" aria-hidden="true">
              ↗
            </span>
          </a>
        )}

        <div className="mb-3 w-full border border-os-border bg-os-surface2/40 p-3">
          <RemoteImage
            src={TOP_LANGS_URL}
            alt="Top languages from GitHub profile"
            className="w-full"
            loading="lazy"
          />
        </div>

        <div className="border-t border-os-border pt-3">
          <p className="mb-2 text-[0.6rem] uppercase tracking-widest text-os-dim">
            Repositories
          </p>

          {loading && (
            <p className="flex items-center gap-2 py-6 text-center text-[0.68rem] text-os-dim">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border border-os-border2 border-t-os-accent" />
              loading repositories from the GitHub API...
            </p>
          )}

          {!loading && error && (
            <p className="py-6 text-center text-[0.68rem] text-os-dim">
              Couldn&rsquo;t reach the GitHub API ({error}). Open the profile
              directly to browse the repos.
            </p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="py-6 text-center text-[0.68rem] text-os-dim">
              {repos?.length
                ? `No repositories match "${search}"`
                : "No public repositories."}
            </p>
          )}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filtered.map((repo) => (
              <div
                key={repo.id}
                className="flex flex-col border border-os-border bg-os-surface2/40 p-3"
              >
                <div className="flex items-center gap-1.5">
                  <AppIcon name="folder" size={13} />
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[0.7rem] font-bold text-os-accent hover:text-os-green"
                  >
                    {repo.full_name}
                  </a>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[0.62rem] leading-relaxed text-os-dim">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-2 text-[0.55rem] text-os-dim">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className="h-1.5 w-1.5"
                        style={{ backgroundColor: LANG_COLORS[repo.language] ?? "#bb9af7" }}
                        aria-hidden="true"
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5" title="Stars">
                    <StarIcon /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-0.5" title="Forks">
                    <ForkIcon /> {repo.forks_count}
                  </span>
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