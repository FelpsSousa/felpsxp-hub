import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { locales } from '@/i18n/routing';
import { getPublicProjects } from '@/lib/content';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  languageAlternates,
  localizedPath,
  pageMetadata,
  serializeJsonLd,
} from '@/lib/seo';

describe('localizedPath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localizedPath('pt', '/')).toBe('/');
    expect(localizedPath('pt', '/projects')).toBe('/projects');
  });

  it('prefixes other locales without a trailing slash on home', () => {
    expect(localizedPath('en', '/')).toBe('/en');
    expect(localizedPath('en', '/projects/felpsxp-hub')).toBe('/en/projects/felpsxp-hub');
  });
});

describe('absoluteUrl', () => {
  it('always points at the canonical domain', () => {
    expect(absoluteUrl('/en/projects')).toBe('https://felpsxp.com/en/projects');
  });
});

describe('languageAlternates', () => {
  it('lists every locale plus x-default on the default locale', () => {
    expect(languageAlternates('/projects')).toEqual({
      pt: '/projects',
      en: '/en/projects',
      'x-default': '/projects',
    });
  });
});

describe('pageMetadata', () => {
  it('sets the canonical URL and Open Graph locale for the page', () => {
    const metadata = pageMetadata({
      locale: 'en',
      path: '/projects',
      title: 'Projects',
      description: 'All projects.',
    });

    expect(metadata.alternates?.canonical).toBe('/en/projects');
    expect(metadata.openGraph).toMatchObject({ url: '/en/projects', locale: 'en_US' });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('uses a share image URL that does not redirect', () => {
    const pt = pageMetadata({ locale: 'pt', path: '/', title: 'T', description: 'D' });
    const en = pageMetadata({ locale: 'en', path: '/', title: 'T', description: 'D' });

    expect(pt.openGraph?.images).toEqual([expect.objectContaining({ url: '/opengraph-image' })]);
    expect(en.openGraph?.images).toEqual([
      expect.objectContaining({ url: '/en/opengraph-image' }),
    ]);
  });

  it('can opt out of the title template', () => {
    const metadata = pageMetadata({
      locale: 'pt',
      path: '/',
      title: 'Home',
      description: 'Home page.',
      absoluteTitle: true,
    });

    expect(metadata.title).toEqual({ absolute: 'Home' });
  });
});

describe('serializeJsonLd', () => {
  it('cannot be used to close the script tag', () => {
    const output = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(output).not.toContain('<');
    expect(JSON.parse(output)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});

describe('sitemap', () => {
  const entries = sitemap();

  it('has one entry per page and locale', () => {
    const pageCount = 5 + getPublicProjects('pt').length;
    expect(entries).toHaveLength(pageCount * locales.length);
  });

  it('uses unique, absolute, canonical URLs with alternates', () => {
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const entry of entries) {
      expect(entry.url.startsWith('https://felpsxp.com')).toBe(true);
      expect(Object.keys(entry.alternates?.languages ?? {})).toEqual([...locales]);
    }
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers the trail from 1 with absolute, localized URLs', () => {
    const trail = [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'FelpsXP Hub', path: '/projects/felpsxp-hub' },
    ];
    const data = breadcrumbJsonLd('en', trail);

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement.map((item) => [item.position, item.name, item.item])).toEqual([
      [1, 'Home', absoluteUrl('/en')],
      [2, 'Projects', absoluteUrl('/en/projects')],
      [3, 'FelpsXP Hub', absoluteUrl('/en/projects/felpsxp-hub')],
    ]);
  });
});
