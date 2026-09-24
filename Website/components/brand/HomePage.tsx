import type { Page, Section } from "@/lib/content";
import { getGlobal, type Global } from "@/lib/global";
import Markdown from "../Markdown";
import HomeHero from "./HomeHero";
import DoctorSection from "./DoctorSection";
import ReviewsSection from "./ReviewsSection";
import TreatmentsSection from "./TreatmentsSection";
import VisitSection from "./VisitSection";
import CapsSection from "./CapsSection";
import FaqSection from "./FaqSection";
import { Actions, Band, Heading } from "./ui";

/**
 * Sections in the approved content that are deliberately not rendered on Home, at the
 * client's request: "message", the closing "Message us for the timings" band (the footer
 * carries the same buttons), and "find-us" (the hero and the footer carry the address and hours).
 */
const HIDDEN = new Set(["message", "find-us"]);

/** A section Home has no bespoke layout for: heading, sub, words and buttons, in the new style. */
function PlainSection({ section, page, global }: { section: Section; page: Page; global: Global }) {
  return (
    <Band id={section.id}>
      <div className="max-w-[46rem]">
        <Heading>{section.heading}</Heading>
        {section.sub ? <p className="mt-4 text-[1.05rem] leading-[1.7] text-copy">{section.sub}</p> : null}
        <Markdown tone="brand" className="mt-6 text-copy">
          {section.body}
        </Markdown>
        <Actions section={section} global={global} ctaLabel={page.ctaLabel} />
      </div>
    </Band>
  );
}

/** Home in the new design. Same words as the content file, in the content file's order. */
export default function HomePage({ page }: { page: Page }) {
  const global = getGlobal();
  const sections = page.sections.filter((s) => !HIDDEN.has(s.id));
  const hero = sections.find((s) => s.id === "hero");
  const whatWeDo = sections.find((s) => s.id === "what-we-do") ?? null;

  return (
    <>
      {hero ? <HomeHero hero={hero} whatWeDo={whatWeDo} global={global} ctaLabel={page.ctaLabel} /> : null}

      {sections
        .filter((s) => s !== hero && s !== whatWeDo)
        .map((section) => {
          const props = { section, page, global };
          const key = section.id;
          switch (section.id) {
            case "dr-abaid":
              return <DoctorSection key={key} {...props} />;
            case "reviews":
              return <ReviewsSection key={key} {...props} />;
            case "treatments":
              return <TreatmentsSection key={key} {...props} />;
            case "first-visit":
              return <VisitSection key={key} {...props} />;
            case "caps":
              return <CapsSection key={key} {...props} />;
          }
          if (section.type === "faq") return <FaqSection key={key} {...props} />;
          return <PlainSection key={key} {...props} />;
        })}
    </>
  );
}
