import type { Page, Review, Section } from "@/lib/content";
import { getReviewsByIds } from "@/lib/content";
import type { Global } from "@/lib/global";
import GradientBackdrop from "../GradientBackdrop";
import { QuoteIcon } from "../Icons";
import Actions from "./Actions";
import ReviewsSection from "./ReviewsSection";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";

/** "Muhammad Arshad R." -> "MA": a monogram for the name, drawn from the name itself. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

function Monogram({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[0.8rem] font-semibold ${
        dark ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-mint text-teal-800"
      }`}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Home, "What patients say afterwards": the first review the copy lists is featured large on
 * the teal wash, the rest stacked beside it. Every review is quoted word for word in a
 * blockquote, with its name; no rating is shown, ever. Fewer than two reviews fall back to
 * the ordinary reviews layout.
 */
export default function HomeReviewsSection({
  section,
  page,
  global,
  tone,
}: {
  section: Section;
  page: Page;
  global: Global;
  tone: Tone;
}) {
  const reviews: Review[] = getReviewsByIds(section.reviewIds);
  if (reviews.length < 2) {
    return <ReviewsSection section={section} page={page} global={global} tone={tone} />;
  }
  const [featured, ...rest] = reviews;

  return (
    <SectionShell id={section.id} tone={tone}>
      <Headline level={2} tone={tone}>
        {section.heading}
      </Headline>
      {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}

      <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <figure className="relative isolate flex flex-col overflow-hidden rounded-panel bg-teal-900 p-7 text-white sm:p-10">
          <GradientBackdrop grainId={`${section.id}-grain`} />
          <QuoteIcon className="h-11 w-11 text-accent-light" />
          {/* A blockquote, so the copy check can tell quoted words from the clinic's own. */}
          <blockquote className="mt-6 font-display text-[1.2rem] font-medium leading-normal sm:text-[1.4rem]">
            {featured.text}
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3 pt-8 font-display text-[0.98rem] font-semibold">
            <Monogram name={featured.name} dark />
            {featured.name}
          </figcaption>
        </figure>

        <ul className="grid gap-5">
          {rest.map((review) => (
            <li key={review.id}>
              <figure className="flex h-full flex-col rounded-panel border border-line bg-mint-50 p-7">
                <QuoteIcon className="h-7 w-7 text-accent" />
                <blockquote className="mt-4 text-[1.05rem] leading-[1.7] text-ink">{review.text}</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6 font-display text-[0.95rem] font-semibold text-ink">
                  <Monogram name={review.name} />
                  {review.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} className="mt-10" />
    </SectionShell>
  );
}
