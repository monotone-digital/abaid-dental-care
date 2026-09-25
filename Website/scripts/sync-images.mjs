// Copies the client's photo library from <repo>/Public/Images into Website/public/images,
// slugifying every path segment so the served URLs are safe, and writes lib/image-manifest.json
// so components can ask "does this folder have anything in it?" without touching the filesystem.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const source = path.resolve(appRoot, "..", "Public", "Images");
const target = path.resolve(appRoot, "public", "images");
const manifestPath = path.resolve(appRoot, "lib", "image-manifest.json");

// Before/after folders are named by treatment, pages are named by slug.
const BEFORE_AFTER_SLUGS = {
  braces: "braces-and-aligners",
  "caps-and-bridges": "caps-and-bridges",
  fillings: "fillings",
  "root-canal": "root-canal",
  "teeth-cleaning": "teeth-cleaning",
  "teeth-whitening": "teeth-whitening",
  "tooth-removal": "tooth-removal",
};

const IGNORE = new Set(["desktop.ini", ".ds_store", "thumbs.db"]);

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const slugFile = (name) => {
  const ext = path.extname(name).toLowerCase();
  return `${slug(path.basename(name, path.extname(name)))}${ext}`;
};

const listDirs = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

const listFiles = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isFile() && !IGNORE.has(e.name.toLowerCase()))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, "en"))
    : [];

// A photo dropped in as PNG, JPEG or WebP (straight from a phone or an image editor) can be
// several megabytes, and the export serves images as they are. Those are served as AVIF instead,
// at most 1,600px wide. The originals in Public/Images are never touched.
const CONVERT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const conversions = [];

const copy = (fromDir, fileName, toParts) => {
  const outDir = path.join(target, ...toParts);
  fs.mkdirSync(outDir, { recursive: true });
  const convert = CONVERT.has(path.extname(fileName).toLowerCase());
  const outName = convert ? `${slug(path.basename(fileName, path.extname(fileName)))}.avif` : slugFile(fileName);
  const from = path.join(fromDir, fileName);
  const to = path.join(outDir, outName);
  const src = fs.statSync(from);
  if (!fs.existsSync(to) || fs.statSync(to).mtimeMs < src.mtimeMs) {
    if (convert) {
      conversions.push(
        sharp(from).resize({ width: 1600, withoutEnlargement: true }).avif({ quality: 60, effort: 6 }).toFile(to),
      );
    } else {
      fs.copyFileSync(from, to);
    }
  }
  return `/images/${[...toParts, outName].join("/")}`;
};

const copyFlat = (folderName, key) => {
  const dir = path.join(source, folderName);
  return listFiles(dir).map((f) => copy(dir, f, [key]));
};

if (!fs.existsSync(source)) {
  console.error(`sync-images: no photo library at ${source}`);
  process.exit(1);
}

const manifest = {
  portrait: copyFlat("Portrait", "portrait"),
  interior: copyFlat("Interior", "interior"),
  exterior: copyFlat("Exterior", "exterior"),
  treatment: copyFlat("Treatment in process", "treatment"),
  site: {},
  beforeAfter: {},
};

// Site imagery (hero, treatment cards) is keyed by file name so components can name what they want.
const siteDir = path.join(source, "Site");
for (const file of listFiles(siteDir)) {
  const url = copy(siteDir, file, ["site"]);
  manifest.site[slug(path.basename(file, path.extname(file)))] = url;
}

// Before/after: <Treatment>/<Case N>/ holds the pair, named "before" and "after".
const beforeAfterDir = path.join(source, "Before-After");
for (const treatment of listDirs(beforeAfterDir)) {
  const key = BEFORE_AFTER_SLUGS[slug(treatment)];
  if (!key) {
    console.warn(`sync-images: skipping before/after folder "${treatment}" — no page slug maps to it`);
    continue;
  }
  const treatmentDir = path.join(beforeAfterDir, treatment);
  const cases = [];
  for (const caseName of listDirs(treatmentDir)) {
    const caseDir = path.join(treatmentDir, caseName);
    const files = listFiles(caseDir);
    if (files.length < 2) continue;
    // "Before.avif" / "fillings-after.avif": the names say which is which. Sorted by name,
    // "After" would come first, so the order is only the fallback for unlabelled files.
    const named = (word) => files.find((f) => new RegExp(`(^|[^a-z])${word}([^a-z]|$)`, "i").test(f));
    const before = named("before") ?? files[0];
    const after = named("after") ?? files.find((f) => f !== before);
    const parts = [key, slug(caseName)];
    cases.push({
      id: slug(caseName),
      before: copy(caseDir, before, parts),
      after: copy(caseDir, after, parts),
    });
  }
  if (cases.length) manifest.beforeAfter[key] = cases;
}

await Promise.all(conversions);

fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const pairs = Object.values(manifest.beforeAfter).reduce((n, c) => n + c.length, 0);
console.log(
  `sync-images: ${manifest.portrait.length} portrait, ${manifest.interior.length} interior, ` +
    `${manifest.exterior.length} exterior, ${manifest.treatment.length} treatment, ${Object.keys(manifest.site).length} site, ${pairs} before/after pairs`,
);
