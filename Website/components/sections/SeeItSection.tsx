import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import Actions from "./Actions";
import { Headline, SectionShell, type Tone } from "./Shell";
import TextSection from "./TextSection";

/**
 * First visit, "You can see it yourself": two boxes side by side. The photograph fills the
 * wider left box, which takes its height from the white text card on the right, cropped to
 * the patient and the lower part of the screen he is watching. On a phone the photograph
 * sits above the card at its own ratio. Without the photograph, the ordinary layout is used.
 */
export default function SeeItSection({
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
  const photo = site("first-visit-screen");
  if (!photo) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-6 xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_27rem]">
        {/* The row's height is the card's; from lg up the photograph fills whatever that is. */}
        <div className="relative aspect-4/3 overflow-hidden rounded-panel bg-mint-100 sm:aspect-16/9 lg:aspect-auto">
          <Image
            src={photo}
            alt="A patient in the dental chair watching his tooth on the screen"
            fill
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover object-[50%_30%]"
          />
        </div>

        <div className="rounded-panel bg-white p-6 shadow-xl shadow-ink/10 sm:p-8">
          <Headline level={2} tone="light">
            {section.heading}
          </Headline>
          <Markdown className="mt-5 text-body">{section.body}</Markdown>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone="light" className="mt-7" />
        </div>
      </div>
    </SectionShell>
  );
}
