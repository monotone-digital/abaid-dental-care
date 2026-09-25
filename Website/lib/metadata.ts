import type { Metadata } from "next";
import type { Page } from "./content";
import { getGlobal, resolved } from "./global";

export const pathFor = (slug: string) => (slug === "" ? "/" : `/${slug}/`);

export function buildMetadata(page: Page): Metadata {
  const global = getGlobal();
  const url = pathFor(page.slug);
  const image = resolved(global.og.image);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: global.clinic,
      locale: "en_PK",
      url,
      title: page.ogTitle ?? global.og.title,
      description: page.ogDescription ?? page.metaDescription,
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary" },
  };
}
