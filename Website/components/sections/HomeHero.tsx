import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import Container from "../Container";
import { CallButton, WhatsAppButton, iconMotion } from "../Buttons";
import { ArrowRight } from "../Icons";
import { Headline } from "./Shell";

/**
 * Home hero. The clinic-card section and what-we-do render as one block, above the fold.
 * The address and the hours are not repeated here — they sit above the nav. The hero's
 * @sub is deliberately not rendered either, at the client's request.
 */
export default function HomeHero({
  hero,
  whatWeDo,
  global,
  ctaLabel,
  treatments,
}: {
  hero: Section;
  whatWeDo: Section | null;
  global: Global;
  ctaLabel: string;
  treatments: { title: string; href: string }[];
}) {
  const image = site("hero-a");

  return (
    <section id={hero.id || undefined} className="relative overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 hidden h-[34rem] w-[34rem] rounded-full bg-mint/60 blur-3xl lg:block"
      />
      <Container className="relative py-12 lg:py-[130px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Headline level={1} tone="light" accent accentWords={2}>
              {hero.heading}
            </Headline>

            {whatWeDo ? (
              <div className="mt-8 border-l-4 border-mint pl-5">
                <h2 className="font-display text-[1.2rem] font-semibold leading-[1.45] text-ink sm:text-[1.35rem]">
                  {whatWeDo.heading}
                </h2>
                {whatWeDo.sub ? (
                  <p className="mt-2.5 text-[1.02rem] leading-[1.7] text-body">{whatWeDo.sub}</p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3">
              {hero.cta ? <WhatsAppButton href={global.whatsapp} label={ctaLabel} /> : null}
              {hero.call ? (
                <CallButton href={global.phone.tel} label={global.phone.callLabel} />
              ) : null}
            </div>

            {hero.beside ? <p className="mt-4 text-[0.92rem] text-muted">{hero.beside}</p> : null}

            {treatments.length ? (
              <ul className="mt-9 flex flex-wrap gap-2">
                {treatments.map((t) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[0.86rem] font-medium text-body transition-[color,border-color,box-shadow,translate] duration-300 ease-out hover:border-accent hover:text-teal-800 hover:shadow-md hover:shadow-ink/10 motion-safe:hover:-translate-y-0.5"
                    >
                      {t.title}
                      <ArrowRight className={`h-3.5 w-3.5 ${iconMotion} motion-safe:group-hover:translate-x-1`} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {image ? (
            <div className="relative">
              {/* From lg the photograph is taken out of flow, so it crops to the height the text sets. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-hero bg-mint-100 sm:aspect-square lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src={image}
                  alt="A patient having her teeth examined in the dental chair"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
