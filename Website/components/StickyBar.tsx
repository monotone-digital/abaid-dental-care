import { getGlobal } from "@/lib/global";
import { getCtaLabels } from "@/lib/content";
import StickyBarClient from "./StickyBarClient";

/**
 * WhatsApp has to be reachable without scrolling on a 360px screen, on every page.
 * This is how that is guaranteed.
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
