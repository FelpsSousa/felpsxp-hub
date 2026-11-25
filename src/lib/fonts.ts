import localFont from 'next/font/local';

/*
 * The two accent faces of the FelpsXP visual standard (ADR-0012), served from
 * this site (no request to another origin, so the CSP stays as it is), from
 * the unmodified Latin files of their Fontsource packages. Credits and
 * licences: THIRD_PARTY_NOTICES.md and the /design page.
 *
 * Neither is preloaded: they only mark small labels and the XP badge, and
 * `swap` shows the fallback face until they arrive.
 */

/** Special Elite, by Astigmatic (Apache License 2.0): small section labels. */
export const typewriterFont = localFont({
  src: '../../node_modules/@fontsource/special-elite/files/special-elite-latin-400-normal.woff2',
  variable: '--font-special-elite',
  display: 'swap',
  preload: false,
  fallback: ['Courier New', 'monospace'],
});

/** Press Start 2P, by CodeMan38 (SIL Open Font License 1.1): the XP badge. */
export const pixelFont = localFont({
  src: '../../node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2',
  variable: '--font-press-start',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
});
