import Image from "next/image";
import Link from "next/link";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { beforeAfter, portrait } from "@/lib/images";
import Container from "../../Container";
import Markdown from "../../Markdown";
import TodaysHours from "../../TodaysHours";
import { ClockIcon } from "../../Icons";
import { TREATMENTS } from "../../treatments";
import { Actions, Mark, Notch, Pill, paragraphs } from "../ui";
import { FIGURES } from "../DoctorSection";
import type { SectionLayout } from "./layouts";
import { Band, IconWell, Intro, Photo, Prose, type IconKey, type Props } from "./parts";
import { picture } from "./pictures";
import { PairCard } from "./TextSections";

type Of<K extends SectionLayout["kind"]> = Extract<SectionLayout, { kind: K }>;

const PKR = /PKR [\d,]+/;

/** Today's hours, live, with a clock: the same component Home's hero uses. */
function Today({ global, className = "" }: { global: Global; className?: string }) {
  return (
    <p className={`flex items-start gap-3 text-[1rem] leading-snug text-charcoal ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-deep">
        <ClockIcon className="h-4.5 w-4.5" />
      </span>
      <span className="pt-2">
        <TodaysHours
          week={global.hours.week}
          todayLabel={global.hours.todayLabel}
          fallback={global.hours.fallback}
          timezone={global.hours.timezone}
        />
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------ first visit: see it */

/**
 * "You can see it yourself", after the reference's closing panel (third design, 24 Sep 2026;
 * Uzair asked for it again, and for its WhatsApp button to go, removed from the content): a
 * Care Teal tint inset from the page, the words on the left, and on the right the photograph
 * of a patient watching his own tooth on the screen while the camera is in his mouth (Uzair's
 * brief, 25 Sep 2026: a young man in western clothes), running to the panel's edges. A small
 * white card floats over it, as the reference's do: Dr Abaid's name and credentials, hidden from
 * screen readers because it restates the page. A second card, the tooth from the screen
 * (`layout.screen`), shows only if a layout names one; Uzair had it taken off First Visit on
 * 25 Sep 2026. The second paragraph, the point of the section, is set large under the first.
 */
export function ScreenSection({ section, page, global, layout }: Props & { layout: Of<"screen"> }) {
  const photo = picture(layout.picture);
  const screen = picture(layout.screen);
  const face = portrait();
  const [first, ...rest] = paragraphs(section.body);
  // "…the camera puts your own tooth on the screen…": the small card's label, in those words.
  const found = first ? /your own tooth/i.exec(first)?.[0] : null;
  const label = found ? found.charAt(0).toUpperCase() + found.slice(1) : null;

  return (
    <section id={section.id || undefined} className="scroll-mt-24">
      <Container className="py-16 lg:py-24">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-care-100 lg:grid lg:min-h-[36rem] lg:grid-cols-12">
          {/* Soft rings in the corner behind the words, as the reference's panels. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-64 -left-64 -z-10 h-[36rem] w-[36rem] rounded-full bg-[repeating-radial-gradient(circle,transparent_0_3.5rem,rgb(255_255_255/0.6)_3.5rem_calc(3.5rem_+_1px))]"
          />

          <div className="px-6 pb-16 pt-10 sm:px-10 sm:py-12 lg:col-span-6 lg:self-center lg:py-16 lg:pl-14 lg:pr-12">
            <Intro section={section} size="large" />
            {first ? <Prose className="mt-6 max-w-[32rem] text-[1.05rem]">{first}</Prose> : null}
            {rest.length ? (
              <Prose className="mt-8 max-w-[28rem] border-t border-charcoal/12 pt-8 text-[1.5rem] leading-[1.3] tracking-[-0.015em] text-charcoal sm:text-[1.75rem] [&_p]:leading-[1.3]">
                {rest.join("\n\n")}
              </Prose>
            ) : null}
            <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
          </div>

          {photo ? (
            <div className="relative lg:col-span-6">
              <div className="relative aspect-4/3 overflow-hidden rounded-t-[1.5rem] sm:aspect-16/10 lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none lg:rounded-l-[2rem]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 95vw, 45vw"
                  className="object-cover"
                  style={{ objectPosition: layout.position ?? "center" }}
                />
              </div>

              {/* The tooth from the screen. On a phone it sits across the photograph's top edge; wider,
                  at the bottom left, so it never covers the patient's face. */}
              {screen ? (
                <div
                  aria-hidden="true"
                  className="absolute -top-11 left-5 w-28 rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(35_31_32/0.45)] sm:bottom-6 sm:left-6 sm:top-auto sm:w-40 sm:p-2 lg:-left-8 lg:bottom-10 lg:w-52"
                >
                  <div className="relative aspect-6/5 overflow-hidden rounded-xl bg-charcoal">
                    <Image src={screen.src} alt="" fill sizes="13rem" className="object-cover" />
                    <span className="absolute right-2 top-2 flex h-2 w-2">
                      <span className="absolute inset-0 rounded-full bg-care motion-safe:animate-ping" />
                      <span className="relative h-2 w-2 rounded-full bg-care" />
                    </span>
                  </div>
                  {label ? (
                    <p className="px-1.5 pb-1 pt-2 text-[0.78rem] font-semibold leading-tight text-charcoal sm:text-[0.85rem]">
                      {label}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {face ? (
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 hidden items-center gap-3 rounded-2xl bg-white/92 py-2 pl-2 pr-4 shadow-[0_18px_40px_-18px_rgb(35_31_32/0.35)] backdrop-blur sm:flex lg:bottom-8 lg:right-8"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full bg-care-100">
                    <Image src={face} alt="" fill sizes="40px" className="object-cover object-[50%_20%]" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.88rem] font-semibold text-charcoal">{global.dentist}</span>
                    <span className="block text-[0.78rem] text-copy">{global.credentials}</span>
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ first visit: cost */

/** "…is PKR 300. …Caps and bridges from PKR 5,000, root canal from PKR 7,000, …" -> the figures, verbatim. */
function readReceipt(body: string) {
  const [first = "", second = ""] = paragraphs(body);
  const fee = PKR.exec(first)?.[0] ?? null;
  const caption = /^[^.]+\./.exec(second)?.[0] ?? "";
  const items = [...second.matchAll(/(?:^|[.,]\s*)([a-z][a-z ]*?)\s+(from PKR \d{1,3}(?:,\d{3})*)/gi)].map(
    ([, name, price]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), price }),
  );
  return { fee, caption, items };
}

/**
 * First visit, "What it costs": the words beside a receipt. The receipt only restates figures
 * read from the body, so it is hidden from screen readers, which read the body.
 */
export function ReceiptSection({ section, page, global }: Props) {
  const { fee, caption, items } = readReceipt(section.body);

  return (
    <Band id={section.id}>
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-6">
          <Intro section={section} />
          <Prose className="mt-6">{section.body}</Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>

        {fee && items.length ? (
          <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
            <div className="relative -rotate-2 drop-shadow-[0_24px_40px_rgb(35_31_32/0.18)]">
              <div className="overflow-hidden rounded-t-3xl bg-white">
                <div className="bg-deep px-7 pb-7 pt-6 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <Mark white className="h-6 w-6" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-care-100">
                      {global.clinic}
                    </span>
                  </div>
                  <p className="mt-8 text-[0.95rem] text-white/80">Consultation and examination</p>
                  <p className="mt-1 text-[3rem] font-light leading-none tracking-[-0.04em]">{fee}</p>
                </div>
                <div className="px-7 pb-7 pt-6">
                  {caption ? <p className="text-[0.85rem] font-semibold text-hint">{caption}</p> : null}
                  <ul className="mt-4 space-y-3.5">
                    {items.map(({ name, price }) => (
                      <li key={name} className="flex items-baseline gap-2 text-[0.95rem]">
                        <span className="font-medium text-charcoal">{name}</span>
                        <span className="min-w-4 flex-1 border-b-2 border-dotted border-charcoal/15" />
                        <span className="whitespace-nowrap text-copy">{price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="h-3 bg-[radial-gradient(circle_at_10px_100%,transparent_6px,white_6.5px)] bg-size-[20px_12px] bg-repeat-x" />
            </div>
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ treatments: the prices */

type Block = { kind: "label" | "table" | "text"; text: string };

/** The prices body, in its blocks: a bold label line, a table, or a paragraph. */
function blocks(body: string): Block[] {
  return paragraphs(body).map((text) => {
    if (/^\*\*[^*]+\*\*$/.test(text)) return { kind: "label", text: text.slice(2, -2) };
    if (text.startsWith("|")) return { kind: "table", text };
    return { kind: "text", text };
  });
}

/** Body rows of a markdown table, each cell trimmed. The separator and header rows are dropped. */
function tableRows(table: string) {
  const lines = table.split("\n").filter((line) => line.trim().startsWith("|"));
  return lines
    .slice(2)
    .map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
}

const headerRow = (table: string) =>
  table
    .split("\n")[0]
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

const unbold = (cell: string) => cell.replace(/^\*\*(.*)\*\*$/, "$1");

/** "**[Fillings](/fillings)**" -> { name: "Fillings", href: "/fillings" }. */
const linkCell = (cell: string) => {
  const match = /\[([^\]]+)\]\(([^)]+)\)/.exec(cell);
  return match ? { name: match[1], href: match[2] } : { name: unbold(cell), href: null };
};

/**
 * Treatments, "The prices": the consultation on its own, in Deep Teal (a flat fee, visually
 * separate: the content note), then every treatment as a real table in the copy's order, each
 * name linking to its page. On a phone each row becomes a stacked card, so nothing scrolls
 * sideways. Falls back to the plain markdown if the body is not in the expected shape.
 */
export function PricesSection({ section, page, global }: Props) {
  const parts = blocks(section.body);
  const tables = parts.filter((b) => b.kind === "table");
  const labels = parts.filter((b) => b.kind === "label");
  const note = parts.find((b) => b.kind === "text");

  if (tables.length !== 2 || labels.length !== 2) {
    return (
      <Band id={section.id} tone="white">
        <Intro section={section} />
        <Prose className="mt-8">{section.body}</Prose>
      </Band>
    );
  }

  const [consultation] = tableRows(tables[0].text);
  const header = headerRow(tables[1].text);
  const rows = tableRows(tables[1].text);

  return (
    <Band id={section.id} tone="white">
      <Intro section={section} />

      <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-5">
        <div className="flex flex-col rounded-3xl bg-deep p-7 text-white sm:p-9 lg:col-span-4">
          <h3 className="text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-care-100">{labels[0].text}</h3>
          {consultation ? (
            <table className="mt-8 w-full text-left">
              <tbody>
                <tr>
                  <th scope="row" className="block pb-2 text-[1.2rem] font-medium leading-snug text-white">
                    {unbold(consultation[0])}
                  </th>
                  <td className="block text-[3.2rem] font-light leading-none tracking-[-0.045em] text-white">
                    {unbold(consultation[1] ?? "")}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
          {note ? <Prose tone="deep" className="mt-8 lg:mt-auto lg:pt-10">{note.text}</Prose> : null}
        </div>

        <div className="rounded-3xl bg-warm p-3 sm:p-4 lg:col-span-8">
          <h3 className="px-3 pb-4 pt-3 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-deep sm:px-4">
            {labels[1].text}
          </h3>
          <table className="block w-full text-left sm:table">
            <thead className="hidden sm:table-header-group">
              <tr className="text-[0.8rem] text-hint">
                {header.map((cell, index) => (
                  <th key={index} scope="col" className="px-4 pb-3 font-medium first:pl-4">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="grid gap-2 sm:table-row-group">
              {rows.map(([nameCell, price, detail]) => {
                const { name, href } = linkCell(nameCell);
                const meta = TREATMENTS[name];
                const Icon = meta?.Icon;
                return (
                  <tr
                    key={name}
                    className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-2xl bg-white p-4 sm:table-row sm:p-0"
                  >
                    <th scope="row" className="font-normal sm:rounded-l-2xl sm:py-4 sm:pl-4 sm:pr-4">
                      <span className="flex items-center gap-3">
                        {Icon ? (
                          <span
                            aria-hidden="true"
                            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-care-100 text-deep sm:flex"
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                        ) : null}
                        {href ? (
                          <Link
                            href={href}
                            className="text-[1.08rem] font-medium text-charcoal underline decoration-care decoration-2 underline-offset-4 transition-colors hover:text-deep hover:decoration-deep"
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className="text-[1.08rem] font-medium text-charcoal">{name}</span>
                        )}
                      </span>
                    </th>
                    <td className="whitespace-nowrap text-right text-[1.2rem] font-light tracking-[-0.02em] text-charcoal sm:px-4 sm:py-4 sm:text-left sm:text-[1.35rem]">
                      {price}
                    </td>
                    <td className="col-span-2 text-[0.92rem] leading-snug text-copy sm:rounded-r-2xl sm:py-4 sm:pl-4 sm:pr-5">
                      {detail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
    </Band>
  );
}

/* ------------------------------------------------------------------ treatments: paying */

const MONEY = /PKR [\d,]+(?: a month)?|\d+ to \d+ per cent/g;

/**
 * Treatments, "Paying for it": how to pay, set large on a white card; the braces terms on a
 * Deep Teal card with their three figures picked out above the paragraph (aria-hidden: the
 * paragraph says them); the aligner line under it.
 */
export function PayingSection({ section, page, global }: Props) {
  const [methods, terms, ...rest] = paragraphs(section.body);
  const figures = terms ? [...terms.matchAll(MONEY)].map((m) => m[0]) : [];

  return (
    <Band id={section.id}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <Intro section={section} className="max-w-[40rem]" />
        <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" />
      </div>

      <div className="mt-10 grid gap-3 sm:gap-4 lg:grid-cols-12">
        {methods ? (
          <div className="flex flex-col justify-between gap-10 rounded-3xl bg-white p-7 sm:p-9 lg:col-span-4">
            <IconWell icon="price" />
            <Prose className="text-[1.9rem] leading-[1.15] tracking-[-0.02em] text-charcoal [&_p]:leading-[1.15]">
              {methods}
            </Prose>
          </div>
        ) : null}

        {terms ? (
          <div className="rounded-3xl bg-deep p-7 sm:p-9 lg:col-span-8">
            {figures.length > 1 ? (
              <ol aria-hidden="true" className="grid gap-3 sm:grid-cols-3">
                {figures.map((figure, index) => (
                  <li key={figure} className="rounded-2xl bg-white/8 px-5 py-4 ring-1 ring-white/10">
                    <span className="text-[0.75rem] font-semibold text-care">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mt-2 block text-[1.45rem] font-light leading-tight tracking-[-0.02em] text-white">
                      {figure}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
            <Prose tone="deep" className="mt-7 text-[1.08rem]">
              {terms}
            </Prose>
            {rest.length ? (
              <Prose tone="deep" className="mt-5 border-t border-white/12 pt-5">
                {rest.join("\n\n")}
              </Prose>
            ) : null}
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ about */

/** About, the hero: the white-coat portrait large, "the whole page rests on this photograph". */
export function AboutHero({ hero, page, global }: { hero: Section; page: Page; global: Global }) {
  const label = global.nav.find((item) => item.href === `/${page.slug}`)?.title ?? page.title;
  const photo = picture("portrait:white-coat");

  return (
    <section id={hero.id || undefined} className="scroll-mt-24">
      <Container className="pb-16 pt-9 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <Pill>{label}</Pill>
            <h1 className="mt-5 text-balance text-[2.6rem] font-normal leading-[1.04] tracking-[-0.035em] text-charcoal sm:text-[3.4rem] xl:text-[4.2rem]">
              {hero.heading}
            </h1>
            {hero.sub ? (
              <p className="mt-6 max-w-[34rem] text-pretty text-[1.1rem] leading-[1.7] text-copy">{hero.sub}</p>
            ) : null}
            <Actions section={hero} global={global} ctaLabel={page.ctaLabel} className="mt-8" />
          </div>

          {photo ? (
            <div className="relative mx-auto w-full max-w-[30rem] lg:col-span-5 lg:col-start-8 lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-care sm:translate-x-4 sm:translate-y-4"
              />
              <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-care-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover object-[50%_18%]"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-5 left-5 rounded-2xl bg-white/92 px-4 py-3 backdrop-blur lg:-left-10"
              >
                <span className="block text-[0.95rem] font-semibold text-charcoal">{global.dentist}</span>
                <span className="block text-[0.82rem] text-copy">{global.credentials}</span>
              </span>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/**
 * About, "What are his qualifications?": the two qualifications as two cards, each headed by
 * the abbreviation its paragraph opens with (aria-hidden: the paragraph says it). The three
 * sentences are final; nothing is added.
 */
export function QualificationsSection({ section, page, global }: Props) {
  const parts = paragraphs(section.body);

  return (
    <Band id={section.id} tone="white">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Intro section={section} />
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-8">
          {parts.map((part, index) => {
            const abbreviation = /^([A-Z][\w.]*)\s+is\b/.exec(part)?.[1];
            const dark = index === parts.length - 1;
            return (
              <div key={index} className={`flex flex-col rounded-3xl p-7 sm:p-9 ${dark ? "bg-deep" : "bg-warm"}`}>
                {abbreviation ? (
                  <span
                    aria-hidden="true"
                    className={`text-[3.4rem] font-light leading-none tracking-[-0.045em] sm:text-[4.4rem] ${
                      dark ? "text-care" : "text-deep"
                    }`}
                  >
                    {abbreviation}
                  </span>
                ) : null}
                <Prose tone={dark ? "deep" : "warm"} className="mt-10 text-[1.1rem] sm:mt-auto sm:pt-14">
                  {part}
                </Prose>
              </div>
            );
          })}
        </div>
      </div>
    </Band>
  );
}

/**
 * About, "What we do here", on the Care Teal band: the heading and @sub, the figures Home
 * shows for the same facts (aria-hidden here: the @sub says them), the words, every treatment
 * page as a chip (the nav's own labels), and the photograph of Dr Abaid at work.
 */
export function PracticeSection({ section, page, global, layout }: Props & { layout: Of<"practice"> }) {
  const photo = picture(layout.picture);
  const treatments = global.nav.filter((item) => global.treatmentGroup.includes(item.href));

  return (
    <Band id={section.id} tone="care">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Intro section={section} tone="care" />
          <dl aria-hidden="true" className="mt-9 grid max-w-[30rem] grid-cols-2 gap-x-8">
            {FIGURES.slice(0, 2).map((figure) => (
              <div key={figure.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-3 border-t border-charcoal/20 pt-3 text-[0.9rem] text-charcoal/80">{figure.label}</dt>
                <dd className="text-[2.8rem] font-light leading-none tracking-[-0.035em] text-charcoal sm:text-[3.4rem]">
                  {figure.value}
                  <span className="text-deep">{figure.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Prose tone="care" className="mt-9 text-charcoal">
            {section.body}
          </Prose>
          <ul className="mt-7 flex flex-wrap gap-2">
            {treatments.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full bg-white/80 px-4 py-2 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-white hover:text-deep"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>

        {photo ? (
          <div className="lg:col-span-5 lg:self-stretch">
            <Photo
              picture={photo}
              className="aspect-4/5 sm:aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[32rem]"
              position="50% 42%"
              sizes="(max-width: 1024px) 95vw, 36vw"
            />
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/* ------------------------------------------------------------------ where and when */

/**
 * About, "Where you'll find us": the address (@sub) and the week's hours, with today's hours
 * live; the photograph of the clinic from the street stands where a map would, until the
 * Google Maps embed is supplied. The photograph is shown whole (Uzair, 25 Sep 2026).
 */
export function FindUsSection({ section, page, global }: Props) {
  const photo = picture("exterior");

  return (
    <Band id={section.id}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Intro section={section} />
          <Today global={global} className="mt-7" />
          <Prose className="mt-8">{section.body}</Prose>
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>
        {photo ? (
          <div className="lg:col-span-6 lg:self-center">
            <Photo picture={photo} className="aspect-4/3" />
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/** Contact, "Where we are": the first screen of the page Dr Abaid sends over WhatsApp. */
export function ContactHero({ hero, page, global }: { hero: Section; page: Page; global: Global }) {
  const label = global.nav.find((item) => item.href === `/${page.slug}`)?.title ?? page.title;
  const [address, ...rest] = paragraphs(hero.body);
  const photo = picture("interior:reception");

  return (
    <section id={hero.id || undefined} className="scroll-mt-24">
      <Container className="pb-16 pt-9 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <Pill>{label}</Pill>
            <h1 className="mt-5 text-[2.6rem] font-normal leading-[1.04] tracking-[-0.035em] text-charcoal sm:text-[3.4rem] xl:text-[4.2rem]">
              {hero.heading}
            </h1>
            {/* The address on its three approved lines, as selectable text. */}
            {address ? (
              <Markdown className="mt-7 select-text text-[1.45rem] leading-[1.4] tracking-[-0.01em] text-charcoal sm:text-[1.7rem] [&_p]:leading-[1.4]">
                {address}
              </Markdown>
            ) : null}
            {rest.length ? <Prose className="mt-4 text-[1.05rem]">{rest.join("\n\n")}</Prose> : null}
            <Today global={global} className="mt-6" />
            <Actions section={hero} global={global} ctaLabel={page.ctaLabel} className="mt-8" />
          </div>

          {photo ? (
            <div className="relative lg:col-span-6">
              <Photo picture={photo} priority className="aspect-4/3 lg:aspect-5/4" position="50% 55%" />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/** Contact, "When we are open": the week as a table beside today's hours. */
export function HoursSection({ section, page, global }: Props) {
  const [table, ...rest] = paragraphs(section.body);

  return (
    <Band id={section.id} tone="white">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Intro section={section} />
          <Today global={global} className="mt-7 [&>span:first-child]:bg-care-100" />
          {rest.length ? <Prose className="mt-6">{rest.join("\n\n")}</Prose> : null}
          <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
        </div>
        <Markdown className="text-[1.05rem] lg:col-span-7 [&_table]:bg-warm [&_td]:py-5 [&_td]:text-[1.08rem] [&_th]:py-4">
          {table ?? ""}
        </Markdown>
      </div>
    </Band>
  );
}

/**
 * Contact, "Getting here": the exterior photograph large at the top, whole, and the words under
 * it as its caption, both held to one width so the photograph never fills a laptop screen.
 */
export function ExteriorSection({ section, page, global }: Props) {
  const photo = picture("exterior");
  const parts = paragraphs(section.body);
  const icons: IconKey[] = ["check", "pin", "parking"];

  return (
    <Band id={section.id} className="mx-auto max-w-[56rem]">
      {photo ? (
        <Photo
          picture={photo}
          // The whole shopfront, sign included. The sign lists "C.Implant": Uzair chose to show it
          // (25 Sep 2026, in CLAUDE.md). The site's own words still never mention implants.
          className="aspect-4/3"
          sizes="(max-width: 1024px) 95vw, 56rem"
        />
      ) : null}
      <Intro section={section} className="mt-10" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {parts.map((part, index) => (
          <li key={index} className="flex flex-col rounded-3xl bg-white p-6">
            <IconWell icon={icons[index] ?? "check"} />
            <Prose className="mt-6 sm:mt-auto sm:pt-8">{part}</Prose>
          </li>
        ))}
      </ul>
      <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
    </Band>
  );
}

/* ------------------------------------------------------------------ braces: signpost */

/**
 * "Which of these are you?": two large tappable cards, side by side on a wide screen and
 * stacked on a phone, so a parent reaches the children's section without scrolling past adult
 * pricing. Each card's words are the copy's own.
 */
export function SignpostSection({ section, page, global, pictures = [] }: Props & { pictures?: string[] }) {
  if (!section.signpost.length) return null;

  return (
    <Band id={section.id}>
      <Intro section={section} className="max-w-[40rem]" />
      <ul className="mt-10 grid gap-3 [--notch:var(--color-warm)] sm:gap-4 md:grid-cols-2">
        {section.signpost.map((item, index) => {
          const photo = picture(pictures[index]);
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-3 ${index === 0 ? "bg-white" : "bg-care"}`}
              >
                {photo ? (
                  <span className="relative block aspect-16/10 overflow-hidden rounded-2xl bg-care-100">
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 95vw, 45vw"
                      className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                  </span>
                ) : null}
                <span className="block px-4 pb-14 pr-16 pt-6 sm:px-5 sm:pb-16">
                  <span className="block text-[1.5rem] leading-tight tracking-[-0.02em] text-charcoal sm:text-[1.8rem]">
                    {item.lead}
                  </span>
                  {item.rest ? (
                    <span className={`mt-3 block text-[1.02rem] leading-[1.65] ${index === 0 ? "text-copy" : "text-charcoal"}`}>
                      {item.rest}
                    </span>
                  ) : null}
                </span>
                <Notch down />
              </a>
            </li>
          );
        })}
      </ul>
      <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
    </Band>
  );
}

/* ------------------------------------------------------------------ before and after */

/**
 * "Before and after", at the end of the page before the questions (Uzair, 25 Sep 2026: a simple
 * design). Every consented pair for the page, one card each, Before beside After, at the size
 * Uzair approved: the heading on the left, the pairs in the two thirds on the right, one under
 * another when there are several. Pairs a section higher up already shows (`skip`) are not
 * repeated. No pairs left: the section is omitted, heading and all.
 */
export function BeforeAfterGallery({ section, page, global, skip = 0 }: Props & { skip?: number }) {
  const pairs = beforeAfter(page.slug).slice(skip);
  if (!pairs.length) return null;
  const one = pairs.length === 1;

  return (
    <Band id={section.id} tone="white">
      <div className={`grid gap-8 lg:grid-cols-12 lg:gap-14 ${one ? "lg:items-center" : ""}`}>
        <div className="lg:col-span-4">
          {/* With several pairs, the heading stays in view beside them on wide screens. */}
          <div className={one ? "" : "lg:sticky lg:top-28"}>
            <Intro section={section} tone="white" />
            <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
          </div>
        </div>
        <ul className="grid gap-4 lg:col-span-8">
          {pairs.map((pair) => (
            <li key={pair.id}>
              <PairCard pair={pair} title={page.title} ground="warm" />
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}

