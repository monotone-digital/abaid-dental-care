/**
 * The side gutter. "page": 180px exactly from the xl breakpoint up, tapering down for phones.
 *
 * "header": the same, except between xl and roughly 1590px, where the full desktop header
 * (logo, five nav items, call and WhatsApp buttons: about 1,180px with the longest page
 * label, "Message us to book a consultation") would not fit inside 180px gutters. There the
 * gutter shrinks just enough to leave a 76rem (1,216px) row, never below 2rem, and reaches
 * 180px again once the window is wide enough. The address bar uses it too, so the two
 * header rows stay aligned with each other.
 *
 * "brandHeader": the new design's one-row header (Home, for now). Its row needs about
 * 1,060px, so it keeps a 67rem (1,072px) row and meets the page's 180px gutter from
 * roughly 1,430px up.
 */
const GUTTER = {
  page: "px-5 sm:px-8 lg:px-14 xl:px-[180px]",
  header: "px-5 sm:px-8 lg:px-14 xl:px-[clamp(2rem,calc((100%_-_76rem)/2),180px)]",
  brandHeader: "px-5 sm:px-8 lg:px-14 xl:px-[clamp(2rem,calc((100%_-_67rem)/2),180px)]",
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
