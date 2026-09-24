// The generated site imagery arrives as multi-megabyte PNGs. The export is unoptimised
// (static), so they have to be sized and compressed here instead. Originals are kept in
// Site/_source/ and never ship.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(here, "..", "..", "Public", "Images", "Site");
const sourceDir = path.join(siteDir, "_source");

// Rendered width on the widest layout, doubled for high-density screens.
const WIDTHS = { hero: 1400, default: 900 };

const files = fs
  .readdirSync(siteDir, { withFileTypes: true })
  .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
  .map((e) => e.name);

if (!files.length) {
  console.log("optimise-site-images: nothing to do");
  process.exit(0);
}

fs.mkdirSync(sourceDir, { recursive: true });

for (const file of files) {
  const base = path.basename(file, path.extname(file));
  const from = path.join(siteDir, file);
  const width = base.includes("hero") ? WIDTHS.hero : WIDTHS.default;
  const to = path.join(siteDir, `${base}.avif`);

  await sharp(from)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 52, effort: 6 })
    .toFile(to);

  fs.renameSync(from, path.join(sourceDir, file));
  const kb = (n) => `${Math.round(fs.statSync(n).size / 1024)}kB`;
  console.log(`optimise-site-images: ${file} -> ${base}.avif (${kb(to)})`);
}
