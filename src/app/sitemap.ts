import type { MetadataRoute } from 'next';
import { defaultLocale, locales } from '@/i18n/routing';
import { getPublicProjects } from '@/lib/content';
import { absoluteUrl, languageAlternates, localizedPath } from '@/lib/seo';

type Page = { path: string; lastModified?: string };

/**
 * One entry per page and locale, each listing its hreflang alternates.
 * Unlisted and private projects are left out, matching what the pages show.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Page[] = [
    { path: '/' },
    { path: '/projects' },
    { path: '/contact' },
    ...getPublicProjects(defaultLocale).map((project) => ({
      path: `/projects/${project.slug}`,
      lastModified: project.updatedAt,
    })),
  ];

  return pages.flatMap(({ path, lastModified }) => {
    const alternates = Object.fromEntries(
      Object.entries(languageAlternates(path))
        .filter(([language]) => language !== 'x-default')
        .map(([language, href]) => [language, absoluteUrl(href)]),
    );

    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages: alternates },
    }));
  });
}
