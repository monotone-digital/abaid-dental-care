/**
 * The side gutter. "page": 180px exactly from the xl breakpoint up, tapering down for phones.
 *
 * "brandHeader": the one-row header (logo, nav, WhatsApp). With the longest page label
 * ("Message us to book a consultation", on Braces) its row needs about 1,100px, so it keeps a
 * 70rem (1,120px) row, never less than a 2rem gutter, and meets the page's 180px gutter from
 * roughly 1,480px up.
 */
const GUTTER = {
  page: "px-5 sm:px-8 lg:px-14 xl:px-[180px]",
  brandHeader: "px-5 sm:px-8 lg:px-14 xl:px-[clamp(2rem,calc((100%_-_70rem)/2),180px)]",
} as const;

export default function Container({
  children,
  className = "",
  gutter = "page",
}: {
  children: React.ReactNode;
  className?: string;
  gutter?: keyof typeof GUTTER;
}) {
  return <div className={`${GUTTER[gutter]} ${className}`}>{children}</div>;
}
