import { ALT, beforeAfter, exterior, interiors, portrait, portraitNamed, site, treatment } from "@/lib/images";

/** Dr Abaid in a white coat, arms crossed: the About page's portrait (Uzair, 24 Sep 2026). */
const WHITE_COAT = "chatgpt-image-sep-24-2026-03-41-01";

/**
 * Every picture the inner pages use, by key. Alt text says what is in the photograph and
 * nothing more (Docs/copy-rules.md, "Images and alt text").
 *
 * Real photographs come from the clinic's own folders; the rest are the generated site set in
 * Public/Images/Site/ (Magnific, Nano Banana Pro, "ultra-realistic" at Uzair's request of
 * 24 Sep 2026). No generated picture shows a dentist's face: only gloved hands, or a back.
 */
const GENERATED: Record<string, string> = {
  "hero-caps": "A ceramic crown held up in a gloved hand, with a patient in the dental chair behind",
  "hero-braces": "A teenage boy with braces smiling in the dental chair",
  "hero-root-canal": "A patient in the dental chair looking at a dental X-ray on a screen",
  "hero-tooth-removal": "A patient biting on a gauze pad in the dental chair",
  "hero-teeth-cleaning": "A patient having her teeth cleaned in the dental chair",
  "hero-teeth-whitening": "A shade guide held beside a patient's front teeth",
  "hero-fillings": "A curing light held over a filling in a back tooth",
  "hero-first-visit": "A patient talking in the dental chair",
  "removal-tray": "Extraction instruments and gauze pads on a tray",
  "crowns-model": "A plaster model of the upper teeth with a crown on a front tooth and one on a back tooth",
  "crown-pfm": "A PFM crown, showing the metal inside the porcelain",
  "crown-zirconia": "A zirconia crown",
  "caps-scan": "A scan of a patient's teeth being taken, shown on a screen beside the chair",
  "root-canal-model": "A model of a molar cut in half, showing the pulp chamber and root canals",
  "gel-swab": "Anaesthetic gel being put on the gum with a cotton bud",
  "aftercare-food": "Yoghurt, khichdi, a glass of water and a strip of tablets on a table",
  "cleaning-polish": "Front teeth being polished with a rubber cup",
  "cleaning-scaler": "A scaler clearing tartar at the gum line of the lower front teeth",
  "whitening-clinic": "A patient in the dental chair under a whitening lamp",
  "whitening-trays": "Take-home whitening trays in their case",
  "whitening-chai": "A cup of tea and a mug of coffee on a table",
  "braces-child": "A girl in the dental chair with her mother's hand on her shoulder",
  "child-consult": "A boy and his mother in the dental clinic looking at a model of teeth",
  "aligner-hand": "A clear aligner held in front of a smile",
  "braces-closeup": "A smile with braces",
  "fillings-tray": "A shade guide, filling material and a curing light on a tray",
  "fv-screen": "A patient looking at a picture of his own tooth on a screen beside the chair",
  "fv-screen-tooth": "A back tooth shown large on the screen beside the chair",
  "fv-xray": "A dental X-ray on a screen",
  "fv-aftercare": "A strip of capsules, a strip of tablets and a glass of water",
};

/** The clinic's own interiors, by the time stamp in the file name, and what each one shows. */
const INTERIORS: Record<string, { match: string; alt: string }> = {
  reception: { match: "17.30.33", alt: "Reception at Abaid Dental Care" },
  "reception-side": { match: "17.30.34.avif", alt: "Reception at Abaid Dental Care" },
  waiting: { match: "17.30.31", alt: "The waiting area at Abaid Dental Care" },
  corridor: { match: "17.30.34-1", alt: "The waiting area at Abaid Dental Care" },
  "treatment-room": { match: "17.38.07", alt: ALT.interior },
};

export type Picture = { src: string; alt: string };

/**
 * "hero-caps" (generated), "interior:reception", "exterior", "treatment", "portrait:white-coat",
 * "portrait", or "render:hover-fillings" (a decorative 3D render: empty alt).
 */
export function picture(key: string | undefined): Picture | null {
  if (!key) return null;
  const [kind, name] = key.includes(":") ? key.split(":") : [key, ""];

  if (kind === "interior") {
    const entry = INTERIORS[name];
    const src = entry ? interiors().find((s) => s.includes(entry.match)) : null;
    return src && entry ? { src, alt: entry.alt } : null;
  }
  if (kind === "exterior") {
    const src = exterior();
    return src ? { src, alt: ALT.exterior } : null;
  }
  if (kind === "treatment") {
    const src = treatment();
    return src ? { src, alt: ALT.treatment } : null;
  }
  if (kind === "portrait") {
    // The white-coat photograph belongs to the About page (Uzair, 24 Sep 2026).
    const src = name === "white-coat" ? portraitNamed(WHITE_COAT) ?? portrait() : portrait();
    return src ? { src, alt: ALT.portrait } : null;
  }
  if (kind === "render") {
    const src = site(name);
    return src ? { src, alt: "" } : null;
  }
  const src = site(kind);
  return src ? { src, alt: GENERATED[kind] ?? "" } : null;
}

/** The first consented before/after pair for a page, or null. */
export function firstPair(slug: string) {
  return beforeAfter(slug)[0] ?? null;
}
