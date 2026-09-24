/**
 * Whether a value from _global.md has actually been supplied. Kept apart from lib/global (which
 * reads files) so client components can use it too.
 */
export const isMissing = (value: unknown): boolean =>
  typeof value !== "string" || value.trim() === "" || value.includes("[NEEDS:");

export const resolved = (value: string | undefined): string | null =>
  isMissing(value) ? null : (value as string);
