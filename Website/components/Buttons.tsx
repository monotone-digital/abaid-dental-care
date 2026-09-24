import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

export type Variant = "light" | "dark";

/**
 * Motion every CTA shares: on hover it lifts 4px and casts a tinted shadow; when tapped it
 * presses in. Movement sits behind motion-safe, so it switches off for reduced-motion users
 * (they still get the colour and shadow change). Exported for the CTAs that aren't built
 * from the components below — footer, sticky bar, header phone.
 */
export const ctaMotion =
  "transition-[color,background-color,border-color,box-shadow,translate,scale] duration-300 ease-out hover:shadow-xl motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]";

/** Icon motion inside a CTA, triggered by hovering anywhere on the button. */
export const iconMotion = "relative shrink-0 transition-transform duration-300 ease-out";

const base = `group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-semibold ${ctaMotion}`;

const outline: Record<Variant, string> = {
  dark: "border border-line-dark bg-transparent text-white hover:border-teal hover:shadow-black/30",
  light:
    "border border-line bg-white text-ink hover:border-accent hover:text-teal-700 hover:shadow-ink/15",
};

/** A band of light that sweeps across a filled button on hover. */
export function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-2/3 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-[left] duration-0 ease-out motion-safe:group-hover:left-[130%] motion-safe:group-hover:duration-700"
    />
  );
}

/**
 * Colour that fills an outlined button from the left on hover. With reduced motion it
 * appears without the slide.
 */
export function Fill({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none ${
        variant === "dark" ? "bg-teal-800" : "bg-mint-50"
      }`}
    />
  );
}

export function WhatsAppButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-700/35 ${className}`}
    >
      <Sheen />
      <WhatsAppIcon
        className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-115`}
      />
      <span className="relative">{label}</span>
    </a>
  );
}

export function CallButton({
  href,
  label,
  variant = "light",
  className = "",
}: {
  href: string;
  label: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a href={href} className={`${base} ${outline[variant]} ${className}`}>
      <Fill variant={variant} />
      <PhoneIcon
        className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-115`}
      />
      <span className="relative">{label}</span>
    </a>
  );
}

export function MapsButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-ink text-white hover:bg-teal-900 hover:shadow-ink/35 ${className}`}
    >
      <Sheen />
      <MapPinIcon className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:-translate-y-1`} />
      <span className="relative">{label}</span>
    </a>
  );
}

export function TextLink({
  href,
  label,
  variant = "light",
  className = "",
}: {
  href: string;
  label: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${outline[variant]} ${className}`}>
      <Fill variant={variant} />
      <span className="relative">{label}</span>
      <ArrowRight className={`h-4.5 w-4.5 ${iconMotion} motion-safe:group-hover:translate-x-1.5`} />
    </Link>
  );
}

export function ArrowBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white transition-colors group-hover:bg-ink ${className}`}
    >
      <ArrowUpRight className="h-5 w-5" />
    </span>
  );
}
