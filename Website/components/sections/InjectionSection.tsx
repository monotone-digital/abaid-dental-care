import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import GradientBackdrop from "../GradientBackdrop";
import Markdown from "../Markdown";
import { GelIcon, SprayIcon } from "../Icons";
import Actions from "./Actions";
import { Headline } from "./Shell";

/**
 * "Anaesthetic gel or spray goes on the gum first": the two, as icons. The labels are the
 * copy's own words, and the body above says the same, so the pair is hidden from screen readers.
 */
const NUMBING = [
  { label: "Gel", Icon: GelIcon },
  { label: "Spray", Icon: SprayIcon },
];

/**
 * First visit, "Most people fear the injection": a split band. The words, with gel and spray
 * beneath them, on the dark teal wash; the photograph of gel going on the gum runs to the
 * edge of the page beside them (below them on a phone), fading into the wash where they meet.
 * The words keep the page gutter on the left, so they line up with every other section.
 */
export default function InjectionSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const photo = site("first-visit-gel");

  return (
    <section id={section.id} className="relative isolate scroll-mt-24 overflow-hidden bg-teal-900">
      <GradientBackdrop grainId={`${section.id}-grain`} />
      <div className={photo ? "lg:grid lg:grid-cols-2" : ""}>
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:py-24 lg:pl-14 lg:pr-16 xl:pl-[180px] xl:pr-20">
          <Headline level={2} tone="dark">
            {section.heading}
          </Headline>
          <Markdown tone="dark" className="mt-6 max-w-xl text-[1.05rem] text-mint/85">
            {section.body}
          </Markdown>

          <div aria-hidden="true" className="mt-9 flex flex-wrap items-center gap-3">
            {NUMBING.map(({ label, Icon }, index) => (
              <div key={label} className="flex items-center gap-3">
                {index > 0 ? (
                  <span className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-mint/60">
                    or
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 ring-1 ring-white/15">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-accent-light">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-mint">
                    {label}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone="dark" />
        </div>

        {photo ? (
          // Faded out by a mask, not an overlay, so it dissolves into the wash itself — from above
          // on a phone, from the left beside the words — with no seam where the two meet.
          <div className="relative aspect-16/10 [mask-image:linear-gradient(to_bottom,transparent,black_45%)] lg:aspect-auto lg:min-h-[30rem] lg:[mask-image:linear-gradient(to_right,transparent,black_45%)]">
            <Image
              src={photo}
              alt="Anaesthetic gel being put on the gum with a cotton bud"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
