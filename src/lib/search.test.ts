import { describe, expect, it } from 'vitest';
import { locales } from '@/i18n/routing';
import { excerpt, normalize, searchEntries, type SearchEntry } from '@/lib/search';
import { buildSearchIndex } from '@/lib/search-index';

const entry = (title: string, kind: SearchEntry['kind'] = 'project', keywords = ''): SearchEntry => ({
  kind,
  title,
  description: '',
  href: `/${normalize(title).replace(/ /g, '-')}`,
  keywords,
});

describe('normalize', () => {
  it('drops accents and case and collapses spaces', () => {
    expect(normalize('  Segurança   de Aplicação ')).toBe('seguranca de aplicacao');
  });
});

describe('searchEntries', () => {
  const entries = [
    entry('Privacidade', 'page'),
    entry('FelpsXP Finance', 'project', 'Expo React Native Supabase'),
    entry('FelpsXP Platform', 'project', 'IAM AppSec'),
    entry('Escopo · Segurança', 'section'),
  ];

  it('needs every word of the query and ignores accents', () => {
    expect(searchEntries(entries, 'felpsxp plat').map((e) => e.title)).toEqual(['FelpsXP Platform']);
    expect(searchEntries(entries, 'seguranca').map((e) => e.title)).toEqual(['Escopo · Segurança']);
  });

  it('finds keywords and ranks title matches first', () => {
    expect(searchEntries(entries, 'supabase').map((e) => e.title)).toEqual(['FelpsXP Finance']);
    expect(searchEntries(entries, 'felpsxp').map((e) => e.title)).toEqual([
      'FelpsXP Finance',
      'FelpsXP Platform',
    ]);
  });

  it('returns nothing for an empty query and respects the limit', () => {
    expect(searchEntries(entries, '   ')).toEqual([]);
    expect(searchEntries(entries, 'f', 1)).toHaveLength(1);
  });
});

describe('excerpt', () => {
  it('cuts on a word boundary', () => {
    expect(excerpt('one two three', 9)).toBe('one two…');
    expect(excerpt('short', 9)).toBe('short');
  });
});

describe('buildSearchIndex', () => {
  it('lists pages, projects and sections with unique, internal links in every locale', () => {
    for (const locale of locales) {
      const index = buildSearchIndex(locale);
      const hrefs = index.map((e) => e.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
      expect(hrefs.every((href) => href.startsWith('/'))).toBe(true);
      expect(index.some((e) => e.kind === 'project' && e.href === '/projects/felpsxp-hub')).toBe(true);
      expect(index.some((e) => e.href.startsWith('/privacy#'))).toBe(true);
    }
  });
});
