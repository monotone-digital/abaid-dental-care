import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { ALT, portrait } from "@/lib/images";
import { Actions, Band, Heading, Pill, paragraphs } from "./ui";

/**
 * The section is deliberately short, at Uzair's request (24 Sep 2026): his three paragraphs
 * are reduced to one sentence and four figures made of their own words, and no WhatsApp button (removed from the
 * content). The "+" framing of the first two figures is the client's call; BDS and C.Orth are
 * explained with the first paragraph's own words ("dental degree", "certificate in orthodontics").
 */
export const FIGURES = [
  { value: "6", suffix: "+", label: "Years of experience" },
  { value: "3,000", suffix: "+", label: "Patients treated" },
  { value: "BDS", suffix: "", label: "Dental degree" },
  { value: "C.Orth", suffix: "", label: "Certificate in orthodontics" },
];

/**
 * Google rating, as given by Uzair on 24 Sep 2026. It does not update itself: change it here
 * when the Google figure changes. This is the one rating CLAUDE.md and the copy rules allow
 * (approved by Uzair, 24 Sep 2026). It is never added to the JSON-LD.
 */
const GOOGLE_RATING = 4.7;

const STAR =
  "M12 2.8l2.75 5.6 6.15.9-4.45 4.33 1.05 6.12L12 16.87l-5.5 2.88 1.05-6.12L3.1 9.3l6.15-.9L12 2.8Z";

/** Five stars, each filled to its share of the rating (4.7 = four full, the fifth 70%). */
function Stars({ rating }: { rating: number }) {
  return (
    <span aria-hidden="true" className="flex gap-0.5 text-coral">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const id = `star-fill-${i}`;
        return (
          <svg key={i} viewBox="0 0 24 24" className="h-4.5 w-4.5">
            <defs>
              <linearGradient id={id}>
                <stop offset={fill} stopColor="currentColor" />
                <stop offset={fill} stopColor="currentColor" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path d={STAR} fill={`url(#${id})`} />
          </svg>
        );
      })}
    </span>
  );
}

/** The first sentence of a paragraph, verbatim. */
const firstSentence = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/)[0];

/**
 * Home, Dr Abaid, after the reference's "about" block: the heading, one sentence and four
 * figures over hairlines on the left; his photograph on the right in a plain rounded frame
 * (no clipping mask), with the Google rating on a small floating card. The portrait opens the
 * section (the content note), so it comes first on a phone.
 */
export default function DoctorSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const face = portrait();
  const eyebrow = section.link ? global.nav.find((n) => n.href === section.link?.href)?.title : null;
  // The credentials never break across lines ("C.Orth" alone on a line reads as a stray word).
  const creds = section.heading.endsWith(global.credentials) ? global.credentials : null;
  const name = creds ? section.heading.slice(0, -creds.length) : section.heading;
  // "Before treatment starts he tells you what he has found, what he plans to do about it and
  // what it will cost." — the third paragraph's first sentence, as it stands in the content.
  const parts = paragraphs(section.body);
  const line = parts[2] ? firstSentence(parts[2]) : null;

  return (
    <Band id={section.id}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          {eyebrow ? <Pill>{eyebrow}</Pill> : null}
          <Heading className={eyebrow ? "mt-5" : ""}>
            {name}
            {creds ? <span className="whitespace-nowrap">{creds}</span> : null}
          </Heading>
          {line ? (
            <p className="mt-5 max-w-[34rem] text-pretty text-[1.05rem] leading-[1.7] text-copy">{line}</p>
          ) : null}

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9 sm:gap-x-12">
            {FIGURES.map((figure) => (
              // Label first in the markup (dt, dd), figure first on screen, figures top-aligned per row.
              <div key={figure.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-3 border-t border-charcoal/12 pt-3 text-[0.9rem] text-hint">{figure.label}</dt>
                <dd className="text-[2.6rem] font-light leading-none tracking-[-0.035em] text-charcoal sm:text-[3.4rem]">
                  {figure.value}
                  {figure.suffix ? <span className="text-coral">{figure.suffix}</span> : null}
                </dd>
              </div>
            ))}
          </dl>

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="mt-10" />
        </div>

        {face ? (
          <div className="relative order-first mx-auto w-full max-w-[28rem] lg:order-none lg:col-span-5 lg:col-start-8 lg:max-w-none">
            {/* A tinted card set behind and below the photograph, for depth. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-care-100 sm:translate-x-4 sm:translate-y-4"
            />
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-care-100">
              <Image
                src={face}
                alt={ALT.portrait}
                fill
                sizes="(max-width: 1024px) 90vw, 36vw"
                // Zoomed in about his face (49% across, 23% down in the photograph), so the face
                // stays where it is and the frame closes in around it: 1.2x, then 25% more
                // (1.2 x 1.25 = 1.5x); Uzair's call, 24 Sep 2026.
                className="origin-[49%_23%] scale-150 object-cover object-[50%_20%]"
              />
            </div>

            <div className="absolute left-3 top-[9%] rounded-2xl bg-white px-4 py-3.5 shadow-[0_18px_40px_-18px_rgb(35_31_32/0.35)] sm:px-5 lg:-left-12">
              <p className="text-[0.85rem] font-medium text-charcoal">Google rating</p>
              <div className="mt-2">
                <Stars rating={GOOGLE_RATING} />
              </div>
              <p className="mt-2 text-[1.6rem] font-light leading-none tracking-[-0.02em] text-deep">
                {GOOGLE_RATING}
                <span aria-hidden="true" className="text-[1rem] text-hint">
                  /5
                </span>
                <span className="sr-only"> out of 5</span>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </Band>
  );
}
