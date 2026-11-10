#!/usr/bin/env node
/**
 * Generate the standalone SVG used by the GitHub profile README from
 * src/data/github-top-langs.json.
 */
import { readFile, writeFile } from "node:fs/promises";

const COLORS = {
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Csharp: "#178600",
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
  PHP: "#4F5D95",
  Php: "#4F5D95",
  Java: "#b07219",
  X86asm: "#6E4C13",
  Assembly: "#6E4C13",
  Swift: "#ffac45",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Ruby: "#701516",
};

const data = JSON.parse(
  await readFile("src/data/github-top-langs.json", "utf8"),
);
const languages = Array.isArray(data.languages)
  ? data.languages.slice(0, 8)
  : [];
const updated = (data.generated_at || new Date().toISOString()).slice(0, 10);

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const rows = languages
  .map((lang, index) => {
    const y = 50 + index * 24;
    const percent = Math.max(0, Math.min(100, Number(lang.percent) || 0));
    const width = ((percent / 100) * 380).toFixed(1);
    const color = COLORS[lang.name] ?? "#bb9af7";
    const label = escapeXml(lang.name);
    const pct = Math.round(percent);
    const title = lang.bytes
      ? `${label}: ${Number(lang.bytes).toLocaleString("en-US")} bytes across ${lang.repos ?? 0} repos`
      : label;

    return `  <g>
    <title>${escapeXml(title)}</title>
    <circle cx="24" cy="${y + 8}" r="5" fill="${color}"/>
    <text x="38" y="${y + 11}" fill="#CDD6F4" font-family="Roboto Mono, monospace, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial" font-size="10">${label}</text>
    <rect x="150" y="${y}" width="380" height="16" rx="3" fill="#0B1016" stroke="#1F2430"/>
    <rect x="150" y="${y}" width="${width}" height="16" rx="3" fill="${color}" opacity="0.9"/>
    <text x="584" y="${y + 11}" fill="#8B92A8" font-family="Roboto Mono, monospace" font-size="9" text-anchor="end">${pct}%</text>
  </g>`;
  })
  .join("\n");

const height = 58 + languages.length * 24 + 16;

const svg = `<svg width="600" height="${height}" viewBox="0 0 600 ${height}" role="img" aria-labelledby="toplangs-title toplangs-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="toplangs-title">Most Used Languages</title>
  <desc id="toplangs-desc">Language usage by bytes of code across public GitHub repositories.</desc>
  <rect width="100%" height="100%" fill="#090D13" rx="5"/>
  <rect x="0" y="0" width="100%" height="1" fill="#1F2430"/>
  <text x="16" y="32" fill="#FFC300" font-family="Roboto Mono, monospace, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial" font-size="12" font-weight="bold">Most Used Languages</text>
  <text x="584" y="32" fill="#6B7A99" font-family="Roboto Mono, monospace" font-size="9" text-anchor="end">updated ${updated} &#183; by bytes</text>
${rows}
</svg>
`;

await writeFile("public/top-languages.svg", svg);
console.log(
  `Wrote public/top-languages.svg (${languages.length} languages, ${height}px tall).`,
);
