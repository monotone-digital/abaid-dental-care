"use client";

import { usePathname } from "next/navigation";
import { PhoneIcon, WhatsAppIcon } from "./Icons";
import { ctaMotion } from "./Buttons";

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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-w-0 flex-1 items-center justify-center gap-2.5 rounded-full bg-teal-600 px-4 py-3.5 text-[0.95rem] font-semibold text-white active:bg-teal-700 ${ctaMotion}`}
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">{label}</span>
        </a>
        <a
          href={tel}
          aria-label={"Call " + phoneDisplay}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink active:border-accent active:text-teal-700 ${ctaMotion}`}
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
