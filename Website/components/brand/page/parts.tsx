import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import type { Page, Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import Container from "../../Container";
import Markdown from "../../Markdown";
import {
  AlignerIcon,
  BracesIcon,
  BridgeIcon,
  CapIcon,
  CapsuleIcon,
  ChatIcon,
  CheckIcon,
  CleaningIcon,
  ClockIcon,
  DropIcon,
  ExamineIcon,
  ExtractionIcon,
  FillingIcon,
  GelIcon,
  MapPinIcon,
  NextStepIcon,
  ParkingIcon,
  PriceTagIcon,
  RecementIcon,
  RootCanalIcon,
  ShieldCheckIcon,
  TabletIcon,
  WhiteningIcon,
} from "../../Icons";
import type { Picture } from "./pictures";

export type Props = { section: Section; page: Page; global: Global };

/**
 * The page's ground rhythm, after the reference: most sections on Warm White with white
 * cards; "white" is a full-width white band; "care" the full-width Care Teal band (Charcoal
 * words, never white); "deep" the Deep Teal band (the only place white words sit); "panel" a
 * Care Teal tint inset from the page edges, as the reference's closing panel.
 */
export type Tone = "warm" | "white" | "care" | "deep" | "panel";

export const onDeep = (tone: Tone) => tone === "deep";

export const ICONS = {
  aligner: AlignerIcon,
  braces: BracesIcon,
  bridge: BridgeIcon,
  cap: CapIcon,
  capsule: CapsuleIcon,
  chat: ChatIcon,
  check: CheckIcon,
  cleaning: CleaningIcon,
  clock: ClockIcon,
  drop: DropIcon,
  examine: ExamineIcon,
  extraction: ExtractionIcon,
  filling: FillingIcon,
  gel: GelIcon,
  pin: MapPinIcon,
  next: NextStepIcon,
  parking: ParkingIcon,
  price: PriceTagIcon,
  recement: RecementIcon,
  rootCanal: RootCanalIcon,
  shield: ShieldCheckIcon,
  tablet: TabletIcon,
  whitening: WhiteningIcon,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconKey = keyof typeof ICONS;

/** A section on its ground. */
export function Band({
  id,
  tone = "warm",
  children,
  className = "",
}: {
  id: string;
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  const ground = {
    warm: "",
    white: "bg-white",
    care: "relative isolate overflow-hidden bg-care",
    deep: "relative isolate overflow-hidden bg-deep",
    panel: "",
  }[tone];

  return (
    <section id={id || undefined} className={`scroll-mt-24 ${ground}`}>
      {tone === "care" || tone === "deep" ? (
        // Soft rings in the corner, as the reference's colour band.
        <div
          aria-hidden="true"
          className={`absolute -right-48 -top-48 -z-10 h-[46rem] w-[46rem] rounded-full ${
            tone === "care"
              ? "bg-[repeating-radial-gradient(circle,transparent_0_3.5rem,rgb(255_255_255/0.14)_3.5rem_calc(3.5rem_+_1px))]"
              : "bg-[repeating-radial-gradient(circle,transparent_0_3.5rem,rgb(255_255_255/0.07)_3.5rem_calc(3.5rem_+_1px))]"
          }`}
        />
      ) : null}
      <Container className="py-16 lg:py-24">
        {tone === "panel" ? (
          <div
            className={`relative isolate overflow-hidden rounded-[2rem] bg-care-100 px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 ${className}`}
          >
            {children}
          </div>
        ) : (
          <div className={className}>{children}</div>
        )}
      </Container>
    </section>
  );
}

/** h2 and @sub, coloured for the ground they sit on. */
export function Intro({
  section,
  tone = "warm",
  className = "",
  size = "default",
}: {
  section: Section;
  tone?: Tone;
  className?: string;
  size?: "default" | "large";
}) {
  const deep = onDeep(tone);
  return (
    <div className={className}>
      <h2
        className={`text-pretty font-normal leading-[1.1] tracking-[-0.03em] ${deep ? "text-white" : "text-charcoal"} ${
          size === "large"
            ? "text-[2.2rem] sm:text-[2.8rem] xl:text-[3.2rem]"
            : "text-[2rem] sm:text-[2.5rem] xl:text-[2.85rem]"
        }`}
      >
        {section.heading}
      </h2>
      {section.sub ? (
        <p className={`mt-4 text-pretty text-[1.05rem] leading-[1.7] ${deep ? "text-white/85" : tone === "care" ? "text-charcoal" : "text-copy"}`}>
          {section.sub}
        </p>
      ) : null}
    </div>
  );
}

/** One paragraph (or several) of approved copy, verbatim, in the brand's prose styles. */
export function Prose({
  children,
  tone = "warm",
  className = "",
}: {
  children: string;
  tone?: Tone;
  className?: string;
}) {
  const deep = onDeep(tone);
  // A colour given in className (a lead line in Charcoal, say) replaces the ground's default.
  const colour = /(^|\s)text-(charcoal|white|deep)(\s|$)/.test(className)
    ? ""
    : deep
      ? "text-white/88"
      : tone === "care"
        ? "text-charcoal"
        : "text-copy";
  return (
    <Markdown tone={deep ? "deep" : "brand"} className={`text-pretty ${colour} ${className}`}>
      {children}
    </Markdown>
  );
}

/** A photograph in a plain rounded frame (no clipping masks: Uzair, 24 Sep 2026). */
export function Photo({
  picture,
  className = "aspect-4/3",
  sizes = "(max-width: 1024px) 95vw, 45vw",
  position = "center",
  priority = false,
  children,
}: {
  picture: Picture;
  className?: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-care-100 ${className}`}>
      <Image
        src={picture.src}
        alt={picture.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {children}
    </div>
  );
}

/** A round icon well, the reference's small markers. */
export function IconWell({ icon, tone = "light", className = "" }: { icon: IconKey; tone?: "light" | "deep" | "care"; className?: string }) {
  const Icon = ICONS[icon];
  const colours = {
    light: "bg-care-100 text-deep",
    deep: "bg-white/12 text-care",
    care: "bg-white text-deep",
  }[tone];
  return (
    <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colours} ${className}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}

/** "01", "02" … as the reference's step markers. Decorative: the list order carries the sequence. */
export const stepNumber = (index: number) => String(index + 1).padStart(2, "0");

/** Splits a paragraph at its sentence ends, keeping every word and mark. */
export const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z"“])/);

/** "From PKR 5,000." -> { lead: "From", figure: "PKR 5,000" }. The words are the copy's own. */
export function priceParts(text: string | null | undefined) {
  if (!text) return null;
  const match = /(from\s+)?(PKR [\d,]+)(\s+a month)?/i.exec(text);
  if (!match) return null;
  return {
    lead: match[1] ? match[1].trim() : null,
    figure: match[2],
    tail: match[3]?.trim() ?? null,
  };
}
