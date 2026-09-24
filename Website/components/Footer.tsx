import Link from "next/link";
import { getGlobal } from "@/lib/global";
import Container from "./Container";
import GradientBackdrop from "./GradientBackdrop";
import TodaysHours from "./TodaysHours";
import { Fill, Sheen, ctaMotion, iconMotion } from "./Buttons";
import { PhoneIcon, SOCIAL_ICONS, SOCIAL_LABELS, ToothLogo, WhatsAppIcon } from "./Icons";

const DAY_ORDER: [string, string][] = [
  ["Monday", "1"],
  ["Tuesday", "2"],
  ["Wednesday", "3"],
  ["Thursday", "4"],
  ["Friday", "5"],
  ["Saturday", "6"],
  ["Sunday", "0"],
];

export default function Footer() {
  const global = getGlobal();
  const social = Object.entries(global.social ?? {}).filter(
    ([key]) => key in SOCIAL_ICONS,
  ) as [keyof typeof SOCIAL_ICONS, string][];

  return (
    <footer className="relative isolate overflow-hidden bg-teal-900 text-mint">
      <GradientBackdrop grainId="footer-grain" />
      <Container>
        <div className="grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-mint">
                <ToothLogo className="h-6 w-6" />
              </span>
              <span className="font-display text-xl font-bold leading-none tracking-tight text-white">
                Abaid <span className="text-teal">Dental Care</span>
              </span>
            </div>

            <address className="mt-6 not-italic leading-[1.9]">
              {global.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-2 text-mint/80">{global.address.landmark}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={global.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-teal-600 px-5 py-3 text-[0.92rem] font-semibold text-white hover:bg-teal hover:shadow-black/25 ${ctaMotion}`}
              >
                <Sheen />
                <WhatsAppIcon className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-115`} />
                <span className="relative">Message us on WhatsApp</span>
              </a>
              <a
                href={global.phone.tel}
                className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-line-dark px-5 py-3 text-[0.92rem] font-semibold text-white hover:border-teal hover:shadow-black/30 ${ctaMotion}`}
              >
                <Fill variant="dark" />
                <PhoneIcon className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-115`} />
                <span className="relative">{global.phone.callLabel}</span>
              </a>
            </div>

            <p className="mt-5 text-[0.88rem] text-mint/80">{global.replyTime}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-accent-light">
              Pages
            </h2>
            <ul className="mt-5 space-y-2.5">
              {global.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[0.95rem] text-mint/85 hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-accent-light">
              Opening hours
            </h2>
            <ul className="mt-5 space-y-2.5 text-[0.85rem]">
              {DAY_ORDER.map(([label, index]) => (
                <li key={label} className="flex justify-between gap-4 border-b border-line-dark/50 pb-2.5">
                  <span className="text-mint/85">{label}</span>
                  <span className="text-right text-white">{global.hours.week[index]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.88rem] text-mint/80">{global.hours.jummah}</p>
            <p className="mt-2 text-[0.88rem] text-white">
              <TodaysHours
                week={global.hours.week}
                todayLabel={global.hours.todayLabel}
                fallback={global.hours.fallback}
                timezone={global.hours.timezone}
              />
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-line-dark py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.85rem] text-mint/80">
            {global.dentist}, {global.credentials}
          </p>

          {social.length ? (
            <ul className="flex gap-3">
              {social.map(([key, href]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-line-dark text-mint hover:border-teal hover:bg-teal-800 hover:text-white hover:shadow-black/30 ${ctaMotion}`}
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
