import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const textExt = new Set([".html", ".css", ".js", ".mjs", ".svg", ".txt", ".xml", ".json"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

let files;
try {
  files = await walk(root);
} catch {
  console.error("postbuild: dist/ is missing. Run astro build first.");
  process.exit(1);
}

const todoHits = [];
const placeholderHits = [];
const bannedHits = [];
const banned = [/plumb/i, /electric/i, /whatsapp/i, /\blicensed\b/i, /\bbonded\b/i, /\bcertified\b/i];

for (const file of files) {
  if (path.basename(file).toUpperCase().includes("PLACEHOLDER")) placeholderHits.push(file);
  if (!textExt.has(path.extname(file).toLowerCase())) continue;
  const text = await readFile(file, "utf8");
  if (text.includes("TODO(client)")) todoHits.push(file);
  if (text.includes("PLACEHOLDER")) placeholderHits.push(file);
  if (banned.some((pattern) => pattern.test(text))) bannedHits.push(file);
}

if (todoHits.length || placeholderHits.length || bannedHits.length) {
  if (todoHits.length) console.error("TODO(client) remains in dist:\n" + todoHits.join("\n"));
  if (placeholderHits.length) console.error("PLACEHOLDER referenced in dist:\n" + placeholderHits.join("\n"));
  if (bannedHits.length) console.error("Disallowed copy remains in dist:\n" + bannedHits.join("\n"));
  process.exit(1);
}
