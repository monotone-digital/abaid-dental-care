import Image from "next/image";
import Link from "next/link";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import { ArrowUpRight } from "../Icons";
import { TREATMENTS, parsePriceList as parse } from "../treatments";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";
import { iconMotion } from "../Buttons";

export default function TreatmentGrid({
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
  const rows = parse(section.body).filter((row) => TREATMENTS[row.name]);

  return (
    <SectionShell id={section.id} tone={tone}>
      {/* Heading on the left, the link to the full price list beside it. No width cap on the
          heading, so it runs on one line; where the two can't share a line, the link drops
          beneath the heading instead of squeezing it. */}
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
        <div>
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>
          {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
        </div>
        <Actions
          section={section}
          global={global}
          ctaLabel={page.ctaLabel}
          tone={tone}
          className="shrink-0"
        />
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => {
          const meta = TREATMENTS[row.name];
          const src = site(meta.image);
          const { Icon } = meta;

          return (
            <li key={row.name}>
              <Link
                href={meta.href}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-ink/10 motion-safe:hover:-translate-y-1"
              >
                {src ? (
                  <div className="relative aspect-5/2 overflow-hidden bg-mint-100">
                    <Image
                      src={src}
                      alt={meta.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                {/* Icon on the left, the name and price beside it, the arrow at the far end. */}
                <div className="flex flex-1 items-center gap-2 p-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint text-teal-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* One line: the name never wraps. */}
                    <h3 className="truncate font-display text-[0.82rem] font-semibold leading-snug text-ink 2xl:text-[0.88rem]">
                      {row.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[0.78rem] text-body">{row.price}</p>
                  </div>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <ArrowUpRight className={`h-3 w-3 ${iconMotion} motion-safe:group-hover:translate-x-px motion-safe:group-hover:-translate-y-px motion-safe:group-hover:scale-125`} />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
