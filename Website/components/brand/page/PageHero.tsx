import Image from "next/image";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Container from "../../Container";
import { Actions, Notch, Pill } from "../ui";
import { picture } from "./pictures";
import { priceParts } from "./parts";
import type { HeroCard, HeroLayout } from "./layouts";

/** The cards' titles: one size, one place (top left), set straight, as on Home. */
const CARD_TITLE = "text-[1.2rem] leading-[1.12] tracking-[-0.02em] text-charcoal sm:text-[1.7rem] xl:text-[1.95rem]";

/** A card's figure, read from the section it points to, so it can never drift from the copy. */
function figureOf(card: Extract<HeroCard, { kind: "figure" }>, target: Section) {
  const source = card.from === "sub" ? target.sub : target.body;
  if (card.monthly) {
    const monthly = /PKR [\d,]+ a month/.exec(source ?? "")?.[0];
    return priceParts(monthly);
  }
  return priceParts(source);
}

function Card({ card, sections }: { card: HeroCard; sections: Section[] }) {
  const target = sections.find((s) => s.id === card.target);
  if (!target) return null;
  const base = "group relative flex h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-auto";

  if (card.kind === "figure") {
    const parts = figureOf(card, target);
    if (!parts) return null;
    const [currency, amount] = parts.figure.split(" ");
    return (
      <a href={`#${target.id}`} className={`${base} flex-col justify-between bg-care p-5 sm:p-8`}>
        <span className={CARD_TITLE}>{target.heading}</span>
        {/* The figure restates the section it opens, so it is read there, not here. */}
        <span aria-hidden="true" className="block pr-10 text-charcoal">
          <span className="block text-[0.85rem] font-semibold sm:text-[0.95rem]">
            {parts.lead ? `${parts.lead} ` : ""}
            {currency}
          </span>
          <span className="mt-1 block text-[2.1rem] font-light leading-none tracking-[-0.04em] sm:text-[3rem] xl:text-[3.4rem]">
            {amount}
          </span>
          {parts.tail ? <span className="mt-1.5 block text-[0.85rem] font-semibold">{parts.tail}</span> : null}
        </span>
        <Notch down />
      </a>
    );
  }

  const photo = picture(card.picture);
  if (!photo) return null;
  const art = card.picture.startsWith("render:");
  return (
    <a href={`#${target.id}`} className={`${base} ${art ? "bg-warm-200" : "bg-care-100"}`}>
      <Image
        src={photo.src}
        alt=""
        fill
        sizes="(max-width: 1024px) 50vw, 22vw"
        className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        style={{ objectPosition: card.position ?? "center" }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-white/92 via-white/45 via-40% to-transparent"
      />
      <span className={`relative p-5 sm:p-8 ${CARD_TITLE}`}>{target.heading}</span>
      <Notch down />
    </a>
  );
}

/**
 * Every inner page opens like Home: the nav's own label for the page as the small pill, the
 * h1 large with the @sub under it and the buttons beside (the sub always above them), then a row of three
 * cards — a photograph, and two cards that scroll to sections further down, titled with
 * those sections' own headings. A figure on a card is read from the section it opens.
 */
export default function PageHero({
  hero,
  page,
  global,
  layout,
}: {
  hero: Section;
  page: Page;
  global: Global;
  layout: HeroLayout;
}) {
  const label = global.nav.find((item) => item.href === `/${page.slug}`)?.title ?? page.title;
  const main = picture(layout.main);

  return (
    <section id={hero.id || undefined} className="scroll-mt-24">
      <Container className="pb-16 pt-9 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Pill>{label}</Pill>
            <h1 className="mt-5 text-balance text-[2.35rem] font-normal leading-[1.06] tracking-[-0.035em] text-charcoal sm:text-[3.1rem] xl:text-[3.6rem] 2xl:text-[4rem]">
              {hero.heading}
            </h1>
            {/* The sub carries the answer to the headline: always directly under it, above the buttons. */}
            {hero.sub ? (
              <p className="mt-5 max-w-[40rem] text-pretty text-[1.08rem] leading-[1.7] text-copy">{hero.sub}</p>
            ) : null}
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <Actions section={hero} global={global} ctaLabel={page.ctaLabel} className="" />
          </div>
        </div>

        {main ? (
          <div className="mt-10 grid grid-cols-2 gap-3 [--notch:var(--color-warm)] sm:gap-4 lg:mt-14 lg:h-[23rem] lg:grid-cols-[1.9fr_1fr_1fr]">
            <div className="relative col-span-2 h-[19rem] overflow-hidden rounded-3xl bg-care-100 sm:h-[24rem] lg:col-span-1 lg:h-auto">
              <Image
                src={main.src}
                alt={main.alt}
                fill
                priority
                sizes="(max-width: 1024px) 95vw, 48vw"
                className="object-cover"
                style={{ objectPosition: layout.mainPosition ?? "center" }}
              />
              {/* Over a patient photograph, his name and credentials; over the clinic itself, nothing. */}
              {layout.main.startsWith("interior:") ? null : (
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 inline-flex items-center gap-3 whitespace-nowrap rounded-2xl bg-white/90 px-4 py-2.5 backdrop-blur sm:bottom-5 sm:left-5"
              >
                <span className="leading-tight">
                  <span className="block text-[0.88rem] font-semibold text-charcoal">{global.dentist}</span>
                  <span className="block text-[0.78rem] text-copy">{global.credentials}</span>
                </span>
              </span>
              )}
            </div>
            {layout.cards.map((card) => (
              <Card key={card.target} card={card} sections={page.sections} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
