import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
  "reference",
  "node_modules",
  ".next",
  "dist",
  ".git",
]);

const ALLOWLIST_FILES = new Set([
  path.normalize("packages/ui/src/config/presets.ts"),
  path.normalize("scripts/check-brand-leaks.mjs"),
  path.normalize("README.md"),
  path.normalize("AGENTS.md"),
]);

const FORBIDDEN = [
  { pattern: /\btayoszn\b/i, label: "tayoszn" },
  { pattern: /\btayo\b/i, label: "tayo" },
  { pattern: /\bAfrica\/Lagos\b/i, label: "Africa/Lagos" },
  { pattern: /\bLAGOS\b/, label: "LAGOS" },
  { pattern: /#bef264/i, label: "#bef264" },
];

const TEXT_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".html",
  ".md",
]);

const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) {
      walk(full);
    } else if (TEXT_EXTS.has(path.extname(entry.name))) {
      if (ALLOWLIST_FILES.has(rel)) continue;
      const content = fs.readFileSync(full, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        for (const rule of FORBIDDEN) {
          if (rule.pattern.test(line)) {
            violations.push({
              file: rel,
              line: idx + 1,
              label: rule.label,
              snippet: line.trim().slice(0, 120),
            });
          }
        }
      });
    }
  }
}

walk(ROOT);

if (violations.length > 0) {
  console.error("❌ Brand leak check failed! Found hardcoded source branding:");
  for (const v of violations) {
    console.error(`  - ${v.file}:${v.line} [${v.label}] → ${v.snippet}`);
  }
  process.exit(1);
} else {
  console.log("✅ Brand leak check passed: zero hardcoded brand leaks in packages/ or apps/.");
}
