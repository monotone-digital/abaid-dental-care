import type { IconKey, Tone } from "./parts";

/**
 * How each inner page is laid out in the new design (rolled out from Home, 24 Sep 2026, at
 * Uzair's request: "redesign all the sections according to the UI", no text-only sections).
 * The words are never touched here: every layout arranges a section's own paragraphs, in their
 * own order. Labels on cards are words already in the copy (a heading's own words, a nav label).
 *
 * Picture keys resolve in ./pictures ("hero-caps", "interior:reception", "render:…").
 */

/** A hero card scrolls to a section further down and is titled with that section's heading. */
export type HeroCard =
  /** Care Teal, with a figure read from the section (its @sub or body). */
  | {
      kind: "figure";
      target: string;
      from: "sub" | "body";
      monthly?: boolean;
      /** Soft rings in the top right corner, as the colour bands have. */
      rings?: boolean;
      /** The card's own title, where Uzair named one; otherwise the section's heading. */
      title?: string;
    }
  | { kind: "photo"; target: string; picture: string; position?: string };

export type HeroLayout = { main: string; mainPosition?: string; cards: HeroCard[] };

export type CompareCard = {
  /** Words from the copy: the heading's own ("Simple", "Surgical") or a nav label. */
  label?: string;
  /** Which of the section's paragraphs (0-based) the card holds. */
  paras: number[];
  icon?: IconKey;
  picture?: string;
  position?: string;
  dark?: boolean;
  /** Repeat the card's "18 to 24 months" large above it (aria-hidden: the paragraph says it). */
  figure?: boolean;
};

export type SectionLayout =
  /** Words beside a photograph; `lead` sets the first paragraph large. */
  | { kind: "split"; picture: string; position?: string; tone?: Tone; flip?: boolean; lead?: boolean; tall?: boolean }
  /** Paragraphs as a grid of cards; `lead` paragraphs sit under the heading, `tail` ones after. */
  | {
      kind: "cards";
      tone?: Tone;
      icons?: IconKey[];
      pictures?: (string | null)[];
      dark?: number;
      lead?: number;
      tail?: number;
      columns?: 2 | 3;
    }
  /** Paragraphs `from`…`from + count` as numbered steps; the rest as notes after them. */
  | {
      kind: "steps";
      tone?: Tone;
      count: number;
      from?: number;
      picture?: string;
      position?: string;
      direction: "row" | "column";
    }
  /** `aside`: the conclusion stands as a card to the right of the two, not a strip below them. */
  | { kind: "compare"; tone?: Tone; cards: CompareCard[]; aside?: boolean }
  /** One paragraph (the answer) set large; the others as cards beside it. */
  | {
      kind: "answer";
      tone?: Tone;
      lead?: "first" | "last";
      icons?: IconKey[];
      picture?: string;
      position?: string;
      plain?: boolean;
    }
  /** Paragraphs `steps` as a payment timeline, figures picked out; the rest as notes. */
  | { kind: "stages"; tone?: Tone; steps: number[] }
  /** Numbered, one line each; with `count`, only the first `count` are numbered, the rest follow as notes. */
  | { kind: "checklist"; picture?: string; position?: string; tone?: Tone; count?: number }
  /** "Label: terms." paragraphs as rows, the label (the words before the colon) beside its terms. */
  | { kind: "terms"; tone?: Tone }
  /** Plain words: the heading on the left, the paragraphs on the right, one of them set large. */
  | { kind: "text"; tone?: Tone; emphasis?: "first" | "last" }
  /** Deep Teal band, the words on the left, a photograph bleeding off the right edge. */
  | { kind: "feature"; picture: string; position?: string }
  | { kind: "cost"; render?: string }
  /** Words beside the page's first consented before/after pair. */
  | { kind: "pair"; tone?: Tone }
  | { kind: "screen"; picture: string; screen?: string; position?: string }
  | { kind: "receipt" }
  | { kind: "prices" }
  | { kind: "paying" }
  | { kind: "qualifications" }
  | { kind: "practice"; picture: string }
  | { kind: "find-us" }
  | { kind: "hours" }
  | { kind: "exterior" };

export type PageLayout = {
  hero?: HeroLayout;
  sections: Record<string, SectionLayout>;
  /** A photograph beside the reviews, when the copy asks for one. */
  reviews?: string;
  signpost?: string[];
};

export const LAYOUTS: Record<string, PageLayout> = {
  "first-visit": {
    hero: {
      main: "hero-first-visit",
      mainPosition: "60% 40%",
      cards: [
        { kind: "figure", target: "cost", from: "body", rings: true, title: "Consultation Fee" },
        { kind: "photo", target: "arrive", picture: "interior:treatment-room", position: "50% 60%" },
      ],
    },
    sections: {
      "before-we-start": { kind: "answer", tone: "white", icons: ["examine"] },
      arrive: {
        kind: "cards",
        columns: 3,
        pictures: ["fv-xray", "fillings-tray", null],
        dark: 2,
      },
      injection: { kind: "feature", picture: "gel-swab", position: "45% 55%" },
      "see-it": { kind: "screen", picture: "fv-screen", position: "30% 45%" },
      afterwards: { kind: "split", picture: "fv-aftercare", tone: "white", flip: true },
      cost: { kind: "receipt" },
    },
  },

  treatments: {
    hero: {
      main: "interior:reception",
      mainPosition: "50% 55%",
      cards: [
        { kind: "photo", target: "prices", picture: "render:hover-caps-and-bridges", position: "70% center" },
        { kind: "photo", target: "final-cost", picture: "fv-xray", position: "50% 55%" },
      ],
    },
    sections: {
      "starting-price": { kind: "split", picture: "crowns-model", lead: true, position: "50% 60%" },
      prices: { kind: "prices" },
      "final-cost": { kind: "steps", tone: "care", count: 3, direction: "row" },
      paying: { kind: "paying" },
    },
  },

  "caps-and-bridges": {
    hero: {
      main: "hero-caps",
      mainPosition: "50% 45%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "materials", picture: "crowns-model", position: "55% 65%" },
      ],
    },
    sections: {
      who: { kind: "cards", columns: 3, icons: ["cap", "bridge", "rootCanal"] },
      // As tooth removal's "What to do afterwards" (Uzair, 25 Sep 2026).
      process: { kind: "checklist", picture: "caps-scan", position: "40% 50%", tone: "white", count: 3 },
      materials: {
        kind: "compare",
        aside: true,
        cards: [
          { label: "PFM", paras: [0], picture: "crown-pfm" },
          { label: "Zirconia", paras: [1], picture: "crown-zirconia" },
        ],
      },
      cost: { kind: "cost", render: "hover-caps-and-bridges" },
      warranty: { kind: "terms", tone: "white" },
    },
  },

  "braces-and-aligners": {
    hero: {
      main: "hero-braces",
      mainPosition: "50% 35%",
      cards: [
        { kind: "figure", target: "payment", from: "body", monthly: true, rings: true },
        { kind: "photo", target: "compare", picture: "aligner-hand", position: "50% 60%" },
      ],
    },
    signpost: ["braces-closeup", "braces-child"],
    sections: {
      // No before/after here any more (Uzair, 25 Sep 2026): the pair is in "Before and after".
      adults: {
        kind: "compare",
        tone: "white",
        cards: [
          { label: "Braces", paras: [0], icon: "braces", figure: true },
          { label: "Clear aligners", paras: [1], icon: "aligner", figure: true },
        ],
      },
      children: { kind: "split", picture: "child-consult", tone: "care", position: "50% 40%", tall: true },
      compare: {
        kind: "compare",
        cards: [
          { label: "Braces", paras: [0], icon: "braces" },
          { label: "Clear aligners", paras: [1], icon: "aligner" },
        ],
      },
      cost: { kind: "cost" },
      payment: { kind: "stages", tone: "white", steps: [0, 1, 2] },
    },
  },

  "root-canal": {
    hero: {
      main: "hero-root-canal",
      mainPosition: "45% 40%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "process", picture: "root-canal-model", position: "50% 40%" },
      ],
    },
    sections: {
      // who, visits, outcome: plain words, one line set large (Uzair, 25 Sep 2026: simpler).
      who: { kind: "text", emphasis: "last" },
      process: {
        kind: "steps",
        tone: "white",
        count: 6,
        direction: "column",
        picture: "fv-xray",
        position: "50% 50%",
      },
      visits: { kind: "text", emphasis: "first" },
      pain: { kind: "feature", picture: "gel-swab", position: "45% 55%" },
      outcome: { kind: "text", tone: "white", emphasis: "first" },
      compare: {
        kind: "compare",
        cards: [
          { label: "Tooth removal", paras: [0, 1], icon: "extraction" },
          { label: "Root canal", paras: [2], icon: "rootCanal", dark: true },
        ],
      },
      cost: { kind: "cost", render: "hover-root-canal" },
    },
    reviews: "interior:treatment-room",
  },

  "tooth-removal": {
    hero: {
      main: "hero-tooth-removal",
      mainPosition: "22% 50%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "simple-or-surgical", picture: "removal-tray", position: "40% 70%" },
      ],
    },
    sections: {
      "simple-or-surgical": {
        kind: "compare",
        cards: [
          { label: "Simple", paras: [0], icon: "extraction" },
          { label: "Surgical", paras: [1], icon: "extraction", dark: true },
        ],
      },
      "on-the-day": { kind: "steps", tone: "care", count: 3, direction: "row" },
      aftercare: { kind: "checklist", picture: "aftercare-food", position: "50% 55%", tone: "white" },
      worries: { kind: "cards", columns: 3, lead: 1, tail: 1, icons: ["drop", "shield", "tablet"] },
      cost: { kind: "cost", render: "hover-tooth-removal" },
      compare: {
        kind: "compare",
        tone: "white",
        cards: [
          { label: "Tooth removal", paras: [0, 1], icon: "extraction" },
          { label: "Root canal", paras: [2], icon: "rootCanal", dark: true },
        ],
      },
    },
  },

  "teeth-cleaning": {
    hero: {
      main: "hero-teeth-cleaning",
      mainPosition: "40% 45%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "enamel", picture: "cleaning-polish", position: "45% 50%" },
      ],
    },
    sections: {
      why: { kind: "answer", tone: "white", plain: true },
      // As tooth removal's "What to do afterwards" (Uzair, 25 Sep 2026).
      process: { kind: "checklist", picture: "cleaning-scaler", position: "50% 45%", count: 2 },
      enamel: { kind: "answer", tone: "white", icons: ["check", "clock"] },
      cost: { kind: "cost", render: "hover-teeth-cleaning" },
    },
    reviews: "interior:treatment-room",
  },

  "teeth-whitening": {
    hero: {
      main: "hero-teeth-whitening",
      mainPosition: "50% 35%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "not-a-cleaning", picture: "cleaning-polish", position: "45% 50%" },
      ],
    },
    sections: {
      "not-a-cleaning": {
        kind: "compare",
        cards: [
          { label: "Teeth cleaning", paras: [0], icon: "cleaning" },
          { label: "Teeth whitening", paras: [1], icon: "whitening", dark: true },
        ],
      },
      options: {
        kind: "compare",
        tone: "white",
        cards: [
          { paras: [0], picture: "whitening-clinic", position: "50% 40%" },
          { paras: [1], picture: "whitening-trays", position: "50% 55%" },
        ],
      },
      longevity: { kind: "answer", icons: ["clock"], picture: "whitening-chai", position: "50% 65%" },
      safety: { kind: "answer", tone: "white", icons: ["shield"] },
      cost: { kind: "cost", render: "hover-teeth-whitening" },
    },
  },

  fillings: {
    hero: {
      main: "hero-fillings",
      mainPosition: "40% 50%",
      cards: [
        { kind: "figure", target: "cost", from: "sub" },
        { kind: "photo", target: "process", picture: "fillings-tray", position: "50% 60%" },
      ],
    },
    sections: {
      process: { kind: "cards", columns: 3, icons: ["filling", "clock", "gel"], dark: 2 },
      // Words only (Uzair, 25 Sep 2026): its before/after pair moved down to "Before and after".
      "front-teeth": { kind: "text", tone: "white", emphasis: "first" },
      cost: { kind: "cost", render: "hover-fillings" },
    },
  },

  about: {
    sections: {
      qualifications: { kind: "qualifications" },
      "how-he-works": { kind: "split", picture: "interior:treatment-room", lead: true, tone: "white", tall: true },
      "what-we-do": { kind: "practice", picture: "treatment" },
      "find-us": { kind: "find-us" },
    },
  },

  contact: {
    sections: {
      hours: { kind: "hours" },
      "getting-here": { kind: "exterior" },
    },
  },
};
