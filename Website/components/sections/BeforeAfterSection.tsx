import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { beforeAfter } from "@/lib/images";
import Markdown from "../Markdown";
import Actions from "./Actions";
import { Headline, SectionShell, Sub, type Tone } from "./Shell";

/** If the folder for this page holds no consented pair, the whole section is omitted. */
export default function BeforeAfterSection({
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
  const pairs = beforeAfter(page.slug);
  if (!pairs.length) return null;

  return (
    <SectionShell id={section.id} tone={tone}>
      <div className="max-w-[46rem]">
        <Headline level={2} tone={tone}>
          {section.heading}
        </Headline>
        {section.sub ? <Sub tone={tone}>{section.sub}</Sub> : null}
        <Markdown className="mt-6">{section.body}</Markdown>
      </div>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {pairs.map((pair) => (
          <li key={pair.id} className="rounded-panel border border-line bg-white p-4">
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["Before", pair.before, "text-muted"],
                  ["After", pair.after, "text-teal-700"],
                ] as const
              ).map(([label, src, colour]) => (
                <figure key={label}>
                  <div className="relative aspect-square overflow-hidden rounded-card bg-mint-100">
                    <Image
                      src={src}
                      alt={`${page.title} ${label.toLowerCase()}`}
                      fill
                      sizes="(max-width: 640px) 45vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption
                    className={`mt-2.5 text-center text-[0.78rem] font-semibold uppercase tracking-[0.1em] ${colour}`}
                  >
                    {label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
    </SectionShell>
  );
}
