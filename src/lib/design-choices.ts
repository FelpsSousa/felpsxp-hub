/**
 * The variation in use for each item of the visual standard on /design
 * (ADR-0012). A plain module, so server pages read the values themselves (a
 * value exported from a client component would reach them as a reference).
 * `decided` marks the items Felipe settled; the others are still open, and
 * /design shows more options for them.
 */
export type OptionLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

export const designChoices = {
  navCurrent: { inUse: 'a', decided: true },
  statusBadge: { inUse: 'c', decided: true },
  projectCard: { inUse: 'c', decided: true },
  sectionLabel: { inUse: 'c', decided: false },
  numbers: { inUse: 'a', decided: false },
  xpBadge: { inUse: 'b', decided: false },
  projectSections: { inUse: 'b', decided: true },
  brandMark: { inUse: 'b', decided: true },
} as const satisfies Record<string, { inUse: OptionLetter; decided: boolean }>;

export type DesignItem = keyof typeof designChoices;
