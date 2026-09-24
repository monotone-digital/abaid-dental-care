import { getGlobal } from "@/lib/global";
import { getCtaLabels } from "@/lib/content";
import StickyBarClient from "./StickyBarClient";

/**
 * WhatsApp has to be reachable without scrolling on a 360px screen, on every page. Below lg
 * this bar is always on screen, labelled with the page's own ctaLabel.
 */
export default function StickyBar() {
  const global = getGlobal();

  return (
    <StickyBarClient
      whatsapp={global.whatsapp}
      tel={global.phone.tel}
      phoneDisplay={global.phone.display}
      ctaLabels={getCtaLabels()}
      defaultCtaLabel="Message us on WhatsApp"
    />
  );
}
