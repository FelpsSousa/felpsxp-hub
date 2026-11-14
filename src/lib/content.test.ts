import { describe, expect, it } from 'vitest';
import type { Project } from '@/content/types';
import { locales } from '@/i18n/routing';
import {
  getAccessibilityPage,
  getAdjacentProjects,
  getAllProjects,
  getFeaturedProjects,
  getPrivacyPage,
  getSecurityPage,
  getProfile,
  getProjectBySlug,
  getProjectStaticParams,
  getPublicProjects,
} from '@/lib/content';

// Importing '@/lib/content' already parses every record through its Zod
// schema, so these tests failing to load at all means some record is
// malformed. The checks below cover rules that span several records.

/** Fields that describe the project itself and must match across locales. */
const localeInvariantFields = [
  'slug',
  'status',
  'visibility',
  'type',
  'difficulty',
  'primaryDomain',
  'secondaryDomains',
  'relatedSurfaceKeys',
  'startedAt',
  'updatedAt',
  'featured',
] as const satisfies readonly (keyof Project)[];

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

describe('project content', () => {
  it('has the same projects, in the same order, in every locale', () => {
    const slugsPerLocale = locales.map((locale) => getAllProjects(locale).map((p) => p.slug));
    for (const slugs of slugsPerLocale) {
      expect(slugs).toEqual(slugsPerLocale[0]);
    }
  });

  it('has unique slugs', () => {
    const slugs = getAllProjects('pt').map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps locale-invariant fields identical across locales', () => {
    const [first, ...others] = locales;
    getAllProjects(first).forEach((reference, index) => {
      for (const locale of others) {
        const translated = getAllProjects(locale)[index];
        for (const field of localeInvariantFields) {
          expect(translated[field], `${reference.slug}.${field} in ${locale}`).toEqual(
            reference[field],
          );
        }
      }
    });
  });

  it('never starts a project after its last update', () => {
    for (const project of getAllProjects('pt')) {
      expect(project.startedAt <= project.updatedAt, project.slug).toBe(true);
    }
  });

  it('does not list a primary domain again as a secondary one', () => {
    for (const project of getAllProjects('pt')) {
      expect(project.secondaryDomains, project.slug).not.toContain(project.primaryDomain);
    }
  });
});

describe('writing style in content', () => {
  it('contains no em or en dashes', () => {
    for (const locale of locales) {
      const strings = collectStrings([
        getProfile(locale),
        getAllProjects(locale),
        getPrivacyPage(locale),
        getSecurityPage(locale),
        getAccessibilityPage(locale),
      ]);
      const offenders = strings.filter((value) => /[–—]/.test(value));
      expect(offenders, `dashes found in ${locale} content`).toEqual([]);
    }
  });
});

describe('privacy page', () => {
  it('has the same structure and date in every locale', () => {
    const [first, ...others] = locales;
    const reference = getPrivacyPage(first);
    for (const locale of others) {
      const page = getPrivacyPage(locale);
      expect(page.updatedAt).toBe(reference.updatedAt);
      expect(page.sections.map((section) => section.paragraphs.length)).toEqual(
        reference.sections.map((section) => section.paragraphs.length),
      );
    }
  });

  it('names every cookie, storage key and third party the code uses', () => {
    for (const locale of locales) {
      const text = collectStrings(getPrivacyPage(locale)).join(' ');
      for (const term of ['NEXT_LOCALE', 'localStorage', 'Vercel', 'Cloudflare', 'Resend']) {
        expect(text, `${term} in ${locale}`).toContain(term);
      }
    }
  });
});

describe.each([
  ['security', getSecurityPage],
  ['accessibility', getAccessibilityPage],
])('%s page', (_name, getPage) => {
  it('has the same structure and date in every locale', () => {
    const [first, ...others] = locales;
    const reference = getPage(first);
    for (const locale of others) {
      const page = getPage(locale);
      expect(page.updatedAt).toBe(reference.updatedAt);
      expect(page.sections.map((section) => section.paragraphs.length)).toEqual(
        reference.sections.map((section) => section.paragraphs.length),
      );
    }
  });
});

describe('content accessors', () => {
  it('returns only public projects from getPublicProjects', () => {
    for (const locale of locales) {
      for (const project of getPublicProjects(locale)) {
        expect(project.visibility).toBe('public');
      }
    }
  });

  it('returns only public, featured projects from getFeaturedProjects', () => {
    for (const locale of locales) {
      const featured = getFeaturedProjects(locale);
      expect(featured.length).toBeGreaterThan(0);
      for (const project of featured) {
        expect(project.featured).toBe(true);
        expect(project.visibility).toBe('public');
      }
    }
  });

  it('finds a public project by slug and ignores unknown slugs', () => {
    const [first] = getPublicProjects('en');
    expect(getProjectBySlug(first.slug, 'en')).toBe(first);
    expect(getProjectBySlug('does-not-exist', 'en')).toBeUndefined();
  });

  it('links each public project to its neighbours in display order, without wrapping', () => {
    for (const locale of locales) {
      const projects = getPublicProjects(locale);
      projects.forEach((project, index) => {
        const { previous, next } = getAdjacentProjects(project.slug, locale);
        expect(previous?.slug ?? null).toBe(projects[index - 1]?.slug ?? null);
        expect(next?.slug ?? null).toBe(projects[index + 1]?.slug ?? null);
      });
    }
    expect(getAdjacentProjects('does-not-exist', 'en')).toEqual({ previous: null, next: null });
  });

  it('builds one static param per public project and locale', () => {
    const params = getProjectStaticParams();
    const expected = locales.reduce((total, locale) => total + getPublicProjects(locale).length, 0);
    expect(params).toHaveLength(expected);
    expect(new Set(params.map((p) => `${p.locale}/${p.slug}`)).size).toBe(expected);
  });
});
