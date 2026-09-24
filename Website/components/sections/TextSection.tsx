import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Markdown from "../Markdown";
import Actions from "./Actions";
import Visual, { hasVisual } from "./Visual";
import { Headline, SectionShell, Sub, bodyColour, type Tone } from "./Shell";

/** Pages whose hero headline carries the teal swash on more than its last word. */
const ACCENT_WORDS: Record<string, number> = { "first-visit": 2 };

export default function TextSection({
  section,
  page,
  global,
  tone,
  isFirst,
  flip,
}: {
  section: Section;
  page: Page;
  global: Global;
  tone: Tone;
  isFirst: boolean;
  flip: boolean;
}) {
  const showVisual = hasVisual(section, page.slug);
  // The exterior photograph is the section, not an illustration beside it: large, above the words.
  const stacked = section.visual === "exterior";
  // The treatment photograph takes its height from the text beside it (see Visual), so its
  // column stretches to the row and becomes the container its size is measured against.
  const matchText = section.visual === "treatment";

  const text = (
    <div className={showVisual && !stacked ? "" : "max-w-[68ch]"}>
      <Headline
        level={isFirst ? 1 : 2}
        tone={tone}
        accent={isFirst}
        accentWords={ACCENT_WORDS[page.slug] ?? 1}
      >
        {section.heading}
      </Headline>
      {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
      <Markdown tone={tone === "dark" ? "dark" : "light"} className={`mt-6 ${bodyColour(tone)}`}>
        {section.body}
      </Markdown>
      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
    </div>
  );

  return (
    <SectionShell id={section.id} tone={tone}>
      {showVisual && stacked ? (
        <div>
          <Visual
            section={section}
            pageTitle={page.title}
            pageSlug={page.slug}
            className="mb-10"
          />
          {text}
        </div>
      ) : showVisual ? (
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={flip ? "lg:order-2" : ""}>{text}</div>
          <div
            className={`${flip ? "lg:order-1" : ""} ${matchText ? "@container relative lg:self-stretch" : ""}`}
          >
            <Visual section={section} pageTitle={page.title} pageSlug={page.slug} />
          </div>
        </div>
      ) : (
        text
      )}
    </SectionShell>
  );
}
