import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import { RecementIcon, ShieldCheckIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, bodyColour, type Tone } from "./Shell";
import TextSection from "./TextSection";

/** One icon per sentence of the terms paragraph: replaced free, then re-cemented. */
const TERM_MARKS: ComponentType<SVGProps<SVGSVGElement>>[] = [ShieldCheckIcon, RecementIcon];

const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** The tag's punched hole shows the band behind it. */
const HOLE: Record<Tone, string> = {
  light: "bg-white",
  mint: "bg-mint-50",
  cream: "bg-cream",
  dark: "bg-teal-900",
};

/** Splits a paragraph at its sentence ends, keeping every word and mark. */
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

/**
 * Home, "Caps and bridges, with the terms in writing": the crown-and-bridge picture with its
 * starting price hung on the corner as a tag, and the words beside it; beside the words (lg)
 * the picture takes their height, so the two always match. The first line stays
 * directly above the signed-off quote (see the content note); the terms paragraph that follows
 * is set as a written card, one row per sentence, words unchanged. The tag restates the @sub,
 * which still renders under the heading, so it is hidden from screen readers. If the copy stops
 * being three paragraphs with two sentences of terms, the ordinary layout is used.
 */
export default function HomeCapsSection({
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
  const parts = paragraphs(section.body);
  const photo = site("caps-section");
  const terms = parts[2] ? sentences(parts[2]) : [];
  if (parts.length !== 3 || terms.length !== TERM_MARKS.length || !photo) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }
  const [lead, quote] = parts;
  const price = section.sub ? /^(From)\s+(PKR [\d,]+)/i.exec(section.sub) : null;

  return (
    // Clipped, so the tilted tag never widens the page on a phone.
    <SectionShell id={section.id} tone={tone} className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-panel bg-mint-100 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <Image
              src={photo}
              alt="A crown and a bridge on a plaster model of the lower teeth"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          {price ? (
            <div
              aria-hidden="true"
              className="absolute -right-2 -top-4 rotate-6 rounded-2xl bg-[linear-gradient(135deg,var(--color-teal-600),var(--color-teal-900))] px-5 py-4 text-white shadow-xl shadow-ink/20 sm:-right-4"
            >
              {/* The punched hole a price tag hangs from. */}
              <span className={`absolute left-3 top-3 h-2 w-2 rounded-full ${HOLE[tone]}`} />
              <span className="block pl-3 font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-light">
                {price[1]}
              </span>
              <span className="mt-0.5 block font-display text-[1.6rem] font-bold leading-none tracking-[-0.01em]">
                {price[2]}
              </span>
            </div>
          ) : null}
        </div>

        <div>
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>
          {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}

          <Markdown className="mt-6 font-display text-[1.15rem] font-medium leading-snug text-teal-800">
            {lead}
          </Markdown>
          <Markdown className={`mt-5 ${bodyColour(tone)}`}>{quote}</Markdown>

          <div className="mt-6 rounded-card border border-line bg-white p-5 shadow-sm shadow-ink/5 sm:p-6">
            <ul className="space-y-4">
              {terms.map((term, index) => {
                const Mark = TERM_MARKS[index];
                return (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-teal-700">
                      <Mark className="h-5 w-5" />
                    </span>
                    <p className="pt-1.5 leading-[1.7] text-body">{term}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
        </div>
      </div>
    </SectionShell>
  );
}
