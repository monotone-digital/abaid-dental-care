import manifest from "./image-manifest.json";

export type BeforeAfterPair = { id: string; before: string; after: string };

const first = (list: string[]): string | null => list[0] ?? null;

/** Stable pick, so a given section always shows the same interior photograph. */
function pick(list: string[], seed: string): string | null {
  if (!list.length) return null;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return list[hash % list.length];
}

/**
 * Dr Abaid's main portrait, chosen by name so a photo added to the folder later can't take its
 * place just by sorting first (the scrubs photo Uzair gave on 24 Sep 2026). Falls back to the
 * first portrait if that file is ever removed.
 */
const PRIMARY_PORTRAIT = "dr-abaid-khalil-2026-09-24";

export const portrait = (index = 0): string | null => {
  const primary = manifest.portrait.find((src) => src.includes(PRIMARY_PORTRAIT));
  if (index === 0 && primary) return primary;
  return manifest.portrait[index] ?? null;
};
export const exterior = (): string | null => first(manifest.exterior);
export const treatment = (): string | null => first(manifest.treatment);
export const interior = (seed: string): string | null => pick(manifest.interior, seed);
export const interiors = (): string[] => manifest.interior;

export const site = (name: string): string | null =>
  (manifest.site as Record<string, string>)[name] ?? null;

export const beforeAfter = (slug: string): BeforeAfterPair[] =>
  (manifest.beforeAfter as Record<string, BeforeAfterPair[]>)[slug] ?? [];

/** Alt text is what is in the photograph, nothing more. */
export const ALT = {
  portrait: "Dr Abaid Khalil",
  interior: "Treatment room at Abaid Dental Care",
  exterior: "Abaid Dental Care from the street",
  treatment: "Dr Abaid Khalil treating a patient in the dental chair",
} as const;
