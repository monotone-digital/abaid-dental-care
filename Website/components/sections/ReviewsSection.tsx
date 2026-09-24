import type { Page, Section } from "@/lib/content";
import { getReviewsByIds } from "@/lib/content";
import type { Global } from "@/lib/global";
import { QuoteIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";

/**
 * How many reviews share a row on wide screens. Pages quote one to three, so the grid is
 * sized to the count rather than leaving empty columns. Below the breakpoint they stack.
 */
const COLUMNS: Record<number, string> = {
  1: "mx-auto max-w-2xl",
  2: "md:grid-cols-2",
  3: "lg:grid-cols-3",
};

/**
 * Reviews are quoted word for word, with a name. No rating is shown, ever. The section's
 * @visual photograph is deliberately not rendered, at the client's request.
 */
export default function ReviewsSection({
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
  const reviews = getReviewsByIds(section.reviewIds);
  if (!reviews.length) return null;

  const columns = COLUMNS[reviews.length] ?? "md:grid-cols-2 lg:grid-cols-3";

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="text-center">
        <Headline level={2} tone={tone}>
          {section.heading}
        </Headline>
        {section.sub ? (
          <Sub tone={tone} className="mx-auto">
            {section.sub}
          </Sub>
        ) : null}
      </div>

      <ul className={`mt-10 grid gap-5 ${columns}`}>
        {reviews.map((review) => (
          <li key={review.id} className="flex flex-col rounded-panel bg-mint p-7">
            <QuoteIcon className="h-8 w-8 text-accent" />
            {/* A blockquote, so the copy check can tell quoted words from the clinic's own. */}
            <blockquote className="mt-4 text-[1.02rem] leading-[1.75] text-body">
              {review.text}
            </blockquote>
            <p className="mt-auto pt-5 font-display text-[0.95rem] font-semibold text-ink">
              {review.name}
            </p>
          </li>
        ))}
      </ul>

      <Actions
        section={section}
        global={global}
        ctaLabel={page.ctaLabel}
        tone={tone}
        className="mt-10 flex flex-col items-center"
      />
    </SectionShell>
  );
}
