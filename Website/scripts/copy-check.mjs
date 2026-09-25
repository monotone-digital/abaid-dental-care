// Runs after the static export. Two jobs:
//   1. no [NEEDS:] left in anything that reaches a page
//   2. no prohibited words, ratings or pre-filled WhatsApp links in the built HTML
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const contentDir = path.resolve(appRoot, "..", "Content");
const outDir = path.resolve(appRoot, "out");

const errors = [];
const warnings = [];

/* ---------------- 1. missing facts ---------------- */

/** Mirror the renderer: held sections never ship, and @note lines are never rendered. */
function renderableLines(source) {
  const lines = source.split("\n");
  const kept = [];
  let heldSection = false;

  for (const [index, raw] of lines.entries()) {
    if (/^##\s+/.test(raw)) heldSection = false;
    if (/^@status:\s*held\s*$/.test(raw)) {
      heldSection = true;
      // Walk back and drop the heading and directives already collected for this section.
      while (kept.length && !/^##\s+/.test(kept[kept.length - 1].text)) kept.pop();
      if (kept.length) kept.pop();
      continue;
    }
    if (heldSection) continue;
    if (/^@note:/.test(raw)) continue;
    kept.push({ line: index + 1, text: raw });
  }
  return kept;
}

for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"))) {
  // Normalise Windows line endings, as the site's own reader does.
  const source = fs.readFileSync(path.join(contentDir, file), "utf8").replace(/\r\n?/g, "\n");
  for (const { line, text } of renderableLines(source)) {
    if (text.includes("[NEEDS:")) {
      errors.push(`${file}:${line} — missing fact still in the content: ${text.trim()}`);
    }
  }
}

/* ---------------- 2. the built HTML ---------------- */

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

// Prohibitions. Breaking one of these is a defect, not a style choice.
const BANNED = [
  [/\bimplants?\b/gi, "implants do not exist on this site"],
  [/\bveneers?\b/gi, "veneers are not offered"],
  [/\bpain[\s-]?free\b/gi, 'never "pain-free"'],
  [/\bpainless\b/gi, 'never "painless"'],
  [/aggregateRating|ratingValue|reviewCount/g, "no ratings or review counts, including in JSON-LD"],
  [/wa\.me\/[0-9]+\?/g, "the WhatsApp link must not be pre-filled"],
  [/\[NEEDS:/g, "a missing fact reached the page"],
  [/\b\d{1,3}(\.\d+)?%\s*(success|survival)\b/gi, "no success rates or outcome percentages"],
];

// Allowed inside a quoted review, never in the clinic's own voice.
const QUOTE_ONLY = [/state-of-the-art/gi, /\bbest\b/gi];

const pages = htmlFiles(outDir);

if (!pages.length) {
  warnings.push("no built HTML found in out/ — run next build first");
} else {
  for (const file of pages) {
    const html = fs.readFileSync(file, "utf8");
    const name = path.relative(outDir, file);

    for (const [pattern, reason] of BANNED) {
      const hits = html.match(pattern);
      if (hits) errors.push(`${name} — ${reason} (found "${hits[0]}", ${hits.length}x)`);
    }

    // Search results and link previews: the title and meta tags never call Dr Abaid an
    // orthodontist or specialist. (The approved About FAQ asks "Is Dr Abaid an orthodontist?",
    // so this is checked here and in the JSON-LD below, not across the whole page.)
    const head = [
      ...(html.match(/<title>[\s\S]*?<\/title>/gi) ?? []),
      ...(html.match(/<meta\s[^>]*content="[^"]*"[^>]*>/gi) ?? []),
    ].join("\n");
    const titleHit = head.match(/\borthodontists?\b|\bspecialists?\b/i);
    if (titleHit) errors.push(`${name} — "${titleHit[0]}" in the title or meta tags`);

    // Structured data: parse every JSON-LD block and check what it says about the clinic and Dr Abaid.
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let data;
      try {
        data = JSON.parse(json);
      } catch {
        errors.push(`${name} — a JSON-LD block does not parse`);
        continue;
      }
      for (const node of data["@graph"] ?? [data]) {
        for (const key of ["priceRange", "review", "email", "aggregateRating"]) {
          if (key in node) errors.push(`${name} — JSON-LD ${node["@type"]} has "${key}"`);
        }
        const about = [node.jobTitle, node.honorificSuffix, node.description, node.name]
          .filter((v) => typeof v === "string" && node["@type"] !== "Question")
          .join(" ");
        const hit = about.match(/\borthodontists?\b|\bspecialists?\b/i);
        if (hit) errors.push(`${name} — JSON-LD ${node["@type"]} says "${hit[0]}"`);
      }
    }

    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1) errors.push(`${name} — expected exactly one <h1>, found ${h1s.length}`);

    // Strip the RSC payload and the review quotes, then look for words only allowed inside quotes.
    const outsideQuotes = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, "");
    for (const pattern of QUOTE_ONLY) {
      const hits = outsideQuotes.match(pattern);
      if (hits) warnings.push(`${name} — "${hits[0]}" outside a quoted review (${hits.length}x)`);
    }
  }
}

/* ---------------- report ---------------- */

for (const warning of warnings) console.warn(`copy-check: warning: ${warning}`);

if (errors.length) {
  console.error(`\ncopy-check: ${errors.length} problem${errors.length === 1 ? "" : "s"}\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error("");
  process.exit(1);
}

console.log(`copy-check: ${pages.length} pages clean`);
