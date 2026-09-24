/**
 * One smooth wash of the site's own teals with a film grain over it: a diagonal from a
 * slightly lighter top-left, through the dark teal, to a barely deeper bottom-right, with a
 * broad lift at the top-left corner. No local pools of dark behind the text. Pure gradients
 * rather than blurred shapes, so it costs nothing to paint on a phone; the grain also hides
 * the banding dark gradients tend to show.
 *
 * Used on the dark bands (the doctor section, the footer). The parent needs
 * `relative isolate overflow-hidden`; `grainId` must be unique on the page.
 */
export default function GradientBackdrop({ grainId }: { grainId: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_0%_0%,color-mix(in_oklab,var(--color-teal-700)_40%,transparent),transparent_70%),radial-gradient(ellipse_70%_60%_at_15%_100%,color-mix(in_oklab,var(--color-teal-700)_22%,transparent),transparent_70%),linear-gradient(135deg,var(--color-teal-800)_0%,var(--color-teal-900)_55%,color-mix(in_oklab,var(--color-teal-900)_88%,black)_100%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.2] mix-blend-overlay">
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </div>
  );
}
