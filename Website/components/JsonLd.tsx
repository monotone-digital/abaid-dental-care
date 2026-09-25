import type { Page } from "@/lib/content";
import { getGlobal, resolved, type Global } from "@/lib/global";
import { exterior, portrait } from "@/lib/images";
import { pathFor } from "@/lib/metadata";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const to24 = (hour: string, minute: string | undefined, meridiem: string) => {
  let h = Number(hour) % 12;
  if (meridiem.toLowerCase() === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${minute ?? "00"}`;
};

/** "10am to 1pm and 4pm to 8pm" -> [["10:00","13:00"],["16:00","20:00"]] */
function ranges(value: string): [string, string][] {
  const pattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*to\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi;
  const out: [string, string][] = [];
  for (const m of value.matchAll(pattern)) {
    out.push([to24(m[1], m[2], m[3]), to24(m[4], m[5], m[6])]);
  }
  return out;
}

const base = (global: Global) => global.siteUrl.replace(/\/+$/, "");
const absolute = (global: Global, path: string) => base(global) + path;

/** Stable node ids, so every page's graph points at the same clinic and the same dentist. */
const ids = (global: Global) => ({
  clinic: `${base(global)}/#clinic`,
  dentist: `${base(global)}/about/#dr-abaid`,
  website: `${base(global)}/#website`,
});

/** Markdown answer -> plain text, word for word: only the markup goes. */
function plain(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/^\s*#+\s+/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

function clinicNode(global: Global) {
  const openingHoursSpecification = Object.entries(global.hours.week).flatMap(([index, value]) =>
    ranges(value).map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAYS[Number(index)]}`,
      opens,
      closes,
    })),
  );

  const [street, road, city] = global.address.lines;
  const geo = resolved(global.maps.geo);
  const hasMap = resolved(global.maps.url);
  const photo = exterior();

  const node: Record<string, unknown> = {
    "@type": "Dentist",
    "@id": ids(global).clinic,
    name: global.clinic,
    url: absolute(global, "/"),
    logo: absolute(global, "/brand/logo.png"),
    telephone: global.phone.tel.replace(/^tel:/, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: [street, road].filter(Boolean).join(", "),
      addressLocality: city,
      addressCountry: "PK",
    },
    openingHoursSpecification,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: global.nav.find((item) => item.href === "/treatments")?.title,
      itemListElement: services(global).map((service) => ({
        "@type": "Offer",
        itemOffered: { "@id": service["@id"], "@type": "Service", name: service.name, url: service.url },
      })),
    },
    sameAs: [...Object.values(global.social ?? {}), ...(hasMap ? [hasMap] : [])],
  };

  if (photo) node.image = absolute(global, photo);
  if (geo) {
    const [latitude, longitude] = geo.split(",").map((part) => part.trim());
    node.geo = { "@type": "GeoCoordinates", latitude, longitude };
  }
  if (hasMap) node.hasMap = hasMap;

  return node;
}

/**
 * The seven treatments in treatmentGroup and nothing else (approved 25 Sep 2026), named by
 * their nav titles. No prices: those stay as approved text on the pages.
 */
function services(global: Global) {
  return global.treatmentGroup.map((href) => ({
    "@type": "Service",
    "@id": `${absolute(global, pathFor(href.replace(/^\//, "")))}#service`,
    name: global.nav.find((item) => item.href === href)?.title ?? href,
    url: absolute(global, pathFor(href.replace(/^\//, ""))),
    provider: { "@id": ids(global).clinic },
    areaServed: { "@type": "City", name: global.address.lines.at(-1) },
  }));
}

/** Dr Abaid: a dentist, never "orthodontist" or "specialist". Credentials as _global.md has them. */
function dentistNode(global: Global) {
  const photo = portrait();
  return {
    "@type": "Person",
    "@id": ids(global).dentist,
    name: global.dentist,
    honorificSuffix: global.credentials,
    jobTitle: "Dentist",
    url: absolute(global, pathFor("about")),
    worksFor: { "@id": ids(global).clinic },
    ...(photo ? { image: absolute(global, photo) } : {}),
  };
}

function breadcrumbNode(global: Global, page: Page) {
  const path = "/" + page.slug;
  const title = (href: string) => global.nav.find((item) => item.href === href)?.title ?? page.title;
  const trail: { name: string; href: string }[] = [{ name: title("/"), href: "/" }];

  if (global.treatmentGroup.includes(path)) trail.push({ name: title("/treatments"), href: "/treatments" });
  trail.push({ name: title(path), href: path });

  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(global, pathFor(crumb.href.replace(/^\//, ""))),
    })),
  };
}

/** The page's own FAQ sections, question and answer exactly as approved. Held sections never get here. */
function faqNode(page: Page) {
  const faqs = page.sections.filter((s) => s.type === "faq").flatMap((s) => s.faqs);
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: plain(faq.answer) },
    })),
  };
}

function Graph({ nodes }: { nodes: Record<string, unknown>[] }) {
  const data = { "@context": "https://schema.org", "@graph": nodes };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Structured data for one page. The clinic, Dr Abaid and the site are described on Home; the
 * About page repeats Dr Abaid. Every page adds its FAQs, and inner pages their breadcrumb.
 * No aggregateRating, no review nodes, no priceRange, no email. Services are the seven treatments only.
 */
export default function PageJsonLd({ page }: { page: Page }) {
  const global = getGlobal();
  const nodes: Record<string, unknown>[] = [];

  if (page.slug === "") {
    nodes.push(clinicNode(global), dentistNode(global), {
      "@type": "WebSite",
      "@id": ids(global).website,
      name: global.clinic,
      url: absolute(global, "/"),
      publisher: { "@id": ids(global).clinic },
    });
  } else {
    if (page.slug === "about") nodes.push(dentistNode(global));
    const service = services(global).find((s) => s.url === absolute(global, pathFor(page.slug)));
    if (service) nodes.push(service);
    nodes.push(breadcrumbNode(global, page));
  }

  const faq = faqNode(page);
  if (faq) nodes.push(faq);

  return <Graph nodes={nodes} />;
}
