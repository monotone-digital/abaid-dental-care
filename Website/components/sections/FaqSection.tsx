import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Markdown from "../Markdown";
import { MinusIcon, PlusIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";

/**
 * Accordion. Native <details>, so it works with no JavaScript and every answer stays
 * in the HTML whether it is open or shut.
 */
export default function FaqSection({
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
  if (!section.faqs.length) return null;

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>
          {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
        </div>

        <ul className="space-y-3">
          {section.faqs.map((faq, index) => (
            <li key={faq.question}>
              <details
                name={`faq-${section.id}`}
                open={index === 0}
                className="group overflow-hidden rounded-card border border-line bg-white transition-colors open:border-accent/50 open:shadow-lg open:shadow-ink/5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-ink">
                    {faq.question}
                  </h3>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-teal-800 transition-colors group-open:bg-teal-600 group-open:text-white">
                    <PlusIcon className="h-4.5 w-4.5 group-open:hidden" />
                    <MinusIcon className="hidden h-4.5 w-4.5 group-open:block" />
                  </span>
                </summary>
                <div className="border-t border-line px-6 py-5 text-body">
                  <Markdown>{faq.answer}</Markdown>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
