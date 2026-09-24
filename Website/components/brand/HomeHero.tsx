import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { portrait, site } from "@/lib/images";
import Container from "../Container";
import Markdown from "../Markdown";
import TodaysHours from "../TodaysHours";
import { ClockIcon, MapPinIcon } from "../Icons";
import { CallButton, Mark, Notch, WhatsAppButton } from "./ui";

/**
 * Home hero, after the reference: a small coloured line over a large statement, the practical
 * details and the buttons to its right, then a row of three cards.
 *
 * The h1 is the clinic's name, set as the reference's small coloured line; what-we-do's h2 is
 * the large statement, with its @sub under it, above the buttons. The clinic-card body (the
 * address) and today's hours sit beside the buttons, so on a phone they come before any
 * argument. The hero's own @sub is still not rendered, at the client's request.
 *
 * The first card is "Treatments" (the nav's label) and scrolls down to Home's Treatments section;
 * the other two link to their pages, labelled with the nav's own words. The chip in the first
 * restates Dr Abaid's name and credentials and is hidden from screen readers. The three photos
 * are generated (Magnific, Nano Banana Pro), realistic by Uzair's brief of 24 Sep 2026.
 */
/** The three cards' titles: one size, one place (top left), set straight. */
const CARD_TITLE = "text-[1.4rem] leading-[1.1] tracking-[-0.02em] text-charcoal sm:text-[2.1rem]";

export default function HomeHero({
  hero,
  whatWeDo,
  global,
  ctaLabel,
}: {
  hero: Section;
  whatWeDo: Section | null;
  global: Global;
  ctaLabel: string;
}) {
  const label = (href: string) => global.nav.find((item) => item.href === href)?.title ?? null;
  const photo = site("home-card-treatments") ?? site("hero-a");
  const smile = site("home-card-braces");
  const crown = site("home-card-caps") ?? site("caps-and-bridges");
  const face = portrait();

  const treatments = global.navSplit?.treatments ?? label("/treatments");
  const braces = label("/braces-and-aligners");
  const caps = label("/caps-and-bridges");

  return (
    <section id={hero.id || undefined} className="scroll-mt-24">
      <Container className="pb-16 pt-9 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="flex items-center gap-2 text-[1rem] font-semibold text-deep">
              <Mark className="h-5 w-5" />
              {hero.heading}
            </h1>

            {whatWeDo ? (
              <>
                <h2 className="mt-4 text-[2.35rem] font-normal leading-[1.06] tracking-[-0.035em] text-charcoal sm:text-[3.1rem] xl:text-[3.6rem] 2xl:text-[4rem]">
                  {whatWeDo.heading}
                </h2>
                {whatWeDo.sub ? (
                  <p className="mt-5 max-w-[44ch] text-[1.05rem] leading-[1.7] text-copy">{whatWeDo.sub}</p>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <ul className="space-y-3 text-[0.98rem] leading-snug text-charcoal">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-deep">
                  <MapPinIcon className="h-4.5 w-4.5" />
                </span>
                <Markdown tone="brand" className="pt-2 [&_p]:leading-[1.45]">
                  {hero.body}
                </Markdown>
              </li>
              <li className="flex items-start gap-3">
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
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap items-stretch gap-3">
              {hero.cta ? <WhatsAppButton href={global.whatsapp} label={ctaLabel} /> : null}
              {hero.call ? <CallButton href={global.phone.tel} label={global.phone.callLabel} /> : null}
            </div>
            {hero.beside ? <p className="mt-3.5 text-[0.9rem] text-hint">{hero.beside}</p> : null}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 [--notch:var(--color-warm)] sm:gap-4 lg:mt-14 lg:h-[23rem] lg:grid-cols-[1.9fr_1fr_1fr]">
          {treatments && photo ? (
            <a
              href="#treatments"
              className="group relative col-span-2 flex min-h-[19rem] overflow-hidden rounded-3xl bg-care lg:col-span-1 lg:min-h-0"
            >
              {/* The patient sits on the right, facing into the card; faded in from the left over the teal. */}
              <div className="absolute inset-y-0 right-0 w-[62%] [mask-image:linear-gradient(to_right,transparent,black_38%)]">
                <Image
                  src={photo}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 62vw, 30vw"
                  className="object-cover object-[65%_45%] transition-transform duration-700 motion-safe:group-hover:scale-105"
                />
              </div>

              <div className="relative flex w-[62%] flex-col justify-between p-5 sm:w-1/2 sm:p-8">
                <span className={CARD_TITLE}>
                  {treatments}
                </span>

                {face ? (
                  <span
                    aria-hidden="true"
                    className="mt-8 inline-flex items-center gap-3 self-start whitespace-nowrap rounded-full bg-white/85 py-1.5 pl-1.5 pr-4 backdrop-blur"
                  >
                    <span className="relative h-10 w-10 overflow-hidden rounded-full bg-care-100">
                      <Image src={face} alt="" fill sizes="40px" className="object-cover object-[50%_20%]" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[0.85rem] font-semibold text-charcoal">{global.dentist}</span>
                      <span className="block text-[0.78rem] text-copy">{global.credentials}</span>
                    </span>
                  </span>
                ) : null}
              </div>

              <Notch down />
            </a>
          ) : null}

          {braces ? (
            <Link
              href="/braces-and-aligners"
              className="group relative flex h-64 overflow-hidden rounded-3xl bg-care-100 sm:h-80 lg:h-auto"
            >
              {smile ? (
                <>
                  <Image
                    src={smile}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover object-[57%_center] transition-transform duration-700 motion-safe:group-hover:scale-105"
                  />
                  {/* A little stronger than the caps card's: the title's second line meets her hair. */}
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-white/95 via-white/55 via-40% to-transparent" />
                </>
              ) : null}
              <span className={`relative p-5 sm:p-8 ${CARD_TITLE}`}>
                {braces}
              </span>
              <Notch />
            </Link>
          ) : null}

          {caps && crown ? (
            <Link href="/caps-and-bridges" className="group relative flex h-64 overflow-hidden rounded-3xl bg-white sm:h-80 lg:h-auto">
              <Image
                src={crown}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 20vw"
                className="object-cover object-[62%_center] transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-white/90 via-white/30 via-40% to-transparent" />
              <span className={`relative p-5 sm:p-8 ${CARD_TITLE}`}>
                {caps}
              </span>
              <Notch />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
