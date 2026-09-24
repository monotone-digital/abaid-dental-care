import Link from "next/link";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { ArrowUpRight } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";
import { iconMotion } from "../Buttons";

/** Large tappable blocks, so a parent reaches the child section without scrolling past pricing. */
export default function SignpostSection({
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
  if (!section.signpost.length) return null;

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="max-w-[46rem]">
        <Headline level={2} tone={tone}>
          {section.heading}
        </Headline>
        {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {section.signpost.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col justify-between gap-6 rounded-panel border border-line bg-white p-7 transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-ink/10 motion-safe:hover:-translate-y-1 sm:p-8"
            >
              <div>
                <h3 className="font-display text-[1.3rem] font-semibold leading-snug text-ink">
                  {item.lead}
                </h3>
                {item.rest ? (
                  <p className="mt-3 text-[1rem] leading-[1.7] text-body">{item.rest}</p>
                ) : null}
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mint text-teal-800 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <ArrowUpRight className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5`} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
    </SectionShell>
  );
}
