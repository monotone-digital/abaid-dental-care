import fs from "node:fs";
import matter from "gray-matter";
import { CONTENT_DIR, readContent } from "./paths";

export type SectionType =
  | "text"
  | "clinic-card"
  | "faq"
  | "signpost"
  | "reviews"
  | "before-after"
  | "map";

export type Visual =
  | "portrait"
  | "interior"
  | "exterior"
  | "treatment"
  | "before-after"
  | "map"
  | "none";

export type Faq = { question: string; answer: string };
export type SignpostItem = { href: string; lead: string; rest: string };

export type Section = {
  id: string;
  heading: string;
  type: SectionType;
  sub: string | null;
  body: string;
  cta: boolean;
  call: boolean;
  beside: string | null;
  link: { href: string; label: string } | null;
  maps: string | null;
  visual: Visual;
  reviewIds: string[];
  faqs: Faq[];
  signpost: SignpostItem[];
};

export type Page = {
  slug: string;
  title: string;
  order: number;
  metaTitle: string;
  metaDescription: string;
  ctaLabel: string;
  ogTitle: string | null;
  ogDescription: string | null;
  sections: Section[];
};

const DIRECTIVE = /^@([a-zA-Z]+):\s*(.*)$/;

/** `### Question` blocks inside a faq body. */
function parseFaqs(body: string): Faq[] {
  const faqs: Faq[] = [];
  let current: Faq | null = null;

  for (const line of body.split("\n")) {
    const heading = /^###\s+(.*)$/.exec(line);
    if (heading) {
      if (current) faqs.push(current);
      current = { question: heading[1].trim(), answer: "" };
      continue;
    }
    if (current) current.answer += `${line}\n`;
  }
  if (current) faqs.push(current);

  return faqs.map((f) => ({ ...f, answer: f.answer.trim() }));
}

/** `- [**Lead.** rest](#anchor)` list items inside a signpost body. */
function parseSignpost(body: string): SignpostItem[] {
  const items: SignpostItem[] = [];
  const pattern = /^[-*]\s+\[\*\*(.+?)\*\*\s*(.*?)\]\((.+?)\)\s*$/;

  for (const line of body.split("\n")) {
    const match = pattern.exec(line.trim());
    if (match) items.push({ lead: match[1].trim(), rest: match[2].trim(), href: match[3].trim() });
  }
  return items;
}

function parseSections(raw: string): Section[] {
  const blocks = raw.split(/^##\s+/m).slice(1);
  const sections: Section[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const heading = (lines.shift() ?? "").trim();

    const directives: Record<string, string> = {};
    while (lines.length) {
      const match = DIRECTIVE.exec(lines[0]);
      if (!match) break;
      directives[match[1]] = match[2].trim();
      lines.shift();
    }

    // @status: held sections are dropped before anything else looks at them.
    if (directives.status === "held") continue;

    const body = lines
      .join("\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();

    const type = (directives.type ?? "text") as SectionType;
    const linkMatch = directives.link ? /^(.+?)\s*\|\s*(.+)$/.exec(directives.link) : null;

    sections.push({
      id: directives.id ?? "",
      heading,
      type,
      sub: directives.sub || null,
      body,
      cta: directives.cta === "whatsapp",
      call: directives.call === "yes",
      beside: directives.beside || null,
      link: linkMatch ? { href: linkMatch[1].trim(), label: linkMatch[2].trim() } : null,
      maps: directives.maps || null,
      visual: (directives.visual ?? "none") as Visual,
      reviewIds: directives.reviews
        ? directives.reviews.split(",").map((id) => id.trim()).filter(Boolean)
        : [],
      faqs: type === "faq" ? parseFaqs(body) : [],
      signpost: type === "signpost" ? parseSignpost(body) : [],
    });
  }

  return sections;
}

function readPage(file: string): Page {
  const parsed = matter(readContent(file));
  const data = parsed.data as Record<string, unknown>;

  return {
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    order: Number(data.order ?? 99),
    metaTitle: String(data.metaTitle ?? ""),
    metaDescription: String(data.metaDescription ?? ""),
    ctaLabel: String(data.ctaLabel ?? ""),
    ogTitle: data.ogTitle ? String(data.ogTitle) : null,
    ogDescription: data.ogDescription ? String(data.ogDescription) : null,
    sections: parseSections(parsed.content),
  };
}

let cached: Page[] | null = null;

export function getPages(): Page[] {
  if (cached) return cached;
  cached = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(readPage)
    .filter((p) => p.sections.length > 0)
    .sort((a, b) => a.order - b.order);
  return cached;
}

export function getPage(slug: string): Page | undefined {
  return getPages().find((p) => p.slug === slug);
}

export type Review = { id: string; name: string; text: string };

let reviewCache: Record<string, Review> | null = null;

export function getReviews(): Record<string, Review> {
  if (reviewCache) return reviewCache;
  const data = matter(readContent("reviews.md")).data as { reviews: Record<string, { name: string; text: string }> };
  reviewCache = Object.fromEntries(
    Object.entries(data.reviews ?? {}).map(([id, r]) => [id, { id, ...r }]),
  );
  return reviewCache;
}

export function getReviewsByIds(ids: string[]): Review[] {
  const all = getReviews();
  return ids.map((id) => all[id]).filter(Boolean);
}

/** href -> the WhatsApp button label approved for that page, for the header and sticky bar. */
export function getCtaLabels(): Record<string, string> {
  return Object.fromEntries(
    getPages().map((p) => [p.slug === "" ? "/" : "/" + p.slug, p.ctaLabel]),
  );
}
