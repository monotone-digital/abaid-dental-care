import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import { NextStepIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, bodyColour, type Tone } from "./Shell";
import TextSection from "./TextSection";

/** What "anything bigger" is, word for word from the third paragraph, for its card. */
const BIGGER = ["A root canal", "A tooth removal", "Preparing a tooth for a cap"];

const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** The number disc's ring matches the band, so the connecting line appears to pass behind it. */
const RING: Record<Tone, string> = {
  light: "ring-white",
  mint: "ring-mint-50",
  cream: "ring-cream",
  dark: "ring-teal-900",
};

/**
 * First visit, "What happens when you arrive": the three paragraphs are three steps in order,
 * so they run as a numbered sequence — the X-ray, the same-day filling, and a card for the
 * bigger treatments that get their own visit. Paragraphs render verbatim and in order. If the
 * copy stops being three paragraphs, or a photograph is missing, the ordinary layout is used.
 */
export default function ArriveSection({
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
  const xray = site("first-visit-xray");
  const filling = site("first-visit-filling");
  if (parts.length !== 3 || !xray || !filling) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }

  const frame = "relative aspect-4/3 overflow-hidden rounded-panel bg-mint-100";
  const visuals = [
    <div key="xray" className={frame}>
      <Image
        src={xray}
        alt="A dental X-ray of the back teeth on a screen"
        fill
        sizes="(max-width: 1024px) 100vw, 30vw"
        className="object-cover"
      />
    </div>,
    <div key="filling" className={frame}>
      <Image
        src={filling}
        alt="A white filling being placed in a back tooth"
        fill
        sizes="(max-width: 1024px) 100vw, 30vw"
        className="object-cover object-[50%_55%]"
      />
    </div>,
    <div
      key="bigger"
      aria-hidden="true"
      className={`${frame} flex flex-col justify-between bg-[linear-gradient(135deg,var(--color-teal-600),var(--color-teal-900))] p-6`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-light ring-1 ring-white/15">
        <NextStepIcon className="h-6 w-6" />
      </span>
      <span className="flex flex-wrap gap-2">
        {BIGGER.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-[0.85rem] font-medium text-white ring-1 ring-white/15"
          >
            {item}
          </span>
        ))}
      </span>
    </div>,
  ];

  return (
    <SectionShell id={section.id} tone={tone}>
      <Headline level={2} tone={tone}>
        {section.heading}
      </Headline>

      <div className="relative mt-12">
        {/* The line the three numbers sit on, from the first disc's centre to the last's: the
            third column starts at 2/3 of the row plus 4/3 of the 2rem gap, its disc centre
            1.25rem further in. */}
        <span
          aria-hidden="true"
          className="absolute left-5 right-[calc(33.333%_-_2.583rem)] top-5 hidden h-px bg-teal/35 lg:block"
        />
        <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
          {parts.map((part, index) => (
            <li key={index} className="flex flex-col">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 font-display text-[0.85rem] font-semibold text-white ring-8 ${RING[tone]}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mt-6">{visuals[index]}</div>
              <Markdown className={`mt-5 ${bodyColour(tone)}`}>{part}</Markdown>
            </li>
          ))}
        </ol>
      </div>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
    </SectionShell>
  );
}
