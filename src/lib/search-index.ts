import en from '../../messages/en.json';
import pt from '../../messages/pt.json';
import type { AppLocale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { headingIds } from '@/lib/anchors';
import {
  getAccessibilityPage,
  getPrivacyPage,
  getProfile,
  getPublicProjects,
  getSecurityPage,
} from '@/lib/content';
import { excerpt, type SearchEntry } from '@/lib/search';
import { domainLabel, projectDomains } from '@/lib/skill-taxonomy';

const messages = { pt, en } satisfies Record<AppLocale, typeof pt>;

/**
 * Everything the site search can find in one locale: the pages, every public
 * project and every section of the legal pages. Built from the same content
 * the pages render, so the index never lists something that is not there.
 */
export function buildSearchIndex(locale: AppLocale): SearchEntry[] {
  const m = messages[locale];
  const profile = getProfile(locale);

  const legal = [
    { path: '/privacy', page: getPrivacyPage(locale) },
    { path: '/security', page: getSecurityPage(locale) },
    { path: '/accessibility', page: getAccessibilityPage(locale) },
  ];

  const pages: SearchEntry[] = [
    {
      kind: 'page',
      title: m.breadcrumb.home,
      description: excerpt(profile.shortBio),
      href: '/',
      keywords: `${profile.displayName} ${profile.title}`,
    },
    {
      kind: 'page',
      title: m.projects.title,
      description: excerpt(m.projects.lede),
      href: '/projects',
      keywords: '',
    },
    {
      kind: 'page',
      title: m.contact.title,
      description: excerpt(m.contact.lede),
      href: '/contact',
      keywords: 'email e-mail linkedin',
    },
    ...legal.map(({ path, page }) => ({
      kind: 'page' as const,
      title: page.title,
      description: excerpt(page.summary),
      href: path,
      keywords: '',
    })),
    {
      kind: 'page',
      title: m.changelog.title,
      description: excerpt(m.changelog.lede),
      href: '/changelog',
      keywords: 'changelog release',
    },
  ];

  const projects: SearchEntry[] = getPublicProjects(locale).map((project) => ({
    kind: 'project',
    title: project.title,
    description: excerpt(project.summary),
    href: `/projects/${project.slug}`,
    keywords: [
      ...project.stack,
      ...project.tags,
      ...projectDomains(project).map(domainLabel),
    ].join(' '),
  }));

  const sections: SearchEntry[] = legal.flatMap(({ path, page }) => {
    const ids = headingIds(page.sections.map((section) => section.heading));
    return page.sections.map((section, index) => ({
      kind: 'section' as const,
      title: `${section.heading} · ${page.title}`,
      description: excerpt(section.paragraphs[0]),
      href: `${path}#${ids[index]}`,
      keywords: section.paragraphs.slice(1).join(' '),
    }));
  });

  return [...pages, ...projects, ...sections];
}

export function buildSearchIndexes(): Record<AppLocale, SearchEntry[]> {
  return Object.fromEntries(
    locales.map((locale) => [locale, buildSearchIndex(locale)]),
  ) as Record<AppLocale, SearchEntry[]>;
}
