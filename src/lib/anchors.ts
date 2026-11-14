/**
 * Anchor ids for section headings, so a section can be linked to directly
 * and listed in a table of contents.
 */

export type TocItem = { id: string; label: string };

/** A URL-safe id from a heading: lowercase ASCII words joined by hyphens. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * One id per heading, in order. Repeated headings get `-2`, `-3` and so on,
 * and a heading with no usable characters falls back to `section-N`.
 */
export function headingIds(headings: string[]): string[] {
  const seen = new Map<string, number>();
  return headings.map((heading, index) => {
    const base = slugify(heading) || `section-${index + 1}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}
