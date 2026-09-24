import fs from "node:fs";
import path from "node:path";

// The content lives beside the app, not inside it, so Vercel's root directory is the repo root.
export const CONTENT_DIR = path.resolve(process.cwd(), "..", "Content");

/**
 * Reads a content file with its line endings normalised. A file saved on Windows has CRLF
 * endings, and without this every `@directive` line would carry a trailing "\r" and fail
 * to parse — the page would lose its section ids, types and images without any error.
 */
export function readContent(file: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, file), "utf8").replace(/\r\n?/g, "\n");
}
