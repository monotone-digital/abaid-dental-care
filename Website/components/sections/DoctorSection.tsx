import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { ALT, portrait } from "@/lib/images";
import GradientBackdrop from "../GradientBackdrop";
import Markdown from "../Markdown";
import Actions from "./Actions";
import { Headline, SectionShell } from "./Shell";

/**
 * The two figures in the doctor band. They restate approved facts ("six years", "around
 * 3,000 patients"); the "+" framing is the client's call. They replace the section's @sub,
 * which is deliberately not rendered here.
 */
const STATS = [
  { value: "6+", label: "Years of experience" },
  { value: "3,000+", label: "Patients treated" },
];

/** The doctor band: portrait on one side, what he does and how he works on the other. */
export default function DoctorSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const face = portrait();

  return (
    <SectionShell id={section.id} tone="dark" className="relative isolate overflow-hidden">
      <GradientBackdrop grainId="dr-abaid-grain" />
      {/* Narrower than the page gutter, and the portrait stretches to the height of the text. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16 lg:px-8 xl:px-12">
        {face ? (
          <div className="relative mx-auto aspect-4/5 w-full max-w-[19rem] overflow-hidden rounded-panel bg-teal-800 lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
            <Image
              src={face}
              alt={ALT.portrait}
              fill
              sizes="(max-width: 1024px) 19rem, 24vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-card bg-teal-900/90 px-5 py-4 backdrop-blur">
              <p className="font-display text-[1.05rem] font-semibold leading-tight text-white">
                {global.dentist}
              </p>
              <p className="mt-1 text-[0.82rem] text-teal">{global.credentials}</p>
            </div>
          </div>
        ) : null}

        <div>
          <Headline level={2} tone="dark">
            {section.heading}
          </Headline>

          <Markdown tone="dark" className="mt-6 text-mint/85">
            {section.body}
          </Markdown>

          <ul className="mt-8 grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <li key={stat.label} className="rounded-card bg-mint px-5 py-5 sm:px-6">
                <p className="font-display text-[1.9rem] font-bold leading-none tracking-[-0.02em] text-teal-900 sm:text-[2.6rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.88rem] font-medium leading-snug text-teal-800 sm:text-[0.95rem]">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone="dark" />
        </div>
      </div>
    </SectionShell>
  );
}
