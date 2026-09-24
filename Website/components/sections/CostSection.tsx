import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Markdown from "../Markdown";
import { ToothLogo } from "../Icons";
import Actions from "./Actions";
import { Headline, SectionShell, bodyColour, type Tone } from "./Shell";
import TextSection from "./TextSection";

const PKR = /PKR \d{1,3}(?:,\d{3})*/;

/** "…is PKR 300. …Caps and bridges from PKR 5,000, root canal from PKR 7,000, …" -> the figures, verbatim. */
function read(body: string) {
  const [first = "", second = ""] = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const fee = PKR.exec(first)?.[0] ?? null;
  const caption = /^[^.]+\./.exec(second)?.[0] ?? "";
  const items = [...second.matchAll(/(?:^|[.,]\s*)([a-z][a-z ]*?)\s+(from PKR \d{1,3}(?:,\d{3})*)/gi)].map(
    ([, name, price]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), price }),
  );
  return { fee, caption, items };
}

/**
 * First visit, "What it costs": the words beside a receipt. The receipt only restates figures
 * from the body — the PKR 300 consultation and the starting prices, read from the copy so they
 * can never drift from it — so it is hidden from screen readers, which read the body. If the
 * figures can't be read, the section falls back to the ordinary text layout.
 */
export default function CostSection({
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
  const { fee, caption, items } = read(section.body);
  if (!fee || !items.length) {
    return (
      <TextSection section={section} page={page} global={global} tone={tone} isFirst={false} flip={false} />
    );
  }

  return (
    // Clipped, so the wash and the tilt of the receipt never widen the page on a phone.
    <SectionShell id={section.id} tone={tone} className="overflow-hidden">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <Headline level={2} tone={tone}>
            {section.heading}
          </Headline>
          <Markdown className={`mt-6 ${bodyColour(tone)}`}>{section.body}</Markdown>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} tone={tone} />
        </div>

        {/* Beside the text, it fills its column (up to 36rem). */}
        <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:order-first lg:ml-0 lg:max-w-xl">
          <div className="absolute -inset-10 bg-[radial-gradient(closest-side,var(--color-mint)_0%,transparent_100%)] opacity-70" />

          {/* Tilted a touch, with a torn bottom edge, so it reads as a receipt handed over. */}
          <div className="relative -rotate-2 drop-shadow-xl">
            <div className="overflow-hidden rounded-t-panel bg-white">
              <div className="bg-[linear-gradient(135deg,var(--color-teal-700),var(--color-teal-900))] px-7 pb-7 pt-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <ToothLogo className="h-6 w-6 text-accent-light" />
                  <span className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mint/80">
                    {global.clinic}
                  </span>
                </div>
                <p className="mt-7 font-display text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-accent-light">
                  Consultation and examination
                </p>
                <p className="mt-1.5 font-display text-[2.6rem] font-bold leading-none tracking-[-0.02em]">{fee}</p>
              </div>

              <div className="px-7 pb-6 pt-6">
                {caption ? (
                  <p className="font-display text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    {caption}
                  </p>
                ) : null}
                <ul className="mt-4 space-y-3">
                  {items.map(({ name, price }) => (
                    <li key={name} className="flex items-baseline gap-2 text-[0.92rem]">
                      <span className="font-medium text-ink">{name}</span>
                      <span className="min-w-4 flex-1 border-b-2 border-dotted border-line" />
                      <span className="whitespace-nowrap text-body">{price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="h-3 bg-[radial-gradient(circle_at_10px_100%,transparent_6px,white_6.5px)] bg-size-[20px_12px] bg-repeat-x" />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
