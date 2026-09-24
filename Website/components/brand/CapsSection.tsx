import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import { RecementIcon, ShieldCheckIcon } from "../Icons";
import { Actions, Band, Heading, paragraphs } from "./ui";

/** One icon per sentence of the terms paragraph: replaced free, then re-cemented. */
const TERM_MARKS: ComponentType<SVGProps<SVGSVGElement>>[] = [ShieldCheckIcon, RecementIcon];

/** Splits a paragraph at its sentence ends, keeping every word and mark. */
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

/**
 * Home, "Caps and bridges" (shortened from "…, with the terms in writing" at Uzair's request,
 * 24 Sep 2026, in the content itself), as the reference's closing panel: a
 * Care Teal tint inset from the page, the words on one side and the generated crown-and-bridge
 * picture in a plain rounded frame on the other, its starting price hung on it as a Coral tag. The
 * picture stands in while the caps before/after folder is empty (the client's call). The first
 * line stays directly above the signed-off quote (the content note); the terms paragraph is
 * set as two white cards, one per sentence, words unchanged. The tag restates the @sub, which
 * still renders under the heading, so it is hidden from screen readers.
 */
export default function CapsSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const parts = paragraphs(section.body);
  const photo = site("caps-section");
  const [lead, quote, termsText] = parts;
  const terms = termsText ? sentences(termsText) : [];
  const price = section.sub ? /^(From)\s+(PKR [\d,]+)/i.exec(section.sub) : null;
  const splitTerms = parts.length === 3 && terms.length === TERM_MARKS.length;

  return (
    <Band id={section.id}>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-care-100 px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <Heading>{section.heading}</Heading>
            {section.sub ? <p className="mt-3 text-[1.05rem] text-copy">{section.sub}</p> : null}

            {splitTerms ? (
              <>
                <Markdown tone="brand" className="mt-7 text-[1.2rem] leading-snug text-charcoal">
                  {lead}
                </Markdown>
                <Markdown tone="brand" className="mt-5 text-copy">
                  {quote}
                </Markdown>
                <ul className="mt-5 grid gap-3">
                  {terms.map((term, index) => {
                    const Icon = TERM_MARKS[index];
                    return (
                      <li key={index} className="flex gap-4 rounded-2xl bg-white/70 p-4 sm:p-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-care-100 text-deep">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="pt-1.5 leading-[1.7] text-copy">{term}</p>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <Markdown tone="brand" className="mt-7 text-copy">
                {section.body}
              </Markdown>
            )}

            <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
          </div>

          {photo ? (
            <div className="relative order-first lg:order-none lg:self-stretch">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-white lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <Image
                  src={photo}
                  alt="A crown and a bridge on a plaster model of the lower teeth"
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
              {price ? (
                <div
                  aria-hidden="true"
                  className="absolute bottom-4 left-4 -rotate-2 rounded-2xl bg-coral px-5 py-3.5 text-charcoal shadow-[0_18px_40px_-18px_rgb(35_31_32/0.45)] sm:bottom-5 sm:left-5"
                >
                  <span className="block text-[0.78rem] font-semibold uppercase tracking-[0.14em]">{price[1]}</span>
                  <span className="mt-0.5 block text-[1.6rem] font-semibold leading-none tracking-[-0.02em]">
                    {price[2]}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Band>
  );
}
