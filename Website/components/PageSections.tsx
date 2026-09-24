import type { Page } from "@/lib/content";
import { getGlobal } from "@/lib/global";
import { hasVisual } from "./sections/Visual";
import type { Tone } from "./sections/Shell";
import HomeHero from "./sections/HomeHero";
import TextSection from "./sections/TextSection";
import DoctorSection from "./sections/DoctorSection";
import TreatmentGrid from "./sections/TreatmentGrid";
import ReviewsSection from "./sections/ReviewsSection";
import FaqSection from "./sections/FaqSection";
import SignpostSection from "./sections/SignpostSection";
import MapSection from "./sections/MapSection";
import BeforeAfterSection from "./sections/BeforeAfterSection";
import AfterwardsSection from "./sections/AfterwardsSection";
import ArriveSection from "./sections/ArriveSection";
import BadExperienceSection from "./sections/BadExperienceSection";
import BeforeWeStartSection from "./sections/BeforeWeStartSection";
import CostSection from "./sections/CostSection";
import HomeCapsSection from "./sections/HomeCapsSection";
import HomeReviewsSection from "./sections/HomeReviewsSection";
import HomeVisitSection from "./sections/HomeVisitSection";
import InjectionSection from "./sections/InjectionSection";
import SeeItSection from "./sections/SeeItSection";

/*
 * Home no longer renders through here: since the September 2026 brand change it is
 * components/brand/HomePage. The isHome branches below and the Home* section components they
 * use are kept only until the new design is approved, so Home can be switched back in one line
 * (app/(home)/page.tsx); remove them when the other pages move to the new design.
 */

/** Sections that carry the dark teal band rather than the alternating light/mint rhythm. */
const DARK_IDS = new Set(["dr-abaid"]);

/**
 * Sections in the approved content that are deliberately not rendered, at the client's
 * request. "message" is the closing "Message us for the timings" band above the footer;
 * the footer already carries the same WhatsApp and call buttons.
 */
const HIDDEN_IDS = new Set(["message"]);

/**
 * Hidden on Home only. "find-us" (address, landmark and hours table) is already covered by
 * the bar above the nav and the footer; other pages keep their own version.
 */
const HIDDEN_ON_HOME = new Set(["find-us"]);

export default function PageSections({ page }: { page: Page }) {
  const global = getGlobal();
  const isHome = page.slug === "";
  const sections = page.sections.filter(
    (s) => !HIDDEN_IDS.has(s.id) && !(isHome && HIDDEN_ON_HOME.has(s.id)),
  );

  const heroSection = isHome ? sections.find((s) => s.id === "hero") : undefined;
  const whatWeDo = isHome ? sections.find((s) => s.id === "what-we-do") ?? null : null;

  const body = isHome
    ? sections.filter((s) => s.id !== "hero" && s.id !== "what-we-do")
    : sections;

  // Treatment chips in the home hero come from the nav, so they can never drift from the sitemap.
  const treatments = isHome
    ? global.nav.filter((item) => global.treatmentGroup.includes(item.href))
    : [];

  let stripe = 0;
  let visualCount = 0;

  return (
    <>
      {heroSection ? (
        <HomeHero
          hero={heroSection}
          whatWeDo={whatWeDo}
          global={global}
          ctaLabel={page.ctaLabel}
          treatments={treatments}
        />
      ) : null}

      {body.map((section, index) => {
        const isFirst = !isHome && index === 0;

        let tone: Tone;
        if (DARK_IDS.has(section.id)) {
          tone = "dark";
        } else if (isFirst) {
          tone = "cream";
        } else {
          tone = stripe++ % 2 === 0 ? "light" : "mint";
        }

        const flip = hasVisual(section, page.slug) ? visualCount++ % 2 === 1 : false;
        const shared = { section, page, global, tone } as const;

        // Home sections with their own layout, at the owner's request. Same words.
        if (isHome && section.id === "reviews")
          return <HomeReviewsSection key={section.id} {...shared} />;
        if (isHome && section.id === "first-visit")
          return <HomeVisitSection key={section.id} {...shared} />;
        if (isHome && section.id === "caps") return <HomeCapsSection key={section.id} {...shared} />;

        if (section.type === "faq") return <FaqSection key={section.id} {...shared} />;
        if (section.type === "reviews") return <ReviewsSection key={section.id} {...shared} />;
        if (section.type === "signpost") return <SignpostSection key={section.id} {...shared} />;
        if (section.type === "before-after")
          return <BeforeAfterSection key={section.id} {...shared} />;
        if (section.type === "map")
          return <MapSection key={section.id} {...shared} isFirst={isFirst} />;

        if (isHome && section.id === "dr-abaid")
          return <DoctorSection key={section.id} section={section} page={page} global={global} />;

        if (isHome && section.id === "treatments")
          return <TreatmentGrid key={section.id} {...shared} />;

        // First visit sections with their own layout, at the owner's request. Same words.
        if (page.slug === "first-visit" && section.id === "before-we-start")
          return <BeforeWeStartSection key={section.id} {...shared} />;
        if (page.slug === "first-visit" && section.id === "arrive")
          return <ArriveSection key={section.id} {...shared} />;
        if (page.slug === "first-visit" && section.id === "see-it")
          return <SeeItSection key={section.id} {...shared} />;
        if (page.slug === "first-visit" && section.id === "injection")
          return <InjectionSection key={section.id} section={section} page={page} global={global} />;
        if (page.slug === "first-visit" && section.id === "afterwards")
          return <AfterwardsSection key={section.id} {...shared} />;
        if (page.slug === "first-visit" && section.id === "bad-experience")
          return <BadExperienceSection key={section.id} {...shared} />;
        if (page.slug === "first-visit" && section.id === "cost")
          return <CostSection key={section.id} {...shared} />;

        return <TextSection key={section.id} {...shared} isFirst={isFirst} flip={flip} />;
      })}
    </>
  );
}
