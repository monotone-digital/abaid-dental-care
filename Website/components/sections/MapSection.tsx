import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { resolved } from "@/lib/global";
import Markdown from "../Markdown";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";

/**
 * Address, hours and the map. The embed only renders once a real Google Maps URL is in
 * _global.md — there is no placeholder box standing in for it.
 */
export default function MapSection({
  section,
  page,
  global,
  tone,
  isFirst,
}: {
  section: Section;
  page: Page;
  global: Global;
  tone: Tone;
  isFirst: boolean;
}) {
  const embed = resolved(global.maps.embed);

  const text = (
    <div>
      <Headline level={isFirst ? 1 : 2} tone={tone} accent={isFirst}>
        {section.heading}
      </Headline>
      {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
      <Markdown tone={tone === "dark" ? "dark" : "light"} className="mt-6">
        {section.body}
      </Markdown>
      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
    </div>
  );

  return (
    <SectionShell id={section.id} tone={tone}>
      {embed ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {text}
          <div className="overflow-hidden rounded-panel border border-line bg-mint-100">
            <iframe
              src={embed}
              title={`${global.clinic} on the map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[24rem] w-full border-0 lg:h-full lg:min-h-[28rem]"
            />
          </div>
        </div>
      ) : (
        text
      )}
    </SectionShell>
  );
}
