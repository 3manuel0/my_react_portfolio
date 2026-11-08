#!/usr/bin/env node
/**
 * Refresh the bundled GitHub fallback data.
 *
 * Run manually with `npm run snapshot:github`, or let the scheduled GitHub
 * Action do it. The site uses this snapshot when the live API is rate-limited
 * or unreachable.
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

const counts = new Map();
let total = 0;
for (const repo of slim) {
  if (repo.fork || !repo.language) continue;
  counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  total += 1;
}

const languages = [...counts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([name, count]) => ({
    name,
    count,
    percent: Number(((count / Math.max(total, 1)) * 100).toFixed(1)),
  }));

const generatedAt = new Date().toISOString();

await writeFile(
  "src/data/github-repos.json",
  `${JSON.stringify(slim, null, 2)}\n`,
);
await writeFile(
  "src/data/github-top-langs.json",
  `${JSON.stringify({ generated_at: generatedAt, languages }, null, 2)}\n`,
);

console.log(
  `Wrote ${slim.length} repos and ${languages.length} languages (${generatedAt}).`,
);
