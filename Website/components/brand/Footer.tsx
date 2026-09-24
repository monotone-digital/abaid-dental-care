import Image from "next/image";
import Link from "next/link";
import { getGlobal } from "@/lib/global";
import Container from "../Container";
import TodaysHours from "../TodaysHours";
import { PhoneIcon, SOCIAL_ICONS, SOCIAL_LABELS } from "../Icons";
import { WhatsAppButton } from "./ui";

/** Monday first, as people read a week; the values are keyed 0 = Sunday in _global.md. */
const WEEK: [string, string][] = [
  ["Monday", "1"],
  ["Tuesday", "2"],
  ["Wednesday", "3"],
  ["Thursday", "4"],
  ["Friday", "5"],
  ["Saturday", "6"],
  ["Sunday", "0"],
];

/**
 * The week in as few rows as it takes: the hours most days keep, over the span from the first
 * to the last of those days ("Monday to Saturday"), then each day that differs, in order.
 */
function groupHours(week: Record<string, string>) {
  const counts = new Map<string, number>();
  for (const [, key] of WEEK) counts.set(week[key], (counts.get(week[key]) ?? 0) + 1);
  const usual = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const usualDays = WEEK.filter(([, key]) => week[key] === usual).map(([day]) => day);
  const span = usualDays.length > 1 ? `${usualDays[0]} to ${usualDays[usualDays.length - 1]}` : usualDays[0];
  return [
    { day: span, hours: usual, exception: false },
    ...WEEK.filter(([, key]) => week[key] !== usual).map(([day, key]) => ({ day, hours: week[key], exception: true })),
  ];
}

const heading = "text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-care-100";
const link = "text-[0.95rem] text-white/75 transition-colors hover:text-white";

/**
 * Deep Teal, as the reference's footer. Top: the logo, small and on the left, and the two ways
 * to reach the clinic. Then four columns — where it is, the clinic's pages, the treatment
 * pages, the week's hours — and a last line with the credentials, the copyright and the maker's
 * credit, and the social links. Column headings and the credit line are at Uzair's request
 * (24 Sep 2026); the page labels come from _global.md.
 */
export default function Footer() {
  const global = getGlobal();
  const group = new Set(global.treatmentGroup);
  const pricesLabel = global.navSplit?.prices;
  const clinicPages = global.nav
    .filter((item) => !group.has(item.href))
    .map((item) => (item.href === "/treatments" && pricesLabel ? { ...item, title: pricesLabel } : item));
  const treatmentPages = global.nav.filter((item) => group.has(item.href));
  const hours = groupHours(global.hours.week);
  const social = Object.entries(global.social ?? {}).filter(
    ([key]) => key in SOCIAL_ICONS,
  ) as [keyof typeof SOCIAL_ICONS, string][];

  // On phones the WhatsApp bar is fixed over the bottom of the screen; the footer's bottom
  // padding keeps its last line clear of it.
  return (
    <footer className="bg-deep pb-24 text-white/75 lg:pb-0">
      <Container>
        <div className="flex flex-col gap-8 border-b border-white/12 pb-10 pt-14 sm:flex-row sm:items-center sm:justify-between lg:pt-16">
          <Link href="/" aria-label={`${global.clinic} home`} className="shrink-0 self-start sm:self-auto">
            <Image
              src="/brand/logo-white.png"
              alt=""
              width={1900}
              height={245}
              sizes="16rem"
              className="h-auto w-[13rem] sm:w-[15rem]"
            />
          </Link>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-stretch gap-3">
              <WhatsAppButton href={global.whatsapp} label="Message us on WhatsApp" onDark />
              <a
                href={global.phone.tel}
                className="group inline-flex items-center gap-2.5 rounded-lg border border-white/20 px-5 py-3.5 text-[0.95rem] font-semibold text-white transition-colors hover:border-care-100 hover:bg-white/5"
              >
                <PhoneIcon className="h-5 w-5 text-care-100 transition-transform motion-safe:group-hover:rotate-12" />
                {global.phone.callLabel}
              </a>
            </div>
            <p className="text-[0.88rem]">{global.replyTime}</p>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr_1.5fr] lg:gap-10 lg:py-14">
          <div>
            <h2 className={heading}>Find us</h2>
            <address className="mt-5 text-[1rem] not-italic leading-[1.7] text-white">
              {global.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-3 text-[0.9rem]">{global.address.landmark}</p>
          </div>

          {/* Side by side on a phone; separate columns from sm, where the wrapper steps aside. */}
          <div className="grid grid-cols-2 gap-8 sm:contents">
            <nav aria-label="Clinic">
              <h2 className={heading}>Clinic</h2>
              <ul className="mt-5 space-y-3">
                {clinicPages.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Treatments">
              <h2 className={heading}>{global.navSplit?.treatments ?? "Treatments"}</h2>
              <ul className="mt-5 space-y-3">
                {treatmentPages.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={link}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className={heading}>Opening hours</h2>
            <dl className="mt-5 divide-y divide-white/10 rounded-2xl bg-white/[0.06] px-5 ring-1 ring-white/10">
              {hours.map((row) => (
                <div key={row.day} className="flex items-start justify-between gap-4 py-4">
                  <dt className={row.exception ? "text-white/80" : "font-medium text-white"}>
                    {row.day}
                    {row.day === "Friday" ? (
                      <span className="mt-0.5 block text-[0.8rem] text-white/70">{global.hours.jummah}</span>
                    ) : null}
                  </dt>
                  <dd className="shrink-0 text-right text-[0.92rem] text-white">
                    {row.hours.split(" and ").map((part) => (
                      <span key={part} className="block">
                        {part}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-start gap-2.5 text-[0.9rem] text-white">
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-care" />
              <TodaysHours
                week={global.hours.week}
                todayLabel={global.hours.todayLabel}
                fallback={global.hours.fallback}
                timezone={global.hours.timezone}
              />
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 border-t border-white/12 py-7 text-center text-[0.85rem] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:text-left">
          <p className="lg:justify-self-start">
            {global.dentist}, {global.credentials}
          </p>

          <p className="lg:text-center">
            © {new Date().getFullYear()} {global.clinic}. All rights reserved.
            <span aria-hidden="true" className="mx-2 hidden text-white/35 sm:inline">
              ·
            </span>
            <a
              href="https://www.monotone.digital"
              target="_blank"
              rel="noopener"
              className="mt-2 block whitespace-nowrap text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-care-100 sm:mt-0 sm:inline"
            >
              Made by Monotone
            </a>
          </p>

          {social.length ? (
            <ul className="flex gap-2.5 lg:justify-self-end">
              {social.map(([key, href]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/85 transition-colors hover:border-care hover:bg-care hover:text-charcoal"
                    >
                      <span className="sr-only">
                        {global.clinic} on {SOCIAL_LABELS[key]}
                      </span>
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
