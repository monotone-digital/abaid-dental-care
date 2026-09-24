import Image from "next/image";
import Link from "next/link";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { site } from "@/lib/images";
import { ArrowUpRight } from "../Icons";
import { TREATMENTS, parsePriceList } from "../treatments";
import { Actions, Band, Heading, Notch } from "./ui";

/** The treatments that share the tall picture card: both go to the braces and aligners page. */
const FEATURED_HREF = "/braces-and-aligners";

type Row = { name: string; price: string };

/** "from PKR 5,000" -> "from", then the figure. Same words; only the weight differs. */
const splitPrice = (price: string) => /^(from)\s+(.+)$/i.exec(price);

/**
 * One treatment inside a card: name at the top, starting price large at the foot, as the
 * reference's figures. Its minimal picture appears only while the cell is hovered (or focused
 * from the keyboard), and only on devices that can hover, so a phone never downloads it.
 */
function Cell({ row }: { row: Row }) {
  const meta = TREATMENTS[row.name];
  const price = splitPrice(row.price);
  const picture = meta.hover ? site(meta.hover) : null;

  return (
    <li className="min-w-0">
      <Link
        href={meta.href}
        className="group relative flex h-full flex-col overflow-hidden p-5 transition-colors duration-300 hover:bg-care-50 sm:p-6 lg:min-h-[12rem] xl:p-7"
      >
        {picture ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:block"
          >
            <Image
              src={picture}
              alt=""
              fill
              sizes="(max-width: 1280px) 24vw, 18vw"
              className="object-cover object-right transition-transform duration-700 ease-out motion-safe:scale-110 motion-safe:group-hover:scale-100 motion-safe:group-focus-visible:scale-100"
            />
            {/* The pictures are composed with the object right of centre, clear of the words;
                this keeps the name and price crisp over the soft background all the same. */}
            <span className="absolute inset-0 bg-linear-to-r from-warm/60 via-warm/10 to-transparent" />
          </span>
        ) : null}

        <h3 className="relative pr-12 text-[1.05rem] font-medium leading-snug text-charcoal sm:text-[1.12rem]">{row.name}</h3>
        <p className="relative mt-3 sm:mt-auto sm:pt-8">
          {price ? (
            <>
              <span className="block text-[0.82rem] text-hint">{price[1]}</span>{" "}
              <span className="mt-0.5 block text-[1.5rem] font-light leading-none tracking-[-0.03em] text-charcoal lg:text-[1.6rem] xl:text-[1.85rem]">
                {price[2]}
              </span>
            </>
          ) : (
            <span className="text-copy">{row.price}</span>
          )}
        </p>
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/12 text-charcoal transition-colors duration-300 group-hover:border-deep group-hover:bg-deep group-hover:text-white sm:right-5 sm:top-5"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-px motion-safe:group-hover:translate-x-px" />
        </span>
      </Link>
    </li>
  );
}

/** A card of treatments in a row, divided by hairlines; stacked as a list on a phone. */
function Card({ rows, tinted = false, className = "" }: { rows: Row[]; tinted?: boolean; className?: string }) {
  if (!rows.length) return null;
  return (
    <ul
      className={`grid divide-y divide-charcoal/10 overflow-hidden rounded-3xl sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0 ${
        tinted
          ? "bg-care-100 bg-[radial-gradient(120%_160%_at_100%_0%,var(--color-care-50),transparent_60%)]"
          : "bg-white"
      } ${className}`}
    >
      {rows.map((row) => (
        <Cell key={row.name} row={row} />
      ))}
    </ul>
  );
}

/**
 * Home, "Treatments", after the reference's services bento: the heading with the @sub and the
 * link to the full list; then the price list, in its own order, as two calm cards of three
 * (one white, one Care Teal tint) and a tall picture card for braces and clear aligners, the
 * reference's "Orthodontics" card, titled with the nav's label for that page. Every name and
 * price is the list's own wording; only "from" is set smaller than the figure.
 */
export default function TreatmentsSection({
  section,
  page,
  global,
}: {
  section: Section;
  page: Page;
  global: Global;
}) {
  const rows = parsePriceList(section.body).filter((row) => TREATMENTS[row.name]);
  const featured = rows.filter((row) => TREATMENTS[row.name].href === FEATURED_HREF);
  const rest = rows.filter((row) => TREATMENTS[row.name].href !== FEATURED_HREF);
  const half = Math.ceil(rest.length / 2);
  const featuredLabel = global.nav.find((item) => item.href === FEATURED_HREF)?.title;
  const photo = site("clear-aligners") ?? site("braces-and-aligners");
  const hasFeature = featured.length > 0 && photo;

  return (
    <Band id={section.id}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div className="max-w-[36rem]">
          <Heading>{section.heading}</Heading>
          {section.sub ? <p className="mt-4 text-[1.05rem] leading-[1.7] text-copy">{section.sub}</p> : null}
        </div>
        <Actions section={section} global={global} ctaLabel={page.ctaLabel} className="" />
      </div>

      <div className="mt-10 grid gap-3 sm:gap-4 lg:grid-cols-12">
        <Card rows={rest.slice(0, half)} className={hasFeature ? "lg:col-span-8" : "lg:col-span-12"} />
        <Card
          rows={rest.slice(half)}
          tinted
          className={hasFeature ? "lg:col-span-8 lg:col-start-1 lg:row-start-2" : "lg:col-span-12"}
        />

        {hasFeature ? (
          <Link
            href={FEATURED_HREF}
            className="group relative flex min-h-[21rem] flex-col overflow-hidden rounded-3xl bg-care-100 [--notch:var(--color-warm)] sm:min-h-[24rem] lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:min-h-0"
          >
            <Image
              src={photo}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover object-[65%_center] transition-transform duration-700 motion-safe:group-hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-white/85 via-white/0 via-45% to-transparent" />

            {featuredLabel ? (
              <span className="relative p-6 pr-20 text-[1.5rem] leading-[1.1] tracking-[-0.02em] text-charcoal sm:p-7 sm:pr-20 sm:text-[1.7rem]">
                {featuredLabel}
              </span>
            ) : null}

            <ul className="relative mt-auto grid gap-2 p-3">
              {featured.map((row) => {
                const price = splitPrice(row.price);
                return (
                  <li
                    key={row.name}
                    className="flex items-baseline justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur"
                  >
                    <h3 className="text-[0.98rem] font-medium text-charcoal">{row.name}</h3>
                    <p className="whitespace-nowrap text-[0.95rem]">
                      {price ? (
                        <>
                          <span className="text-hint">{price[1]}</span>{" "}
                          <span className="font-semibold text-deep">{price[2]}</span>
                        </>
                      ) : (
                        row.price
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>

            <Notch corner="tr" />
          </Link>
        ) : null}
      </div>
    </Band>
  );
}
