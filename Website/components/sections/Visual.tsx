import Image from "next/image";
import type { Section } from "@/lib/content";
import { ALT, beforeAfter, exterior, interior, portrait, site, treatment } from "@/lib/images";

const frame = "overflow-hidden rounded-panel bg-mint-100";

type SiteVisual = {
  images: { image: string; alt: string }[];
  ratio: string;
  /** Only while the section has no before/after pair of its own. */
  standIn?: boolean;
};

/**
 * Deliberate departures from the content, at the owner's request: generated pictures from
 * the site set in place of what a section's @visual asks for. Keyed by page slug, then
 * section id.
 * - Home "caps" asks for a before/after pair and, while that folder is empty, no image.
 * - First visit "hero" asks for a clinic interior. (Its "arrive" and "see-it" sections have
 *   their own components, which place their generated pictures themselves.)
 */
const SITE_VISUALS: Record<string, Record<string, SiteVisual>> = {
  "": {
    caps: {
      images: [{ image: "caps-section", alt: "A crown and a bridge on a plaster model of the lower teeth" }],
      ratio: "aspect-4/3",
      standIn: true,
    },
  },
  "first-visit": {
    hero: {
      images: [{ image: "first-visit-hero", alt: "A patient in the dental chair talking with the dentist" }],
      ratio: "aspect-16/10",
    },
  },
};

/** The section's generated picture(s), or null if it has none or any file is missing. */
function siteVisual(section: Section, pageSlug: string) {
  const entry = SITE_VISUALS[pageSlug]?.[section.id];
  if (!entry) return null;
  if (entry.standIn && beforeAfter(pageSlug).length > 0) return null;
  const images = entry.images.map(({ image, alt }) => ({ alt, src: site(image) }));
  if (images.some((i) => !i.src)) return null;
  return { ...entry, images: images as { src: string; alt: string }[] };
}

function Photo({
  src,
  alt,
  ratio,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  ratio: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${ratio} ${frame}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/**
 * Resolves a section's @visual against the photo library. Returns null when there is
 * no photograph of that kind — a section is never built around an image that does not exist.
 */
export default function Visual({
  section,
  pageTitle,
  pageSlug,
  className = "",
}: {
  section: Section;
  pageTitle: string;
  pageSlug: string;
  className?: string;
}) {
  const sizes = "(max-width: 1024px) 100vw, 45vw";

  const generated = siteVisual(section, pageSlug);
  if (generated) {
    const { images, ratio } = generated;
    const each = images.length > 1 ? "(max-width: 1024px) 50vw, 23vw" : sizes;
    return (
      <div className={className}>
        <div className={`grid gap-3 ${images.length > 1 ? "grid-cols-2" : ""}`}>
          {images.map((img) => (
            <Photo key={img.src} src={img.src} alt={img.alt} ratio={ratio} sizes={each} />
          ))}
        </div>
      </div>
    );
  }

  if (section.visual === "portrait") {
    const src = portrait();
    if (!src) return null;
    return (
      <div className={className}>
        <Photo src={src} alt={ALT.portrait} ratio="aspect-4/5" sizes={sizes} />
      </div>
    );
  }

  if (section.visual === "interior") {
    const src = interior(section.id);
    if (!src) return null;
    return (
      <div className={className}>
        <Photo src={src} alt={ALT.interior} ratio="aspect-4/3" sizes={sizes} />
      </div>
    );
  }

  if (section.visual === "exterior") {
    const src = exterior();
    if (!src) return null;
    return (
      <div className={className}>
        <Photo src={src} alt={ALT.exterior} ratio="aspect-4/3 lg:aspect-16/9" sizes="100vw" />
      </div>
    );
  }

  if (section.visual === "treatment") {
    const src = treatment();
    if (!src) return null;
    // Cropped to Dr Abaid and the patient, who sit between roughly 20% and 76% of the
    // photograph's height; the wall above and the instrument tray below are cut away.
    // Beside the text (lg+), the frame is the text's height plus 25px above and below, but
    // never taller than 80% of its width — any taller and the wall and tray come back into
    // view — in which case it stays centred on the text instead.
    return (
      <div className={className}>
        <div className="relative aspect-5/4 overflow-hidden rounded-panel bg-mint-100 lg:absolute lg:inset-x-0 lg:top-1/2 lg:aspect-auto lg:h-[calc(100%_+_50px)] lg:max-h-[80cqw] lg:-translate-y-1/2">
          <Image
            src={src}
            alt={ALT.treatment}
            fill
            sizes={sizes}
            className="object-cover object-[50%_45%]"
          />
        </div>
      </div>
    );
  }

  if (section.visual === "before-after") {
    const pairs = beforeAfter(pageSlug);
    const pair = pairs[0];
    if (!pair) return null;
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        <figure>
          <Photo
            src={pair.before}
            alt={`${pageTitle} before`}
            ratio="aspect-square"
            sizes="(max-width: 1024px) 45vw, 22vw"
          />
          <figcaption className="mt-2.5 text-center text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-muted">
            Before
          </figcaption>
        </figure>
        <figure>
          <Photo
            src={pair.after}
            alt={`${pageTitle} after`}
            ratio="aspect-square"
            sizes="(max-width: 1024px) 45vw, 22vw"
          />
          <figcaption className="mt-2.5 text-center text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-teal-700">
            After
          </figcaption>
        </figure>
      </div>
    );
  }

  return null;
}

/** Whether a photograph of this kind actually exists, so a section is never built around a gap. */
export function hasVisual(section: Section, pageSlug: string): boolean {
  if (siteVisual(section, pageSlug)) return true;
  switch (section.visual) {
    case "portrait":
      return portrait() !== null;
    case "interior":
      return interior(section.id) !== null;
    case "exterior":
      return exterior() !== null;
    case "treatment":
      return treatment() !== null;
    case "before-after":
      return beforeAfter(pageSlug).length > 0;
    default:
      return false;
  }
}
