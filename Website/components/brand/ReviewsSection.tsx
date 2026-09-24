import Image from "next/image";
import type { Page, Review, Section } from "@/lib/content";
import { getReviewsByIds } from "@/lib/content";
import type { Global } from "@/lib/global";
import { QuoteIcon } from "../Icons";
import { Actions, Band, Heading, initials } from "./ui";

function Monogram({ name, onTeal = false }: { name: string; onTeal?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-semibold ${
        onTeal ? "bg-white text-deep" : "bg-care-100 text-deep"
      }`}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Home, "What patients say afterwards". The first review the copy lists is featured on Care
 * Teal, the others on white beside it. Every review is quoted word for word in a blockquote
 * with its name; no rating is shown, ever. Monograms stand in for the reference's portraits,
 * since there are no patient photos. The @visual (an interior) is not used, at the client's request.
 */
export default function ReviewsSection({
  section,
  page,
  global,
  picture,
}: {
  section: Section;
  page: Page;
  global: Global;
  /** Beside a single review, a photograph of the clinic (where the copy's @visual asks for one). */
  picture?: { src: string; alt: string } | null;
}) {
  const reviews: Review[] = getReviewsByIds(section.reviewIds);
  if (!reviews.length) return null;
  const [featured, ...rest] = reviews;
  const photo = rest.length ? null : picture;

  return (
    <Band id={section.id}>
      <div className="max-w-[40rem]">
        <Heading>{section.heading}</Heading>
        {section.sub ? <p className="mt-4 text-[1.05rem] leading-[1.7] text-copy">{section.sub}</p> : null}
      </div>

      <div className={`mt-10 grid gap-4 ${rest.length || photo ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]" : ""}`}>
        <figure className="flex flex-col rounded-3xl bg-care p-7 sm:p-10">
          <QuoteIcon className="h-10 w-10 text-charcoal" />
          {/* A blockquote, so the copy check can tell quoted words from the clinic's own. */}
          <blockquote className="mt-6 text-[1.25rem] leading-[1.45] tracking-[-0.01em] text-charcoal sm:text-[1.55rem]">
            {featured.text}
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3 pt-9 text-[1rem] font-semibold text-charcoal">
            <Monogram name={featured.name} onTeal />
            {featured.name}
          </figcaption>
        </figure>

        {rest.length ? (
          <ul className="grid gap-4">
            {rest.map((review) => (
              <li key={review.id}>
                <figure className="flex h-full flex-col rounded-3xl bg-white p-7">
                  <QuoteIcon className="h-7 w-7 text-coral" />
                  <blockquote className="mt-4 text-[1.1rem] leading-[1.6] text-charcoal">{review.text}</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-6 text-[0.95rem] font-semibold text-charcoal">
                    <Monogram name={review.name} />
                    {review.name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        {photo ? (
          <div className="relative hidden min-h-[20rem] overflow-hidden rounded-3xl bg-care-100 lg:block">
            <Image src={photo.src} alt={photo.alt} fill sizes="36vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="mt-10" />
    </Band>
  );
}
