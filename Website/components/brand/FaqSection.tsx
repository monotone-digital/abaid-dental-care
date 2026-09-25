import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import { ChevronDown } from "../Icons";
import { Actions, Band, Heading, LinkButton, Pill } from "./ui";

/**
 * A button under an answer, shown with it when the question is opened; at Uzair's request
 * (24 Sep 2026). Keyed by the question's own words, so it stays with its answer if the order
 * changes. "See all treatments and prices" is the approved label of Home's price-list link.
 */
const ANSWER_LINKS: Record<string, { href: string; label: string }> = {
  "What will it cost?": { href: "/treatments", label: "See all treatments and prices" },
  "Can braces be paid monthly?": { href: "/braces-and-aligners", label: "See braces and clear aligners" },
};

/**
 * Accordion, after the reference's FAQ: hairline rows, a chevron per question. Native
 * <details>, first item open, so it works with no JavaScript and every answer stays in the
 * HTML. After Uzair's reference (25 Sep 2026), on every page: a small "FAQ" pill with the logo
 * heads the left column, and on wide screens a round picture of a tooth (generated, decorative,
 * Site/faq-tooth) sits at the foot of it.
 */
export default function FaqSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  if (!section.faqs.length) return null;
  const tooth = site("faq-tooth");

  return (
    <Band id={section.id}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between gap-10 lg:col-span-4">
          <Pill className="self-start">FAQ</Pill>
          {tooth ? (
            <div className="hidden w-full max-w-[15rem] rounded-full bg-care-100 p-3 lg:block">
              <div className="relative aspect-square overflow-hidden rounded-full">
                <Image src={tooth} alt="" fill sizes="15rem" className="object-cover" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-8">
          <Heading>{section.heading}</Heading>
          {section.sub ? <p className="mt-4 text-[1.05rem] leading-[1.7] text-copy">{section.sub}</p> : null}

          <ul className="mt-8 border-t border-charcoal/12">
            {section.faqs.map((faq, index) => (
              <li key={faq.question} className="border-b border-charcoal/12">
                <details name={`faq-${section.id}`} open={index === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-[1.08rem] font-medium leading-snug text-charcoal sm:text-[1.2rem]">
                      {faq.question}
                    </h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-charcoal transition-colors group-open:bg-deep group-open:text-white">
                      <ChevronDown className="h-4.5 w-4.5 transition-transform duration-300 group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="pb-6 pr-12">
                    <Markdown tone="brand" className="max-w-[62ch] text-copy">
                      {faq.answer}
                    </Markdown>
                    {ANSWER_LINKS[faq.question] ? (
                      <LinkButton
                        href={ANSWER_LINKS[faq.question].href}
                        label={ANSWER_LINKS[faq.question].label}
                        className="mt-5"
                      />
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
          </ul>

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>
      </div>
    </Band>
  );
}
