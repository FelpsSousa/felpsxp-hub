/**
 * Site search over a small static index built at build time
 * (`/search-index.json`). Matching is hand-written: every word of the query
 * must appear in an entry, accents and case are ignored, and title matches
 * rank first. No dependency, no request leaves the site.
 */

export type SearchEntryKind = 'page' | 'project' | 'section';

export type SearchEntry = {
  kind: SearchEntryKind;
  title: string;
  description: string;
  /** Locale-free path, optionally with a `#fragment`. */
  href: string;
  /** Extra words that should find this entry (stack, tags, domains). */
  keywords: string;
};

/** Lowercase ASCII-ish text for matching: accents removed, spaces collapsed. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function score(entry: SearchEntry, terms: string[]): number {
  const title = normalize(entry.title);
  const body = normalize(`${entry.description} ${entry.keywords}`);
  let total = 0;

  for (const term of terms) {
    if (title.startsWith(term)) total += 6;
    else if (title.split(' ').some((word) => word.startsWith(term))) total += 4;
    else if (title.includes(term)) total += 3;
    else if (body.split(/[^a-z0-9]+/).some((word) => word.startsWith(term))) total += 2;
    else if (body.includes(term)) total += 1;
    else return 0;
  }
  // Pages and projects before the sections inside them, at equal score.
  return total + (entry.kind === 'section' ? 0 : 0.5);
}

/** The best matches for a query, best first; an empty query returns nothing. */
export function searchEntries(
  entries: readonly SearchEntry[],
  query: string,
  limit = 8,
): SearchEntry[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return [];

  return entries
    .map((entry, index) => ({ entry, index, score: score(entry, terms) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((result) => result.entry);
}

/** A short excerpt for the index: whole words, at most `max` characters. */
export function excerpt(text: string, max = 140): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
