import { getPublicProjects } from '@/lib/content';

/**
 * Every public project page, read from the content itself so a new project
 * is covered by the smoke, header and accessibility suites without anyone
 * remembering to list it. The accessibility statement promises every page.
 */
const projectPages = getPublicProjects('pt').map(({ slug }) => `/projects/${slug}`);

/** Every public page, as a locale-free path. Add new routes here. */
export const pages: readonly string[] = [
  '/',
  '/projects',
  '/cv',
  '/experience',
  ...projectPages,
  '/contact',
  '/privacy',
  '/security',
  '/accessibility',
  '/changelog',
];

export const locales = [
  { code: 'pt', prefix: '' },
  { code: 'en', prefix: '/en' },
] as const;

/** The real URL of a page in a locale (`pt` has no prefix). */
export function urlFor(prefix: string, path: string): string {
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}
