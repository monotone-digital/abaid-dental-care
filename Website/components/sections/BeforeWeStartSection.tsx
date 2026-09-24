import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Markdown from "../Markdown";
import { CheckIcon, ExamineIcon, NextStepIcon, PriceTagIcon, ToothLogo } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, bodyColour, type Tone } from "./Shell";

/**
 * The three things the section promises, lifted word for word from its first sentence
 * ("You will know what is wrong, what it costs and what happens next, before anything is
 * done to your tooth"). The card only restates that sentence, so it is hidden from screen
 * readers, which read the sentence itself.
 */
const ITEMS = [
  { label: "What is wrong", Icon: ExamineIcon },
  { label: "What it costs", Icon: PriceTagIcon },
  { label: "What happens next", Icon: NextStepIcon },
];
const FOOT = "Before anything is done to your tooth.";

/** First visit, "You'll know before we start": the words beside a checklist card of what you'll know. */
export default function BeforeWeStartSection({
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
  return (
    // Clipped, so the wash and the tilted sheet behind the card never widen the page on a phone.
    <SectionShell id={section.id} tone={tone} className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>
          <Markdown className={`mt-6 ${bodyColour(tone)}`}>{section.body}</Markdown>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
        </div>

        {/* Beside the text, it fills its column (up to 36rem), so the gap to the words stays the grid gap. */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:mr-0 lg:max-w-xl">
          {/* A soft wash and a tilted mint sheet behind the card, so it reads as a note laid on the page. */}
          <div className="absolute -inset-10 bg-[radial-gradient(closest-side,var(--color-mint)_0%,transparent_100%)] opacity-70" />
          <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-panel bg-mint" />

          <div className="relative rounded-panel border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
            <div className="relative">
              {/* The line the three steps hang from. */}
              <span className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line" />
              <ol className="relative space-y-6">
                {ITEMS.map(({ label, Icon }, index) => (
                  <li key={label} className="relative flex items-center gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-teal-700 ring-4 ring-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[0.72rem] font-semibold tracking-[0.12em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="block font-display text-[1.05rem] font-semibold leading-snug text-ink">
                        {label}
                      </span>
                    </span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-7 flex items-center gap-3 rounded-card bg-mint-50 px-4 py-3.5 text-[0.92rem] font-medium leading-snug text-teal-800">
              <ToothLogo className="h-5 w-5 shrink-0" />
              {FOOT}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
