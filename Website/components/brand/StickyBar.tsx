import { getGlobal } from "@/lib/global";
import { getPage } from "@/lib/content";
import { PhoneIcon } from "../Icons";
import { WhatsAppButton } from "./ui";

/**
 * WhatsApp has to be reachable without scrolling on a 360px screen. Below lg this bar is
 * always on screen. Home only for now, so the label is Home's ctaLabel.
 */
export default function StickyBar() {
  const global = getGlobal();
  const label = getPage("")?.ctaLabel || "Message us on WhatsApp";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-warm/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="flex items-stretch gap-2 px-4 py-3">
        <WhatsAppButton href={global.whatsapp} label={label} className="min-w-0 flex-1" />
        <a
          href={global.phone.tel}
          aria-label={"Call " + global.phone.display}
          className="flex w-12 shrink-0 items-center justify-center rounded-lg border border-charcoal/15 bg-white text-charcoal active:border-deep active:text-deep"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
