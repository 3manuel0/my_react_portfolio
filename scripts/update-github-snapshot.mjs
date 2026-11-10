#!/usr/bin/env node
/**
 * Refresh the bundled GitHub fallback data.
 *
 * Run manually with `npm run snapshot:github`, or let the scheduled GitHub
 * Action do it. The site uses this snapshot when the live API is rate-limited
 * or unreachable.
 *
 * Top languages are calculated from the `/languages` endpoint (bytes of code),
 * not just each repo's primary language.
 */
import { writeFile } from "node:fs/promises";

const USERNAME = "3manuel0";
const API = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "3manuel-portfolio-snapshot",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

const res = await fetch(API, { headers });
if (!res.ok) {
  throw new Error(`GitHub API ${res.status} ${res.statusText}`);
}

const repos = await res.json();
if (!Array.isArray(repos)) {
  throw new Error("GitHub API returned an unexpected payload");
}

const slim = repos.map((repo) => ({
  id: repo.id,
  name: repo.name,
  full_name: repo.full_name,
  html_url: repo.html_url,
  description: repo.description ?? null,
  language: repo.language ?? null,
  stargazers_count: repo.stargazers_count ?? 0,
  forks_count: repo.forks_count ?? 0,
  updated_at: repo.updated_at,
  fork: Boolean(repo.fork),
}));

const activeRepos = slim.filter((repo) => !repo.fork);

const languageData = await mapLimit(activeRepos, 6, async (repo) => {
  try {
    const languageRes = await fetch(
      `https://api.github.com/repos/${repo.full_name}/languages`,
      { headers },
    );
    if (!languageRes.ok) {
      throw new Error(`${languageRes.status} ${languageRes.statusText}`);
    }
    const languages = await languageRes.json();
    return { repo, languages };
  } catch (err) {
    console.warn(`languages ${repo.full_name}: ${err.message}`);
    // Keep the repo visible in the stats even if its language call failed.
    return {
      repo,
      languages: repo.language ? { [repo.language]: 1 } : {},
    };
  }
});

const bytesByName = new Map();
const reposByName = new Map();

for (const { languages } of languageData) {
  for (const [name, bytes] of Object.entries(languages)) {
    if (typeof bytes !== "number" || bytes <= 0) continue;
    bytesByName.set(name, (bytesByName.get(name) ?? 0) + bytes);
    reposByName.set(name, (reposByName.get(name) ?? 0) + 1);
  }
}

const totalBytes = [...bytesByName.values()].reduce(
  (sum, bytes) => sum + bytes,
  0,
);

let languages;
if (totalBytes > 0) {
  languages = [...bytesByName.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Number(((bytes / totalBytes) * 100).toFixed(1)),
      repos: reposByName.get(name) ?? 0,
    }));
} else {
  // Fallback for an empty API response: use primary-language repo counts.
  const counts = new Map();
  let total = 0;
  for (const repo of activeRepos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    total += 1;
  }
  languages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      bytes: 0,
      percent: Number(((count / Math.max(total, 1)) * 100).toFixed(1)),
      repos: count,
    }));
}

const generatedAt = new Date().toISOString();

await writeFile(
  "src/data/github-repos.json",
  `${JSON.stringify(slim, null, 2)}\n`,
);
await writeFile(
  "src/data/github-top-langs.json",
  `${JSON.stringify({ generated_at: generatedAt, total_bytes: totalBytes, languages }, null, 2)}\n`,
);

console.log(
  `Wrote ${slim.length} repos, ${languages.length} languages, ${totalBytes} language bytes (${generatedAt}).`,
);
