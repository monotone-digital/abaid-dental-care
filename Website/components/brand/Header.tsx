import { getBrandNavGroups, getGlobal } from "@/lib/global";
import { getCtaLabels } from "@/lib/content";
import Nav from "./Nav";

/**
 * One row, as in the reference: logo, nav, WhatsApp. The address and today's hours, which the
 * current design puts in a bar above the nav, are in the Home hero instead, beside the buttons.
 */
export default function Header() {
  const global = getGlobal();

  return (
    <Nav
      items={getBrandNavGroups(global)}
      clinic={global.clinic}
      whatsapp={global.whatsapp}
      tel={global.phone.tel}
      phoneDisplay={global.phone.display}
      ctaLabels={getCtaLabels()}
      defaultCtaLabel="Message us on WhatsApp"
    />
  );
}
