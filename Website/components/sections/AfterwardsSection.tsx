import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Markdown from "../Markdown";
import { ArrowUpRight, CapsuleIcon, ExtractionIcon, TabletIcon } from "../Icons";
import { iconMotion } from "../Buttons";
import { Headline, SectionShell, bodyColour, type Tone } from "./Shell";

/**
 * "You are given antibiotics and painkillers": the two, as tiles. The body says the same,
 * so the tiles are hidden from screen readers.
 */
const GIVEN: { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { label: "Antibiotics", Icon: CapsuleIcon },
  { label: "Painkillers", Icon: TabletIcon },
];
/** Lifted from the body, as the aftercare tile's eyebrow. */
const REMOVAL = "If a tooth has been taken out";

/**
 * First visit, "What happens afterwards": heading and words side by side, then a grid of
 * tiles — a photograph, what you are given, and the aftercare link as the largest target.
 */
export default function AfterwardsSection({
  section,
  tone,
}: {
  section: Section;
  page: Page;
  global: Global;
  tone: Tone;
}) {
  const photo = site("first-visit-aftercare");
  const tile = tone === "light" ? "bg-mint-50" : "bg-white";

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <Headline level={2} tone={tone}>
          {section.heading}
        </Headline>
        <Markdown className={`${bodyColour(tone)} lg:pt-2`}>{section.body}</Markdown>
      </div>

      {/* lg: the photograph fills the left half across two rows; the two tiles, then the link, fill the right. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {photo ? (
          <div className="relative aspect-16/10 overflow-hidden rounded-panel bg-mint-100 sm:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[19rem]">
            <Image
              src={photo}
              alt="Blister packs of tablets and capsules beside a glass of water"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {GIVEN.map(({ label, Icon }) => (
          <div
            key={label}
            aria-hidden="true"
            className={`flex flex-col justify-between gap-8 rounded-panel border border-line p-6 ${tile}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-ink/5">
              <Icon className="h-6 w-6" />
            </span>
            <span className="font-display text-[1.15rem] font-semibold text-ink">{label}</span>
          </div>
        ))}

        {section.link ? (
          <Link
            href={section.link.href}
            className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-panel bg-[linear-gradient(135deg,var(--color-teal-600),var(--color-teal-800))] p-6 text-white transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/20 sm:col-span-2 lg:p-7"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-accent-light ring-1 ring-white/15">
                <ExtractionIcon className="h-6 w-6" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-700 transition-colors group-hover:bg-accent-light group-hover:text-ink">
                <ArrowUpRight
                  className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5`}
                />
              </span>
            </span>
            <span>
              <span aria-hidden="true" className="block text-[0.9rem] text-mint/85">
                {REMOVAL}
              </span>
              <span className="mt-1 block font-display text-[1.3rem] font-semibold leading-snug">
                {section.link.label}
              </span>
            </span>
          </Link>
        ) : null}
      </div>
    </SectionShell>
  );
}
