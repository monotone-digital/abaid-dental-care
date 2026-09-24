import Container from "../Container";

export type Tone = "light" | "mint" | "cream" | "dark";

const TONE_BG: Record<Tone, string> = {
  light: "bg-white",
  mint: "bg-mint-50",
  cream: "bg-cream",
  dark: "bg-teal-900",
};

export const headingColour = (tone: Tone) => (tone === "dark" ? "text-white" : "text-ink");
export const bodyColour = (tone: Tone) => (tone === "dark" ? "text-mint/85" : "text-body");
export const subColour = (tone: Tone) => (tone === "dark" ? "text-mint" : "text-body");

export function SectionShell({
  id,
  tone,
  children,
  className = "",
}: {
  id: string;
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id || undefined} className={`scroll-mt-24 ${TONE_BG[tone]} ${className}`}>
      <Container className="py-16 lg:py-24">{children}</Container>
    </section>
  );
}

/**
 * Headline. The words are never touched — the last one (or the last `accentWords`) just
 * carries a teal swash, which is the accent the design reference uses.
 */
export function Headline({
  level,
  tone,
  accent = false,
  accentWords = 1,
  children,
  className = "",
}: {
  level: 1 | 2;
  tone: Tone;
  accent?: boolean;
  accentWords?: number;
  children: string;
  className?: string;
}) {
  const Tag = level === 1 ? "h1" : "h2";
  const size =
    level === 1
      ? "text-[2.1rem] sm:text-[2.7rem] xl:text-[3.15rem]"
      : "text-[1.7rem] sm:text-[2.05rem] xl:text-[2.35rem]";

  const words = children.trim().split(" ");
  const last =
    accent && words.length > accentWords ? words.splice(-accentWords).join(" ") : null;

  return (
    <Tag
      className={`font-display font-bold leading-[1.15] tracking-[-0.02em] ${size} ${headingColour(tone)} ${className}`}
    >
      {last ? words.join(" ") + " " : children}
      {last ? (
        <span className="relative whitespace-nowrap text-accent">
          {last}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            className="absolute -bottom-1 left-0 h-[0.28em] w-full text-accent/55"
          >
            <path
              d="M2 7.5C22 3.5 46 2 60 2s38 1.5 58 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : null}
    </Tag>
  );
}

export function Sub({
  tone,
  children,
  className = "",
}: {
  tone: Tone;
  children: string;
  className?: string;
}) {
  return (
    <p className={`mt-5 max-w-[60ch] text-lg leading-[1.75] ${subColour(tone)} ${className}`}>
      {children}
    </p>
  );
}
