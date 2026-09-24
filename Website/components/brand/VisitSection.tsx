import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { ALT, treatment } from "@/lib/images";
import Markdown from "../Markdown";
import { ClockIcon, ExamineIcon, GelIcon, NextStepIcon } from "../Icons";
import { Actions, Band, Chip, Heading, Pill, paragraphs } from "./ui";

/**
 * One icon per paragraph, in the copy's order: the look and the X-ray, what can be done the
 * same day, the injection, and how many visits a root canal takes. Icons, not numbers, since
 * the paragraphs are not all steps in a sequence.
 */
const MARKS: ComponentType<SVGProps<SVGSVGElement>>[] = [ExamineIcon, ClockIcon, GelIcon, NextStepIcon];

/** The injection paragraph is what most people worry about, so its card is the one in Deep Teal. */
const EMPHASIS = 2;

/**
 * Home, "What happens when you come in", on the reference's full-width colour band (Care
 * Teal): the heading with the link opposite, then the photograph of Dr Abaid at work as a tall
 * card, and beside it the four paragraphs as a 2×2 grid of cards, verbatim and in order. Words
 * on the band are Charcoal (white on Care Teal is too faint to read); the one Deep Teal card
 * carries white. The eyebrow is the nav's own label for the page the link goes to.
 */
export default function VisitSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const parts = paragraphs(section.body);
  const photo = treatment();
  const eyebrow = section.link ? global.nav.find((n) => n.href === section.link?.href)?.title : null;

  return (
    <Band id={section.id} className="relative isolate overflow-hidden bg-care">
      {/* Soft rings in the corner, as the reference's band. */}
      <div
        aria-hidden="true"
        className="absolute -right-48 -top-48 -z-10 h-[46rem] w-[46rem] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_3.5rem,rgb(255_255_255/0.12)_3.5rem_calc(3.5rem_+_1px))]"
      />

      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="max-w-[40rem]">
          {eyebrow ? <Pill on="care">{eyebrow}</Pill> : null}
          <Heading className={eyebrow ? "mt-5" : ""}>{section.heading}</Heading>
        </div>
        <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" />
      </div>

      <div className="mt-10 grid gap-3 sm:gap-4 lg:grid-cols-12">
        {photo ? (
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-care-100 sm:aspect-16/10 lg:col-span-5 lg:aspect-auto lg:min-h-[32rem]">
            <Image
              src={photo}
              alt={ALT.treatment}
              fill
              sizes="(max-width: 1024px) 95vw, 36vw"
              className="object-cover object-[50%_42%]"
            />
            <Chip className="bottom-3 left-3 sm:bottom-4 sm:left-4">
              <span className="block text-[0.92rem] font-semibold leading-tight text-charcoal">{global.dentist}</span>
              <span className="mt-0.5 block text-[0.8rem] text-copy">{global.credentials}</span>
            </Chip>
          </div>
        ) : null}

        <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${photo ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {parts.map((part, index) => {
            const Icon = MARKS[index] ?? ExamineIcon;
            const dark = index === EMPHASIS;
            return (
              <li
                key={index}
                className={`flex flex-col rounded-3xl p-6 sm:p-7 ${dark ? "bg-deep text-white" : "bg-white text-copy"}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    dark ? "bg-white/12 text-care" : "bg-care-100 text-deep"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <Markdown tone="brand" className={`mt-6 text-pretty sm:mt-auto sm:pt-8 ${dark ? "text-white/90" : ""}`}>
                  {part}
                </Markdown>
              </li>
            );
          })}
        </ul>
      </div>
    </Band>
  );
}
