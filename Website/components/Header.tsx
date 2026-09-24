import { getGlobal, getNavGroups } from "@/lib/global";
import { getCtaLabels } from "@/lib/content";
import Container from "./Container";
import Nav from "./Nav";
import TodaysHours from "./TodaysHours";
import { ClockIcon, MapPinIcon, PhoneIcon } from "./Icons";
import { iconMotion } from "./Buttons";

/**
 * The address and the hours sit above the nav, on every page and every screen size,
 * so they are the first thing a phone shows.
 */
export default function Header() {
  const global = getGlobal();

  return (
    <header>
      <div className="bg-teal-900 text-mint">
        <Container gutter="header">
          <div className="flex flex-col gap-1 py-2.5 text-[0.8rem] leading-snug sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-[0.82rem]">
            <p className="flex items-start gap-2">
              <MapPinIcon className="mt-px h-4 w-4 shrink-0 text-teal opacity-90" />
              <span>{global.address.oneLine}</span>
            </p>

            <div className="flex items-center gap-4 sm:shrink-0">
              <p className="flex items-start gap-2">
                <ClockIcon className="mt-px h-4 w-4 shrink-0 text-teal opacity-90" />
                <TodaysHours
                  week={global.hours.week}
                  todayLabel={global.hours.todayLabel}
                  fallback={global.hours.fallback}
                  timezone={global.hours.timezone}
                />
              </p>
              <a
                href={global.phone.tel}
                className="group hidden items-center gap-2 font-semibold text-white transition-colors duration-200 hover:text-teal lg:flex"
              >
                <PhoneIcon
                  className={`h-4 w-4 ${iconMotion} motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-115`}
                />
                {global.phone.display}
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Nav
        items={getNavGroups(global)}
        clinic={global.clinic}
        whatsapp={global.whatsapp}
        tel={global.phone.tel}
        phoneDisplay={global.phone.display}
        ctaLabels={getCtaLabels()}
        defaultCtaLabel="Message us on WhatsApp"
      />
    </header>
  );
}
