import type { Page, Section } from "@/lib/content";
import { getGlobal, type Global } from "@/lib/global";
import FaqSection from "../FaqSection";
import ReviewsSection from "../ReviewsSection";
import PageHero from "./PageHero";
import { LAYOUTS, type PageLayout } from "./layouts";
import { picture } from "./pictures";
import {
  AboutHero,
  BeforeAfterGallery,
  ContactHero,
  ExteriorSection,
  FindUsSection,
  HoursSection,
  PayingSection,
  PracticeSection,
  PricesSection,
  QualificationsSection,
  ReceiptSection,
  ScreenSection,
  SignpostSection,
} from "./SpecialSections";
import {
  AnswerSection,
  CardsSection,
  ChecklistSection,
  CompareSection,
  CostSection,
  FeatureSection,
  PairSection,
  SplitSection,
  StagesSection,
  StepsSection,
} from "./TextSections";

/**
 * Sections in the approved content that are deliberately not rendered, at the client's
 * request: "message", the closing "Message us for the timings" band. The footer carries the
 * same WhatsApp and call buttons, and the phone bar is always on screen.
 */
const HIDDEN = new Set(["message"]);

/**
 * Sections hidden on one page only, at Uzair's request. The words stay in the content file.
 * First visit, "If last time was bad": removed 24 Sep 2026 (its FAQ question still covers it).
 */
const HIDDEN_ON: Record<string, Set<string>> = {
  "first-visit": new Set(["bad-experience"]),
};

function Body({ section, page, global, layout }: { section: Section; page: Page; global: Global; layout: PageLayout }) {
  const props = { section, page, global };

  if (section.type === "faq") return <FaqSection {...props} picture={picture(layout.faq)} />;
  if (section.type === "reviews") return <ReviewsSection {...props} picture={picture(layout.reviews)} />;
  if (section.type === "signpost") return <SignpostSection {...props} pictures={layout.signpost} />;
  if (section.type === "before-after") return <BeforeAfterGallery {...props} />;
  if (section.type === "map") return <FindUsSection {...props} />;

  const own = layout.sections[section.id];
  switch (own?.kind) {
    case "split":
      return <SplitSection {...props} layout={own} />;
    case "cards":
      return <CardsSection {...props} layout={own} />;
    case "steps":
      return <StepsSection {...props} layout={own} />;
    case "compare":
      return <CompareSection {...props} layout={own} />;
    case "answer":
      return <AnswerSection {...props} layout={own} />;
    case "stages":
      return <StagesSection {...props} layout={own} />;
    case "checklist":
      return <ChecklistSection {...props} layout={own} />;
    case "feature":
      return <FeatureSection {...props} layout={own} />;
    case "cost":
      return <CostSection {...props} layout={own} />;
    case "pair":
      return <PairSection {...props} layout={own} />;
    case "screen":
      return <ScreenSection {...props} layout={own} />;
    case "receipt":
      return <ReceiptSection {...props} />;
    case "prices":
      return <PricesSection {...props} />;
    case "paying":
      return <PayingSection {...props} />;
    case "qualifications":
      return <QualificationsSection {...props} />;
    case "practice":
      return <PracticeSection {...props} layout={own} />;
    case "find-us":
      return <FindUsSection {...props} />;
    case "hours":
      return <HoursSection {...props} />;
    case "exterior":
      return <ExteriorSection {...props} />;
  }

  // A section with no layout of its own still gets one: its paragraphs as cards.
  return <CardsSection {...props} layout={{ kind: "cards", columns: 2 }} />;
}

/** Every page but Home, in the new design. Same words as the content file, in its order. */
export default function ContentPage({ page }: { page: Page }) {
  const global = getGlobal();
  const layout = LAYOUTS[page.slug] ?? { sections: {} };
  const sections = page.sections.filter((s) => !HIDDEN.has(s.id) && !HIDDEN_ON[page.slug]?.has(s.id));
  const hero = sections.find((s) => s.id === "hero");

  let opening = null;
  if (hero) {
    if (page.slug === "about") opening = <AboutHero hero={hero} page={page} global={global} />;
    else if (hero.type === "map") opening = <ContactHero hero={hero} page={page} global={global} />;
    else opening = <PageHero hero={hero} page={page} global={global} layout={layout.hero ?? { main: "", cards: [] }} />;
  }

  return (
    <>
      {opening}
      {sections
        .filter((s) => s !== hero)
        .map((section) => (
          <Body key={section.id} section={section} page={page} global={global} layout={layout} />
        ))}
    </>
  );
}
