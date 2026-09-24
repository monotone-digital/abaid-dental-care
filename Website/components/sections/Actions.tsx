import type { Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { resolved } from "@/lib/global";
import { CallButton, MapsButton, TextLink, WhatsAppButton } from "../Buttons";
import type { Tone } from "./Shell";

/** Every button a section can ask for, in the order the copy puts them. */
export default function Actions({
  section,
  global,
  ctaLabel,
  tone,
  className = "mt-8",
}: {
  section: Section;
  global: Global;
  ctaLabel: string;
  tone: Tone;
  className?: string;
}) {
  const mapsUrl = section.maps ? resolved(global.maps.url) : null;
  if (!section.cta && !section.call && !mapsUrl && !section.link) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {mapsUrl && section.maps ? <MapsButton href={mapsUrl} label={section.maps} /> : null}
        {section.cta ? <WhatsAppButton href={global.whatsapp} label={ctaLabel} /> : null}
        {section.call ? (
          <CallButton
            href={global.phone.tel}
            label={global.phone.callLabel}
            variant={tone === "dark" ? "dark" : "light"}
          />
        ) : null}
        {section.link ? (
          <TextLink
            href={section.link.href}
            label={section.link.label}
            variant={tone === "dark" ? "dark" : "light"}
          />
        ) : null}
      </div>

      {section.beside ? (
        <p className={`mt-4 text-[0.92rem] ${tone === "dark" ? "text-mint/80" : "text-muted"}`}>
          {section.beside}
        </p>
      ) : null}
    </div>
  );
}
