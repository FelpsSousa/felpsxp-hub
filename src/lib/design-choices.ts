/**
 * The variation in use for each item of the visual standard that is still
 * being chosen on /design (ADR-0012). A plain module, so server pages read
 * the values themselves (a value exported from a client component would reach
 * them as a reference). Changing a choice here moves the "in use" badge on
 * /design; applying it to the pages is its own pull request.
 */
export const designChoices = {
  navCurrent: 'a',
  statusBadge: 'a',
  projectCard: 'a',
  sectionLabel: 'a',
  numbers: 'a',
  xpBadge: 'a',
  projectSections: 'a',
  brandMark: 'a',
} as const satisfies Record<string, 'a' | 'b' | 'c'>;

export type DesignItem = keyof typeof designChoices;
