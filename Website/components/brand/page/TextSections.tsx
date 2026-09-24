import Image from "next/image";
import Container from "../../Container";
import { Actions, paragraphs } from "../ui";
import type { SectionLayout } from "./layouts";
import { Band, IconWell, Intro, Photo, Prose, stepNumber, type Props, type Tone } from "./parts";
import { firstPair, picture } from "./pictures";

type Of<K extends SectionLayout["kind"]> = Extract<SectionLayout, { kind: K }>;

/** A card's ground, one step off the band it sits on. */
const cardGround = (tone: Tone) => (tone === "white" ? "bg-warm" : "bg-white");

/** A paragraph set large, as the reference's lead lines. */
const LEAD = "text-[1.25rem] leading-[1.5] tracking-[-0.01em] text-charcoal sm:text-[1.4rem] [&_p]:leading-[1.5]";

/* ------------------------------------------------------------------ split */

/** Heading and words beside a photograph. */
export function SplitSection({ section, page, global, layout }: Props & { layout: Of<"split"> }) {
  const tone = layout.tone ?? "warm";
  const photo = picture(layout.picture);
  const parts = paragraphs(section.body);
  const [first, ...rest] = parts;

  return (
    <Band id={section.id} tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className={`lg:col-span-6 ${layout.flip ? "lg:order-2" : ""}`}>
          <Intro section={section} tone={tone} />
          {layout.lead && first ? (
            <>
              <Prose tone={tone} className={`mt-6 ${LEAD}`}>
                {first}
              </Prose>
              {rest.length ? (
                <Prose tone={tone} className="mt-5">
                  {rest.join("\n\n")}
                </Prose>
              ) : null}
            </>
          ) : (
            <Prose tone={tone} className="mt-6">
              {section.body}
            </Prose>
          )}
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} onCare={tone === "care"} />
        </div>

        {photo ? (
          <div className={`lg:col-span-6 ${layout.tall ? "lg:self-stretch" : ""}`}>
            <Photo
              picture={photo}
              position={layout.position}
              className={layout.tall ? "aspect-4/5 sm:aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[30rem]" : "aspect-4/3"}
            />
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ cards */

/** The heading, then the section's paragraphs as a grid of cards, in their order. */
export function CardsSection({ section, page, global, layout }: Props & { layout: Of<"cards"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const leadCount = layout.lead ?? 0;
  const tailCount = layout.tail ?? 0;
  const lead = parts.slice(0, leadCount);
  const cards = parts.slice(leadCount, parts.length - tailCount);
  const tail = tailCount ? parts.slice(parts.length - tailCount) : [];
  const columns = layout.columns === 3 && cards.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  const actionsUpTop = !tail.length;

  return (
    <Band id={section.id} tone={tone}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="max-w-[44rem]">
          <Intro section={section} tone={tone} />
          {lead.length ? (
            <Prose tone={tone} className={`mt-5 ${LEAD}`}>
              {lead.join("\n\n")}
            </Prose>
          ) : null}
        </div>
        {actionsUpTop ? <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" onCare={tone === "care"} /> : null}
      </div>

      <ul className={`mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 ${columns}`}>
        {cards.map((part, index) => {
          const dark = layout.dark === index;
          const photo = picture(layout.pictures?.[index] ?? undefined);
          const icon = layout.icons?.[index];
          return (
            <li
              key={index}
              className={`flex flex-col rounded-3xl ${photo ? "p-3" : "p-6 sm:p-7"} ${
                dark ? "bg-deep" : cardGround(tone)
              } ${cards.length % 2 === 1 && index === cards.length - 1 && columns === "lg:grid-cols-2" ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              {photo ? (
                <Photo picture={photo} className="aspect-16/10 rounded-2xl" sizes="(max-width: 640px) 90vw, 30vw" />
              ) : icon ? (
                <IconWell icon={icon} tone={dark ? "deep" : "light"} />
              ) : null}
              <Prose
                tone={dark ? "deep" : tone}
                className={`${photo ? "px-3 pb-4 pt-5 sm:px-4" : icon ? "mt-6 sm:mt-auto sm:pt-10" : ""} ${
                  dark && !photo && !icon ? "my-auto text-[1.15rem] sm:text-[1.25rem]" : ""
                }`}
              >
                {part}
              </Prose>
            </li>
          );
        })}
      </ul>

      {tail.length ? (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-3xl border border-charcoal/10 p-6 sm:p-8">
          <Prose tone={tone} className={`max-w-[46rem] ${LEAD}`}>
            {tail.join("\n\n")}
          </Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" onCare={tone === "care"} />
        </div>
      ) : null}
    </Band>
  );
}

/* ------------------------------------------------------------------ steps */

/**
 * A sequence, numbered. "row": three cards across (on the Care Teal band, say). "column": a
 * vertical line of numbered steps beside a photograph that stays in view on wide screens.
 * The numbers are decorative (aria-hidden); the ordered list carries the order.
 */
export function StepsSection({ section, page, global, layout }: Props & { layout: Of<"steps"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const from = layout.from ?? 0;
  const before = parts.slice(0, from);
  const steps = parts.slice(from, from + layout.count);
  const notes = parts.slice(from + layout.count);
  const photo = picture(layout.picture);
  const ground = cardGround(tone);

  if (layout.direction === "row") {
    return (
      <Band id={section.id} tone={tone}>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Intro section={section} tone={tone} className="max-w-[40rem]" />
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" onCare={tone === "care"} />
        </div>
        {before.length ? <Prose tone={tone} className="mt-6 max-w-[46rem]">{before.join("\n\n")}</Prose> : null}

        <ol className="mt-10 grid gap-3 sm:gap-4 lg:grid-cols-3">
          {steps.map((part, index) => (
            <li key={index} className={`relative flex flex-col rounded-3xl p-6 sm:p-8 ${ground}`}>
              <span
                aria-hidden="true"
                className="text-[3rem] font-light leading-none tracking-[-0.05em] text-care sm:text-[3.6rem]"
              >
                {stepNumber(index)}
              </span>
              <Prose tone={tone} className="mt-8 text-[1.05rem] sm:mt-auto sm:pt-12">
                {part}
              </Prose>
            </li>
          ))}
        </ol>

        {notes.length ? (
          <Prose tone={tone} className={`mt-8 max-w-[46rem] ${tone === "care" ? "text-charcoal" : ""}`}>
            {notes.join("\n\n")}
          </Prose>
        ) : null}
      </Band>
    );
  }

  return (
    <Band id={section.id} tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Intro section={section} tone={tone} />
            {before.length ? <Prose tone={tone} className="mt-5">{before.join("\n\n")}</Prose> : null}
            {photo ? (
              <Photo
                picture={photo}
                position={layout.position}
                className="mt-8 aspect-4/3 lg:aspect-4/5"
                sizes="(max-width: 1024px) 95vw, 36vw"
              />
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol className="relative">
            {steps.map((part, index) => (
              <li key={index} className="relative flex gap-4 pb-3 last:pb-0 sm:gap-6 sm:pb-4">
                {/* The line between the numbers. */}
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-[1.375rem] top-12 w-px ${tone === "care" ? "bg-charcoal/20" : "bg-charcoal/12"}`}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-deep text-[0.85rem] font-semibold text-white"
                >
                  {stepNumber(index)}
                </span>
                <div className={`min-w-0 flex-1 rounded-3xl p-5 sm:p-7 ${ground}`}>
                  <Prose tone={tone} className="text-[1.05rem]">
                    {part}
                  </Prose>
                </div>
              </li>
            ))}
          </ol>

          {notes.length ? (
            <div className="mt-6 grid gap-3 sm:ml-[4.25rem] sm:gap-4">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className={`rounded-3xl border p-5 sm:p-6 ${
                    tone === "care" ? "border-charcoal/15 text-charcoal" : "border-charcoal/10"
                  }`}
                >
                  <Prose tone={tone} className={tone === "care" ? "text-charcoal" : ""}>
                    {note}
                  </Prose>
                </div>
              ))}
            </div>
          ) : null}

          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="mt-8 sm:ml-[4.25rem]" onCare={tone === "care"} />
        </div>
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ compare */

/**
 * Two options side by side, each labelled with words the copy already uses; any paragraph not
 * on a card follows as the conclusion, with the section's buttons.
 */
export function CompareSection({ section, page, global, layout }: Props & { layout: Of<"compare"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const used = new Set(layout.cards.flatMap((card) => card.paras));
  const rest = parts.filter((_, index) => !used.has(index));
  // Paragraphs before the first card's stay above the cards, so the reading order holds.
  const firstCard = Math.min(...layout.cards.flatMap((card) => card.paras));
  const intro = rest.filter((part) => parts.indexOf(part) < firstCard);
  const conclusion = rest.filter((part) => parts.indexOf(part) > firstCard);

  return (
    <Band id={section.id} tone={tone}>
      <div className="max-w-[44rem]">
        <Intro section={section} tone={tone} />
        {intro.length ? <Prose tone={tone} className="mt-5">{intro.join("\n\n")}</Prose> : null}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {layout.cards.map((card, index) => {
          const photo = picture(card.picture);
          const dark = !!card.dark;
          return (
            <article
              key={index}
              className={`flex flex-col rounded-3xl ${photo ? "p-3" : "p-6 sm:p-8"} ${dark ? "bg-deep" : cardGround(tone)}`}
            >
              {photo ? (
                <Photo
                  picture={photo}
                  position={card.position}
                  className="aspect-4/3 rounded-2xl"
                  sizes="(max-width: 640px) 95vw, 45vw"
                />
              ) : null}
              <div className={photo ? "px-3 pb-4 pt-6 sm:px-5 sm:pb-5" : ""}>
                {card.label ? (
                  <div className="flex items-center gap-4">
                    {card.icon ? <IconWell icon={card.icon} tone={dark ? "deep" : "light"} /> : null}
                    <h3
                      className={`text-[1.5rem] leading-tight tracking-[-0.02em] sm:text-[1.75rem] ${
                        dark ? "text-white" : "text-charcoal"
                      }`}
                    >
                      {card.label}
                    </h3>
                  </div>
                ) : null}
                <Prose tone={dark ? "deep" : tone} className={card.label ? "mt-5" : ""}>
                  {card.paras.map((i) => parts[i]).filter(Boolean).join("\n\n")}
                </Prose>
              </div>
            </article>
          );
        })}
      </div>

      {conclusion.length || section.cta || section.link ? (
        <div
          className={`mt-3 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-3xl p-6 sm:mt-4 sm:p-8 ${
            tone === "white" ? "bg-care-100" : "bg-care-100"
          }`}
        >
          {conclusion.length ? (
            <Prose className={`max-w-[48rem] ${LEAD}`}>{conclusion.join("\n\n")}</Prose>
          ) : null}
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" onCare={tone === "care"} />
        </div>
      ) : null}
    </Band>
  );
}

/* ------------------------------------------------------------------ answer */

/**
 * One paragraph carries the section — "No.", "One to two years, for most people." — so it is
 * set large; the others sit beside it as cards. With `lead: "last"` the conclusion comes last
 * in the reading order too, as a Care Teal card after the others.
 */
export function AnswerSection({ section, page, global, layout }: Props & { layout: Of<"answer"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const last = layout.lead === "last";
  const answer = last ? parts[parts.length - 1] : parts[0];
  const others = last ? parts.slice(0, -1) : parts.slice(1);
  const photo = picture(layout.picture);
  // A one-word answer ("No.") is set as a figure.
  const short = answer && answer.replace(/[^\w]/g, "").length <= 4;

  const answerBlock = answer ? (
    short ? (
      <p className="mt-8 text-[5.5rem] font-light leading-[0.9] tracking-[-0.06em] text-deep sm:text-[8rem]">{answer}</p>
    ) : (
      <Prose
        tone={tone}
        className="mt-7 text-[1.6rem] leading-[1.25] tracking-[-0.02em] text-charcoal sm:text-[2rem] [&_p]:leading-[1.25]"
      >
        {answer}
      </Prose>
    )
  ) : null;

  const cards = others.length ? (
    layout.plain ? (
      <Prose tone={tone} className={LEAD}>
        {others.join("\n\n")}
      </Prose>
    ) : (
      <ul className="grid gap-3 sm:gap-4">
        {others.map((part, index) => {
          const icon = layout.icons?.[index];
          return (
            <li key={index} className={`flex gap-5 rounded-3xl p-6 sm:p-7 ${tone === "panel" ? "bg-white/75" : cardGround(tone)}`}>
              {icon ? <IconWell icon={icon} /> : null}
              <Prose tone={tone} className={icon ? "pt-2" : ""}>
                {part}
              </Prose>
            </li>
          );
        })}
      </ul>
    )
  ) : null;

  if (last) {
    return (
      <Band id={section.id} tone={tone}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Intro section={section} tone={tone} />
            <div className="mt-8">{cards}</div>
          </div>
          {answer ? (
            <div className="flex flex-col justify-end rounded-3xl bg-care p-7 sm:p-10 lg:col-span-5">
              <Prose className="text-[1.8rem] leading-[1.2] tracking-[-0.02em] text-charcoal sm:text-[2.3rem] [&_p]:leading-[1.2]">
                {answer}
              </Prose>
              <Actions section={section} global={global} ctaLabel={page.ctaLabel} onCare />
            </div>
          ) : null}
        </div>
      </Band>
    );
  }

  return (
    <Band id={section.id} tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-6">
          <Intro section={section} tone={tone} />
          {answerBlock}
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="mt-9" onCare={tone === "care"} />
        </div>
        <div className="grid gap-4 lg:col-span-6">
          {photo ? <Photo picture={photo} position={layout.position} className="aspect-16/10" /> : null}
          {cards}
        </div>
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ stages */

/** "PKR 10,000", "30 to 40 per cent", "PKR 5,000 a month": the figure in a payment line. */
const STAGE_FIGURE = /PKR [\d,]+(?: a month)?|\d+ to \d+ per cent/;

/**
 * A payment timeline: each stage is one of the copy's own paragraphs, with its figure repeated
 * large above it (aria-hidden, since the paragraph says it). The rest follow as notes.
 */
export function StagesSection({ section, page, global, layout }: Props & { layout: Of<"stages"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const steps = layout.steps.map((i) => parts[i]).filter(Boolean);
  const notes = parts.filter((_, i) => !layout.steps.includes(i));

  return (
    <Band id={section.id} tone={tone}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <Intro section={section} tone={tone} className="max-w-[40rem]" />
      </div>

      <ol className="mt-10 grid gap-3 sm:gap-4 lg:grid-cols-3">
        {steps.map((part, index) => {
          const figure = STAGE_FIGURE.exec(part)?.[0];
          return (
            <li
              key={index}
              className={`relative flex flex-col rounded-3xl p-6 sm:p-8 ${index === 0 ? "bg-deep" : cardGround(tone)}`}
            >
              <span
                aria-hidden="true"
                className={`text-[0.8rem] font-semibold uppercase tracking-[0.14em] ${index === 0 ? "text-care" : "text-deep"}`}
              >
                {stepNumber(index)}
              </span>
              {figure ? (
                <span
                  aria-hidden="true"
                  className={`mt-6 block text-[2.2rem] font-light leading-none tracking-[-0.04em] sm:text-[2.6rem] ${
                    index === 0 ? "text-white" : "text-charcoal"
                  }`}
                >
                  {figure}
                </span>
              ) : null}
              <Prose tone={index === 0 ? "deep" : tone} className="mt-5 sm:mt-auto sm:pt-8">
                {part}
              </Prose>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-x-12 gap-y-6">
        {notes.length ? <Prose tone={tone} className={`max-w-[44rem] ${LEAD}`}>{notes.join("\n\n")}</Prose> : null}
        <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" onCare={tone === "care"} />
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ checklist */

/**
 * Tooth removal's aftercare, "the most important section on this page": every instruction on
 * its own line, large enough to read at arm's length, never collapsed. The photograph stays in
 * view beside the list on wide screens.
 */
export function ChecklistSection({ section, page, global, layout }: Props & { layout: Of<"checklist"> }) {
  const tone = layout.tone ?? "warm";
  const parts = paragraphs(section.body);
  const photo = picture(layout.picture);

  return (
    <Band id={section.id} tone={tone}>
      <Intro section={section} tone={tone} className="max-w-[46rem]" size="large" />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <ol className="grid gap-3 lg:col-span-7">
          {parts.map((part, index) => (
            <li key={index} className={`flex items-start gap-5 rounded-3xl p-5 sm:gap-7 sm:p-7 ${cardGround(tone)}`}>
              <span
                aria-hidden="true"
                className="w-10 shrink-0 text-[2.2rem] font-light leading-none tracking-[-0.05em] text-care sm:w-14 sm:text-[2.8rem]"
              >
                {stepNumber(index)}
              </span>
              <Prose tone={tone} className="pt-1 text-[1.2rem] leading-[1.55] sm:text-[1.35rem] [&_p]:leading-[1.55]">
                {part}
              </Prose>
            </li>
          ))}
        </ol>

        {photo ? (
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Photo
                picture={photo}
                position={layout.position}
                className="aspect-4/3 lg:aspect-4/5"
                sizes="(max-width: 1024px) 95vw, 36vw"
              />
            </div>
          </div>
        ) : null}
      </div>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} onCare={tone === "care"} />
    </Band>
  );
}

/* ------------------------------------------------------------------ feature */

/**
 * The Deep Teal band: the words on the left in white, a photograph filling the right half to
 * the page edge on wide screens (below the words on a phone). Used where the copy answers the
 * fear of the injection.
 */
export function FeatureSection({ section, page, global, layout }: Props & { layout: Of<"feature"> }) {
  const photo = picture(layout.picture);

  return (
    <section id={section.id || undefined} className="relative isolate scroll-mt-24 overflow-hidden bg-deep">
      <div
        aria-hidden="true"
        className="absolute -left-56 -top-56 -z-10 h-[40rem] w-[40rem] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_3.5rem,rgb(255_255_255/0.07)_3.5rem_calc(3.5rem_+_1px))]"
      />
      <Container className="py-16 lg:py-28">
        <div className="lg:w-[48%] lg:pr-10">
          <Intro section={section} tone="deep" size="large" />
          <Prose tone="deep" className="mt-7 text-[1.15rem] sm:text-[1.25rem]">
            {section.body}
          </Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} onDark />
        </div>
      </Container>
      {photo ? (
        <div className="relative mx-5 mb-5 aspect-4/3 overflow-hidden rounded-3xl sm:mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:aspect-auto lg:w-[46%] lg:rounded-none lg:rounded-l-[2.5rem]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 95vw, 46vw"
            className="object-cover"
            style={{ objectPosition: layout.position ?? "center" }}
          />
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ pair */

/** A consented before/after pair, captioned "Before" and "After". */
export function PairFigure({ slug, title, className = "" }: { slug: string; title: string; className?: string }) {
  const pair = firstPair(slug);
  if (!pair) return null;
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {(
        [
          ["Before", pair.before],
          ["After", pair.after],
        ] as const
      ).map(([label, src]) => (
        <figure key={label} className="rounded-3xl bg-white p-2.5">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-care-100">
            <Image src={src} alt={`${title} ${label.toLowerCase()}`} fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-cover" />
          </div>
          <figcaption
            className={`px-2 pb-1 pt-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] ${
              label === "After" ? "text-deep" : "text-hint"
            }`}
          >
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** The words beside the page's first consented before/after pair; words alone if there is none. */
export function PairSection({ section, page, global, layout }: Props & { layout: Of<"pair"> }) {
  const tone = layout.tone ?? "warm";
  const hasPair = !!firstPair(page.slug);

  return (
    <Band id={section.id} tone={tone}>
      <div className={`grid gap-10 lg:items-center lg:gap-14 ${hasPair ? "lg:grid-cols-12" : ""}`}>
        <div className={hasPair ? "lg:col-span-6" : "max-w-[46rem]"}>
          <Intro section={section} tone={tone} />
          <Prose tone={tone} className="mt-6">
            {section.body}
          </Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} onCare={tone === "care"} />
        </div>
        {hasPair ? (
          <PairFigure
            slug={page.slug}
            title={page.title}
            className={`lg:col-span-6 ${tone === "white" ? "[&_figure]:bg-warm" : ""}`}
          />
        ) : null}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ cost */

/** "Braces from PKR 100,000." -> the words either side of the figure, and the figure. */
const pieces = (sentence: string) => /^(.*?)(PKR [\d,]+)(.*)$/.exec(sentence);

/**
 * "What it costs", as the reference's closing panel: the @sub is the figure itself, set large
 * (it is the approved line, so it is read as it stands), with the body and buttons. A minimal
 * 3D picture of the treatment, from Home's treatment list, sits in the panel as decoration;
 * without one, the figures take the right-hand side themselves.
 */
export function CostSection({ section, page, global, layout }: Props & { layout: Of<"cost"> }) {
  const art = picture(layout.render ? `render:${layout.render}` : undefined);
  const lines = section.sub ? section.sub.split(/(?<=\.)\s+/) : [];

  const figures = lines.length ? (
    <p className="grid gap-4 text-charcoal">
      {lines.map((line) => {
        const bits = pieces(line);
        return bits ? (
          <span key={line} className="block">
            {/* The words either side stay in the text, so it reads as the approved line. */}
            {bits[1] ? <span className="block text-[1.05rem] font-semibold">{bits[1]}</span> : null}
            <span className="block text-[3rem] font-light leading-none tracking-[-0.045em] sm:text-[4.2rem]">
              {bits[2]}
              <span className="text-coral">{bits[3]}</span>
            </span>
          </span>
        ) : (
          <span key={line} className="block text-[1.4rem]">
            {line}
          </span>
        );
      })}
    </p>
  ) : null;

  const heading = (
    <h2 className="text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-charcoal sm:text-[2.5rem] xl:text-[2.85rem]">
      {section.heading}
    </h2>
  );

  if (!art) {
    return (
      <Band id={section.id} tone="panel">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            {heading}
            <div className="mt-7 lg:hidden">{figures}</div>
            <Prose className="mt-7 max-w-[40rem] text-[1.05rem]">{section.body}</Prose>
            <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
          </div>
          {/* One copy per breakpoint (display: none hides the other from screen readers too). */}
          <div className="hidden rounded-3xl bg-white/70 p-8 lg:col-span-6 lg:block xl:p-10">
            {figures}
          </div>
        </div>
      </Band>
    );
  }

  return (
    <Band id={section.id} tone="panel">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-7">
          {heading}
          <div className="mt-7">{figures}</div>
          <Prose className="mt-8 max-w-[40rem] text-[1.05rem]">{section.body}</Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>
        <div className="relative hidden aspect-square overflow-hidden rounded-3xl bg-warm sm:block lg:col-span-5">
          <Image src={art.src} alt="" fill sizes="(max-width: 1024px) 60vw, 34vw" className="object-cover object-[70%_center]" />
        </div>
      </div>
    </Band>
  );
}
