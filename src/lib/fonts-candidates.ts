import localFont from 'next/font/local';

/*
 * Faces under evaluation for the section labels (ADR-0012), loaded only by
 * /design, so no other page downloads them. When Felipe picks one, it moves
 * to `fonts.ts` and the others leave, with their packages and credits.
 * All three are under the SIL Open Font License 1.1, served unmodified.
 */

/** Courier Prime, by Quote-Unquote Apps: a cleaner typewriter face. */
export const courierPrimeFont = localFont({
  src: '../../node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff2',
  variable: '--font-courier-prime',
  display: 'swap',
  preload: false,
});

/** Space Mono, by Colophon Foundry: a geometric mono with a retro feel. */
export const spaceMonoFont = localFont({
  src: '../../node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff2',
  variable: '--font-space-mono',
  display: 'swap',
  preload: false,
});

/** IBM Plex Mono, by IBM: an engineering mono, the most neutral of the three. */
export const plexMonoFont = localFont({
  src: '../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false,
});
