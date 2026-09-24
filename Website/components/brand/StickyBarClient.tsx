"use client";

import { usePathname } from "next/navigation";
import { PhoneIcon } from "../Icons";
import { WhatsAppButton } from "./ui";

const normalise = (path: string) => (path !== "/" ? path.replace(/\/+$/, "") : "/");

export default function StickyBarClient({
  whatsapp,
  tel,
  phoneDisplay,
  ctaLabels,
  defaultCtaLabel,
}: {
  whatsapp: string;
  tel: string;
  phoneDisplay: string;
  ctaLabels: Record<string, string>;
  defaultCtaLabel: string;
}) {
  const pathname = normalise(usePathname() ?? "/");
  const label = ctaLabels[pathname] ?? defaultCtaLabel;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-warm/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="flex items-stretch gap-2 px-4 py-3">
        <WhatsAppButton href={whatsapp} label={label} className="min-w-0 flex-1" />
        <a
          href={tel}
          aria-label={"Call " + phoneDisplay}
          className="flex w-12 shrink-0 items-center justify-center rounded-lg border border-charcoal/15 bg-white text-charcoal active:border-deep active:text-deep"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
