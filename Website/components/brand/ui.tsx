import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/content";
import type { Global } from "@/lib/global";
import { resolved } from "@/lib/resolved";
import Container from "../Container";
import { ArrowUpRight, MapPinIcon, PhoneIcon, WhatsAppIcon } from "../Icons";

/**
 * The new brand's building blocks (September 2026 direction): Warm White ground, Care Teal
 * surfaces, Deep Teal for actions, Coral for small accents, Charcoal (the logo's black) for
 * words. Every page is built from them (Home from 24 Sep 2026, the rest from the rollout after).
 *
 * Text never sits in white on Care Teal or Coral — both fall below 3:1 — so text on those
 * surfaces is Charcoal, and white text only appears on Deep Teal.
 */

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-deep";

/** The tooth from the logo, as a small icon. Decorative: the words beside it carry the meaning. */
export function Mark({ white = false, className = "h-4 w-4" }: { white?: boolean; className?: string }) {
  return (
    <Image
      src={white ? "/brand/mark-white.png" : "/brand/mark.png"}
      alt=""
      width={128}
      height={128}
      className={`shrink-0 ${className}`}
    />
  );
}

/** Eyebrow label above a section heading. Its words must be approved copy (a nav label, say). */
export function Pill({
  children,
  on = "warm",
  className = "",
}: {
  children: React.ReactNode;
  on?: "warm" | "white" | "care";
  className?: string;
}) {
  const bg = { warm: "bg-warm-200", white: "bg-warm", care: "bg-white/70" }[on];
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full ${bg} py-1.5 pl-2.5 pr-3.5 text-[0.82rem] font-semibold text-charcoal ${className}`}
    >
      <Mark className="h-4 w-4" />
      {children}
    </p>
  );
}

/* ---------------- buttons ---------------- */

const labelBase =
  "inline-flex items-center justify-center rounded-lg px-5 py-3.5 text-[0.95rem] font-semibold leading-tight transition-colors duration-300";
const squareBase =
  "flex w-12 shrink-0 items-center justify-center rounded-lg transition-colors duration-300";

/**
 * The primary action on every page: a Deep Teal label with the WhatsApp mark in a Care Teal
 * square beside it, the split button of the reference design. Nothing pre-filled on the link.
 * `onDark` (the Deep Teal footer) turns the label white so it doesn't vanish into the ground.
 */
export function WhatsAppButton({
  href,
  label,
  className = "",
  compact = false,
  onDark = false,
  onCare = false,
}: {
  href: string;
  label: string;
  className?: string;
  compact?: boolean;
  onDark?: boolean;
  /** On the Care Teal band the WhatsApp square turns white, or it would vanish into the ground. */
  onCare?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-stretch gap-1 rounded-lg ${onDark ? "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white" : focus} ${className}`}
    >
      <span
        className={`${labelBase} min-w-0 flex-1 ${
          onDark ? "bg-white text-deep group-hover:bg-care-100" : "bg-deep text-white group-hover:bg-deep-700"
        } ${compact ? "px-4 py-3 text-[0.9rem]" : ""}`}
      >
        <span className="truncate">{label}</span>
      </span>
      <span
        className={`${squareBase} ${onCare ? "bg-white text-deep" : "bg-care text-charcoal"} ${
          onDark ? "group-hover:bg-white" : "group-hover:bg-deep group-hover:text-white"
        } ${compact ? "w-11" : ""}`}
      >
        <WhatsAppIcon className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-110" />
      </span>
    </a>
  );
}

export function CallButton({
  href,
  label,
  className = "",
  onDark = false,
}: {
  href: string;
  label: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group ${labelBase} gap-2.5 ${
        onDark
          ? "border border-white/25 text-white hover:border-care-100 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
          : `border border-charcoal/15 bg-white text-charcoal hover:border-deep hover:text-deep ${focus}`
      } ${className}`}
    >
      <PhoneIcon className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:rotate-12" />
      {label}
    </a>
  );
}

/** An internal link: white label, Deep Teal arrow square. */
export function LinkButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group inline-flex items-stretch gap-1 rounded-lg ${focus} ${className}`}>
      <span className={`${labelBase} border border-charcoal/12 bg-white text-charcoal group-hover:border-deep`}>
        {label}
      </span>
      <span className={`${squareBase} bg-deep text-white group-hover:bg-charcoal`}>
        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** Google Maps, once the clinic's share URL is in _global.md. Opens in a new tab. */
export function MapsButton({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-stretch gap-1 rounded-lg ${focus} ${className}`}
    >
      <span className={`${labelBase} gap-2.5 bg-deep text-white group-hover:bg-deep-700`}>
        <MapPinIcon className="h-5 w-5" />
        {label}
      </span>
      <span className={`${squareBase} bg-care text-charcoal group-hover:bg-deep group-hover:text-white`}>
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </a>
  );
}

/**
 * Every button a section asks for, in the order the copy puts them. The Maps button leads
 * when a section asks for it (Contact's first screen), and only once the URL is supplied.
 */
export function Actions({
  section,
  global,
  ctaLabel,
  className = "mt-8",
  onDark = false,
  onCare = false,
}: {
  section: Section;
  global: Global;
  ctaLabel: string;
  className?: string;
  onDark?: boolean;
  onCare?: boolean;
}) {
  const mapsUrl = section.maps ? resolved(global.maps.url) : null;
  if (!section.cta && !section.call && !section.link && !mapsUrl) return null;
  return (
    <div className={className}>
      <div className="flex flex-wrap items-stretch gap-3">
        {mapsUrl && section.maps ? <MapsButton href={mapsUrl} label={section.maps} /> : null}
        {section.cta ? <WhatsAppButton href={global.whatsapp} label={ctaLabel} onDark={onDark} onCare={onCare} /> : null}
        {section.call ? (
          <CallButton href={global.phone.tel} label={global.phone.callLabel} onDark={onDark} />
        ) : null}
        {section.link ? <LinkButton href={section.link.href} label={section.link.label} /> : null}
      </div>
      {section.beside ? (
        <p className={`mt-3.5 text-[0.9rem] ${onDark ? "text-white/75" : "text-hint"}`}>{section.beside}</p>
      ) : null}
    </div>
  );
}

/* ---------------- the notched corner ---------------- */

/**
 * The reference's signature detail: a card's corner cut away in the ground colour, with an
 * arrow square sitting in the gap and both edges curving into it. The card sets the ground
 * colour as `--notch` (Tailwind: `[--notch:var(--color-warm)]`) and must be `relative`.
 * Decorative: the card itself is the link.
 */
export function Notch({
  corner = "br",
  small = false,
  down = false,
}: {
  corner?: "br" | "tr";
  small?: boolean;
  /** The card scrolls down the page rather than opening another: the arrow points down. */
  down?: boolean;
}) {
  const box = small ? "h-9 w-9 rounded-[0.6rem]" : "h-11 w-11 rounded-[0.7rem]";
  // Each fillet is a 1rem square whose far corner is the ground colour, cut by a quarter circle.
  const fillet =
    corner === "br"
      ? "bg-[radial-gradient(circle_at_0_0,transparent_1rem,var(--notch)_calc(1rem_+_0.5px))]"
      : "bg-[radial-gradient(circle_at_0_100%,transparent_1rem,var(--notch)_calc(1rem_+_0.5px))]";

  return (
    <span
      aria-hidden="true"
      className={`absolute right-0 bg-(color:--notch) ${
        corner === "br" ? "bottom-0 rounded-tl-2xl pl-1.5 pt-1.5" : "top-0 rounded-bl-2xl pb-1.5 pl-1.5"
      }`}
    >
      <span
        className={`flex ${box} items-center justify-center bg-deep text-white transition-colors duration-300 group-hover:bg-charcoal`}
      >
        <ArrowUpRight
          className={`h-4.5 w-4.5 transition-transform duration-300 ${
            down
              ? "rotate-90 motion-safe:group-hover:translate-y-0.5"
              : "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          }`}
        />
      </span>
      <span
        className={`absolute right-0 h-4 w-4 ${fillet} ${corner === "br" ? "bottom-full" : "top-full"}`}
      />
      <span className={`absolute right-full h-4 w-4 ${fillet} ${corner === "br" ? "bottom-0" : "top-0"}`} />
    </span>
  );
}

/* ---------------- over photographs ---------------- */

/** A small white card floating over a photograph. Always restates something already on the page. */
export function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgb(35_31_32/0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- type ---------------- */

export function Heading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-charcoal sm:text-[2.5rem] xl:text-[2.85rem] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Band({
  id,
  children,
  className = "",
  inner = "py-16 lg:py-24",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  inner?: string;
}) {
  return (
    <section id={id || undefined} className={`scroll-mt-24 ${className}`}>
      <Container className={inner}>{children}</Container>
    </section>
  );
}

/** "Muhammad Arshad R." -> "MA": a monogram drawn from the name itself. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

export const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
