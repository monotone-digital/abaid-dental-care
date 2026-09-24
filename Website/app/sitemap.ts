import type { MetadataRoute } from "next";
import { getGlobal } from "@/lib/global";
import { pathFor } from "@/lib/metadata";

export const dynamic = "force-static";

/** The sitemap reads the nav in _global.md and nothing else. */
export default function sitemap(): MetadataRoute.Sitemap {
  const global = getGlobal();
  const base = global.siteUrl.replace(/\/+$/, "");

  return global.nav.map((item) => ({
    url: base + pathFor(item.href.replace(/^\//, "")),
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
