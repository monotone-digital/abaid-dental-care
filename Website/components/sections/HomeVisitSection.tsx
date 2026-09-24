import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { ALT, treatment } from "@/lib/images";
import Markdown from "../Markdown";
import { ClockIcon, ExamineIcon, GelIcon, NextStepIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, bodyColour, type Tone } from "./Shell";
import TextSection from "./TextSection";

/**
 * One icon per paragraph, in the copy's order: the look and the X-ray, what can be done the
 * same day, the injection, and how many visits a root canal takes.
 */
const MARKS: ComponentType<SVGProps<SVGSVGElement>>[] = [ExamineIcon, ClockIcon, GelIcon, NextStepIcon];

const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** The icon disc's ring matches the band, so the line behind the discs appears to pass behind them. */
const RING: Record<Tone, string> = {
  light: "ring-white",
  mint: "ring-mint-50",
  cream: "ring-cream",
  dark: "ring-teal-900",
};

/**
 * Home, "What happens when you come in". The photograph of Dr Abaid at work sits beside the
 * heading and the first two paragraphs, on a line of markers; the last two paragraphs — the
 * injection, set on the teal wash because it is what most people worry about, and how long a
 * root canal takes — follow as two cards. Beside the text (lg) the cards run the full width
 * under the photograph, which keeps the photograph and the words beside it about the same
 * height; from 3xl (1680px), where the heading fits on one line and the photograph outgrows the
 * words beside it, the cards move up under the words and the photograph spans both rows.
 * Either way the two sides are centred on each other. The photograph is cropped to Dr Abaid and the patient (roughly 18% to 78% of
 * its height; any taller and the wall and the tray come back into view). Paragraphs render
 * verbatim and in order, and on a phone the photograph comes first. If the copy stops being
 * four paragraphs, or the photograph is missing, the ordinary layout is used.
 */
export default function HomeVisitSection({
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
  const photo = treatment();
  if (parts.length !== MARKS.length || !photo) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }
  const [InjectionMark, VisitsMark] = MARKS.slice(2);

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10 3xl:gap-y-8">
        <div className="lg:col-start-2 lg:row-start-1 lg:self-center">
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>

          <div className="relative mt-8">
            {/* The line the markers hang from. */}
            <span aria-hidden="true" className="absolute bottom-8 left-6 top-6 w-px bg-teal/30" />
            <ol className="relative space-y-6">
              {parts.slice(0, 2).map((part, index) => {
                const Mark = MARKS[index];
                return (
                  <li key={index} className="flex gap-5">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint text-teal-700 ring-8 ${RING[tone]}`}
                    >
                      <Mark className="h-5.5 w-5.5" />
                    </span>
                    <Markdown className={`pt-2.5 ${bodyColour(tone)}`}>{part}</Markdown>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2 lg:row-start-2 3xl:col-span-1 3xl:col-start-2">
          <div className="rounded-panel bg-[linear-gradient(135deg,var(--color-teal-600),var(--color-teal-900))] p-6 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-light ring-1 ring-white/15">
              <InjectionMark className="h-6 w-6" />
            </span>
            <Markdown tone="dark" className="mt-5 text-mint/90">
              {parts[2]}
            </Markdown>
          </div>
          <div className={`rounded-panel border border-line p-6 sm:p-7 ${tone === "light" ? "bg-mint-50" : "bg-white"}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-ink/5">
              <VisitsMark className="h-6 w-6" />
            </span>
            <Markdown className={`mt-5 ${bodyColour(tone)}`}>{parts[3]}</Markdown>
          </div>
        </div>

        <Actions
          section={section}
          global={global}
          ctaLabel={page.ctaLabel}
          tone={tone}
          className="lg:col-span-2 lg:row-start-3 3xl:col-span-1 3xl:col-start-2"
        />

        <div className="relative order-first aspect-5/4 self-center overflow-hidden rounded-panel bg-mint-100 lg:order-none lg:col-start-1 lg:row-start-1 3xl:row-span-2">
          <Image
            src={photo}
            alt={ALT.treatment}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-[50%_48%]"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-card bg-teal-900/90 px-5 py-3.5 backdrop-blur sm:inset-x-auto sm:left-4">
            <p className="font-display text-[0.98rem] font-semibold leading-tight text-white">
              {global.dentist}, {global.credentials}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
