import { execFileSync } from "node:child_process";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getGlobal } from "@/lib/global";
import { pathFor } from "@/lib/metadata";
import { CONTENT_DIR } from "@/lib/paths";

export const dynamic = "force-static";

/**
 * When a page's words last changed: the last commit that touched its content file. Left out
 * when git can't say (a shallow clone that doesn't reach it) — a wrong date is worse than none.
 */
function lastCommit(slug: string): string | undefined {
  const file = path.join(CONTENT_DIR, `${slug || "home"}.md`);
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: CONTENT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return date || undefined;
  } catch {
    return undefined;
  }
}

/** The sitemap reads the nav in _global.md and nothing else. */
export default function sitemap(): MetadataRoute.Sitemap {
  const global = getGlobal();
  const base = global.siteUrl.replace(/\/+$/, "");

  return global.nav.map((item) => {
    const slug = item.href.replace(/^\//, "");
    const lastModified = lastCommit(slug);
    return {
      url: base + pathFor(slug),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.8,
    };
  });
}
