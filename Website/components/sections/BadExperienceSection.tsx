import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Markdown from "../Markdown";
import { ChatIcon, ClockIcon } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, type Tone } from "./Shell";
import TextSection from "./TextSection";

const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/**
 * First visit, "If last time was bad": one enclosed panel. The first line leads under the
 * heading; the two ways the visit changes — a slower pace, or consultation and examination
 * only, with its fee — sit side by side as cards beneath; the buttons close it. The
 * paragraphs render verbatim and in their order. If the copy ever stops being those four
 * paragraphs, the section falls back to the ordinary text layout rather than guessing.
 */
export default function BadExperienceSection({
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
  if (parts.length !== 4) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }
  const [lead, slower, consultOnly, fee] = parts;

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="relative overflow-hidden rounded-hero border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-10 lg:p-14">
        {/* A soft mint wash in the top corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 bg-[radial-gradient(closest-side,var(--color-mint),transparent)]"
        />

        <div className="relative max-w-3xl">
          <Headline level={2} tone="light">
            {section.heading}
          </Headline>
          <Markdown className="mt-5 font-display text-[1.2rem] font-medium leading-snug text-teal-800 sm:text-[1.35rem]">
            {lead}
          </Markdown>
        </div>

        <div className="relative mt-10 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-card bg-mint-50 p-5 sm:gap-5 sm:p-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-ink/5">
              <ClockIcon className="h-5.5 w-5.5" />
            </span>
            <Markdown className="pt-2 text-body">{slower}</Markdown>
          </div>

          <div className="flex gap-4 rounded-card bg-mint-50 p-5 sm:gap-5 sm:p-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-ink/5">
              <ChatIcon className="h-5.5 w-5.5" />
            </span>
            <div className="min-w-0 pt-2">
              <Markdown className="text-body">{consultOnly}</Markdown>
              <Markdown className="mt-5 w-fit rounded-full bg-teal-700 px-4 py-2 text-[0.9rem] font-semibold leading-snug text-white">
                {fee}
              </Markdown>
            </div>
          </div>
        </div>

        <div className="relative mt-10 border-t border-line pt-8">
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone="light" className="" />
        </div>
      </div>
    </SectionShell>
  );
}
