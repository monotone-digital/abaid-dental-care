import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TOOTH =
  "M12 4.2c-1.9 0-2.6-.9-4.3-.9C5.9 3.3 5 5 5 7.6c0 2.2.5 3.4 1 5.2.4 1.5.7 2.9.9 4.5.1.9.5 1.5 1.2 1.5s1.1-.7 1.3-1.5l.5-2.6c.1-.6.6-1 1.1-1s1 .4 1.1 1l.5 2.6c.2.8.5 1.5 1.3 1.5s1.1-.6 1.2-1.5c.2-1.6.5-3 .9-4.5.5-1.8 1-3 1-5.2 0-2.6-.9-4.3-2.7-4.3-1.7 0-2.4.9-4.3.9Z";

const Svg = ({ children, ...props }: Props & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    {children}
  </svg>
);

/* ---------- interface ---------- */

/** The standard WhatsApp glyph (Simple Icons, CC0), so every WhatsApp button reads as WhatsApp. */
export const WhatsAppIcon = (props: Props) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
    />
  </Svg>
);

export const PhoneIcon = (props: Props) => (
  <Svg {...props}>
    <path
      {...line}
      d="M6.3 3.5h2.1l1.4 3.5-1.7 1.2a11 11 0 0 0 4.9 4.9l1.2-1.7 3.5 1.4v2.1a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.3 5.7a2 2 0 0 1 2-2.2Z"
    />
  </Svg>
);

export const ArrowUpRight = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />
  </Svg>
);

export const ArrowRight = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5" />
  </Svg>
);

export const ChevronDown = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Svg>
);

export const PlusIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const MinusIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M5.5 12h13" />
  </Svg>
);

export const MapPinIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M12 21c4.2-4.4 6.3-7.6 6.3-10.3a6.3 6.3 0 1 0-12.6 0C5.7 13.4 7.8 16.6 12 21Z" />
    <circle {...line} cx="12" cy="10.5" r="2.3" />
  </Svg>
);

export const ClockIcon = (props: Props) => (
  <Svg {...props}>
    <circle {...line} cx="12" cy="12" r="8.5" />
    <path {...line} d="M12 7v5.2l3.2 2" />
  </Svg>
);

export const QuoteIcon = (props: Props) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M9.4 5.5c-3 1.3-4.9 4-4.9 7.4 0 3.3 1.8 5.6 4.4 5.6 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.4-1.7 1.7-3.2 3.4-4.1l-2.3-2.4Zm9.1 0c-3 1.3-4.9 4-4.9 7.4 0 3.3 1.8 5.6 4.4 5.6 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-1 .2.4-1.7 1.7-3.2 3.4-4.1l-2.3-2.4Z"
    />
  </Svg>
);

export const ToothLogo = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
  </Svg>
);

/* ---------- treatments ---------- */

export const CapIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M6.2 10.4c1.6 1 3.5 1.5 5.8 1.5s4.2-.5 5.8-1.5" />
  </Svg>
);

export const BridgeIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M3.2 9.2c0-1.7.7-2.7 2-2.7s1.8.7 3 .7 1.7-.7 3-.7 1.8.7 3 .7 1.7-.7 3-.7c1.3 0 2 1 2 2.7" />
    <path {...line} d="M4.4 9.2c.2 2.3.6 3.6 1 5.2.3 1.2.5 2.2.6 3.3.1.7.4 1.2 1 1.2s.9-.5 1-1.2l.4-2c.1-.5.5-.8.9-.8s.8.3.9.8l.4 2c.1.7.4 1.2 1 1.2s.9-.5 1-1.2l.4-2c.1-.5.5-.8.9-.8s.8.3.9.8l.4 2c.1.7.4 1.2 1 1.2s.9-.5 1-1.2c.1-1.1.3-2.1.6-3.3.4-1.6.8-2.9 1-5.2" />
  </Svg>
);

export const RootCanalIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M12 7.6v4.3M9.6 17.4l1.3-5.5M14.4 17.4l-1.3-5.5" />
  </Svg>
);

export const ExtractionIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M19.4 4.8 15.6 8.6m0-3.8h3.8v3.8" />
  </Svg>
);

export const CleaningIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M18.6 3.2v2.6m1.3-1.3h-2.6M6.2 2.6v1.8M7.1 3.5H5.3" />
  </Svg>
);

export const FillingIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M10 8.4h4l-.7 2.6h-2.6Z" />
  </Svg>
);

export const WhiteningIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d={TOOTH} />
    <path {...line} d="M12 6.4 12.8 8l1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7L9.5 8.3 11.2 8Z" />
  </Svg>
);

export const BracesIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M4 7.6c0-1.6.7-2.6 2-2.6 1.2 0 1.8.7 3 .7s1.8-.7 3-.7 1.8.7 3 .7 1.8-.7 3-.7c1.3 0 2 1 2 2.6 0 2-.5 3.2-1 4.8-.4 1.4-.6 2.6-.8 4.1-.1.8-.4 1.3-1 1.3s-.9-.6-1-1.4" />
    <path {...line} d="M6.8 16.5c-.1.8-.4 1.4-1 1.4s-.9-.5-1-1.3" />
    <path {...line} d="M3.6 12.4h16.8" />
    <rect {...line} x="9.6" y="10.7" width="4.8" height="3.4" rx="1" />
  </Svg>
);

/* ---------- social ---------- */

export const FacebookIcon = (props: Props) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.13V9.9H7.5V13h2.78v8h3.22Z"
    />
  </Svg>
);

export const InstagramIcon = (props: Props) => (
  <Svg {...props}>
    <rect {...line} x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle {...line} cx="12" cy="12" r="3.9" />
    <circle fill="currentColor" cx="16.9" cy="7.1" r="1.1" />
  </Svg>
);

export const TikTokIcon = (props: Props) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M16.2 3h-2.6v11.2a2.3 2.3 0 1 1-1.9-2.26V9.3a4.9 4.9 0 1 0 4.5 4.88V8.9a5.6 5.6 0 0 0 3.3 1.07V7.4a3.2 3.2 0 0 1-3.3-3.2V3Z"
    />
  </Svg>
);

export const YouTubeIcon = (props: Props) => (
  <Svg {...props}>
    <path
      fill="currentColor"
      d="M21.2 8.1a2.4 2.4 0 0 0-1.7-1.7C18 6 12 6 12 6s-6 0-7.5.4A2.4 2.4 0 0 0 2.8 8.1 25 25 0 0 0 2.4 12c0 1.3.1 2.6.4 3.9a2.4 2.4 0 0 0 1.7 1.7C6 18 12 18 12 18s6 0 7.5-.4a2.4 2.4 0 0 0 1.7-1.7c.3-1.3.4-2.6.4-3.9 0-1.3-.1-2.6-.4-3.9ZM10.2 14.6V9.4L14.7 12l-4.5 2.6Z"
    />
  </Svg>
);

export const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
} as const;

export const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
} as const;

export const AlignerIcon = (props: Props) => (
  <Svg {...props}>
    <path
      {...line}
      d="M4.6 6.8c0-1.9 1.4-3.3 3.2-3.3 1.6 0 2.5 1.1 4.2 1.1s2.6-1.1 4.2-1.1c1.8 0 3.2 1.4 3.2 3.3 0 5.3-3.3 9.8-7.4 9.8S4.6 12.1 4.6 6.8Z"
    />
    <path
      {...line}
      d="M7.2 7.3c0-1 .7-1.7 1.6-1.7.9 0 1.5.6 3.2.6s2.3-.6 3.2-.6c.9 0 1.6.7 1.6 1.7 0 3.6-2.2 6.6-4.8 6.6S7.2 10.9 7.2 7.3Z"
    />
  </Svg>
);

/* ---------- first visit ---------- */

/** A tooth under a magnifying glass: what is wrong. */
export const ExamineIcon = (props: Props) => (
  <Svg {...props}>
    <circle {...line} cx="10.5" cy="10.5" r="6.5" />
    <path {...line} d="m15.4 15.4 4.8 4.8" />
    <path
      {...line}
      d="M10.5 7.6c-.8 0-1.1-.4-1.9-.4-.8 0-1.2.8-1.2 1.9 0 1 .3 1.6.5 2.4.2.7.3 1.3.4 2 .1.4.2.6.5.6s.5-.3.6-.7l.2-1.1c0-.3.3-.4.5-.4s.4.2.5.4l.2 1.1c.1.4.3.7.6.7s.4-.2.5-.6c.1-.7.2-1.3.4-2 .2-.8.5-1.4.5-2.4 0-1.1-.4-1.9-1.2-1.9-.8 0-1.1.4-1.9.4Z"
    />
  </Svg>
);

/** A price tag: what it costs. */
export const PriceTagIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M3.5 12.2V4.8c0-.7.6-1.3 1.3-1.3h7.4c.4 0 .7.1.9.4l7.4 7.4c.5.5.5 1.3 0 1.8l-7.4 7.4c-.5.5-1.3.5-1.8 0l-7.4-7.4c-.3-.2-.4-.5-.4-.9Z" />
    <circle {...line} cx="8" cy="8" r="1.4" />
  </Svg>
);

/** A calendar with a forward arrow: what happens next. */
export const NextStepIcon = (props: Props) => (
  <Svg {...props}>
    <rect {...line} x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path {...line} d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path {...line} d="M9 14.8h6m-2.2-2.2 2.2 2.2-2.2 2.2" />
  </Svg>
);

export const CheckIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="m5 12.5 4.2 4.2L19 7" />
  </Svg>
);

/** A tube of anaesthetic gel, standing on its crimped end, with a drop at the nozzle. */
export const GelIcon = (props: Props) => (
  <Svg {...props}>
    <rect {...line} x="7" y="19.2" width="10" height="2.3" rx=".6" />
    <path {...line} d="M7.8 19.2 9 10.2h6l1.2 9" />
    <path {...line} d="M9 10.2 10.4 8h3.2l1.4 2.2" />
    <path {...line} d="M10.8 8V5.6h2.4V8" />
    <path {...line} d="M12 1.5s-.9 1-.9 1.7a.9.9 0 0 0 1.8 0c0-.7-.9-1.7-.9-1.7Z" />
    <path {...line} d="M9.9 14.4h4.2" />
  </Svg>
);

/** A spray bottle with a fine mist. */
export const SprayIcon = (props: Props) => (
  <Svg {...props}>
    <rect {...line} x="6" y="10" width="8" height="10.5" rx="2" />
    <path {...line} d="M8 10V7.5h4V10M9 7.5V5h5.5l1 1.5H14" />
    <path {...line} d="M17.5 5.2h.01M19.5 4h.01M19.5 6.6h.01M21 5.3h.01" strokeWidth={2.2} />
  </Svg>
);

/** A two-part capsule: antibiotics. */
export const CapsuleIcon = (props: Props) => (
  <Svg {...props}>
    <rect {...line} x="2.8" y="8.6" width="18.4" height="6.8" rx="3.4" transform="rotate(-40 12 12)" />
    <path {...line} d="m9.8 9.4 4.4 5.2" />
  </Svg>
);

/** Two round tablets, one scored: painkillers. */
export const TabletIcon = (props: Props) => (
  <Svg {...props}>
    <circle {...line} cx="9" cy="9.5" r="5.5" />
    <path {...line} d="m5.1 13.4 7.8-7.8" />
    <circle {...line} cx="16.5" cy="16.5" r="4" />
  </Svg>
);

/** A speech bubble: a conversation, nothing more. */
export const ChatIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M4 6.8C4 5.3 5.2 4 6.8 4h10.4C18.8 4 20 5.3 20 6.8v7.1c0 1.5-1.2 2.8-2.8 2.8H10l-4.2 3.3v-3.3A2.8 2.8 0 0 1 4 13.9V6.8Z" />
    <path {...line} d="M8.3 9.3h7.4M8.3 12.4h4.6" />
  </Svg>
);

/** A shield with a tick: something is covered. */
export const ShieldCheckIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M12 3.2 5 5.8v5.6c0 4.3 2.9 7.8 7 9.4 4.1-1.6 7-5.1 7-9.4V5.8l-7-2.6Z" />
    <path {...line} d="m8.8 12.2 2.3 2.3 4.3-4.6" />
  </Svg>
);

/** A crown with arrows round it: re-cemented. */
export const RecementIcon = (props: Props) => (
  <Svg {...props}>
    <path {...line} d="M9.2 9.2h5.6l-.6 5.2c-.1.6-.5 1-1.1 1h-2.2c-.6 0-1-.4-1.1-1l-.6-5.2Z" />
    <path {...line} d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3M4.5 12a7.5 7.5 0 0 1 12.8-5.3" />
    <path {...line} d="M17.6 3.8v3h-3M6.4 20.2v-3h3" />
  </Svg>
);
