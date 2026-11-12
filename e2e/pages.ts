/** Every public page, as a locale-free path. Add new pages here. */
export const pages = [
  '/',
  '/projects',
  '/projects/felpsxp-hub',
  '/contact',
  '/privacy',
  '/security',
] as const;

export const locales = [
  { code: 'pt', prefix: '' },
  { code: 'en', prefix: '/en' },
] as const;

/** The real URL of a page in a locale (`pt` has no prefix). */
export function urlFor(prefix: string, path: string): string {
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}
