import matter from "gray-matter";
import { readContent } from "./paths";

export type NavItem = { title: string; href: string };

export type Global = {
  clinic: string;
  dentist: string;
  credentials: string;
  siteUrl: string;
  phone: { display: string; tel: string; callLabel: string };
  whatsapp: string;
  replyTime: string;
  address: { lines: string[]; oneLine: string; landmark: string };
  maps: { url: string; embed: string; geo: string };
  hours: {
    week: Record<string, string>;
    todayLabel: string;
    fallback: string;
    jummah: string;
    timezone: string;
  };
  nav: NavItem[];
  treatmentGroup: string[];
  navSplit?: { treatments: string; prices: string };
  social: Record<string, string>;
  og: { title: string; description: string; image: string };
};

let cached: Global | null = null;

export function getGlobal(): Global {
  if (cached) return cached;
  cached = matter(readContent("_global.md")).data as Global;
  return cached;
}

/** A value is only usable if the copy team has actually supplied it. */
export const isMissing = (value: unknown): boolean =>
  typeof value !== "string" || value.trim() === "" || value.includes("[NEEDS:");

export const resolved = (value: string | undefined): string | null =>
  isMissing(value) ? null : (value as string);

export type BrandNavItem = { title: string; href?: string; children?: NavItem[] };

/**
 * The new design's header (Home for now): "Treatments and prices" becomes two items. The
 * "Treatments" item only opens the seven treatment pages (it links nowhere itself); "Prices"
 * goes to the price list at /treatments. Labels from `navSplit` in _global.md; without it,
 * the current grouping is used.
 */
export function getBrandNavGroups(global: Global = getGlobal()): BrandNavItem[] {
  if (!global.navSplit) return getNavGroups(global);
  const group = new Set(global.treatmentGroup);
  const items: BrandNavItem[] = [];

  for (const item of global.nav) {
    if (group.has(item.href)) continue;
    if (item.href === "/treatments") {
      items.push({ title: global.navSplit.treatments, children: global.nav.filter((n) => group.has(n.href)) });
      items.push({ title: global.navSplit.prices, href: item.href });
      continue;
    }
    items.push(item);
  }
  return items;
}

/** Nav split the way the header menu wants it: treatments collapse into one group. */
export function getNavGroups(global: Global = getGlobal()) {
  const group = new Set(global.treatmentGroup);
  const parentHref = "/treatments";
  const items: (NavItem & { children?: NavItem[] })[] = [];

  for (const item of global.nav) {
    if (group.has(item.href)) continue;
    if (item.href === parentHref) {
      items.push({
        ...item,
        children: global.nav.filter((n) => group.has(n.href)),
      });
      continue;
    }
    items.push(item);
  }
  return items;
}
