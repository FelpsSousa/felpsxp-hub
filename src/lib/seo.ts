import type { Metadata } from 'next';
import { defaultLocale, locales, type AppLocale } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/content';

/** Open Graph locale codes for each app locale. */
const openGraphLocales = {
  pt: 'pt_BR',
  en: 'en_US',
} as const satisfies Record<AppLocale, string>;

/**
 * Turns a locale-free path into the real route, following next-intl's
 * `localePrefix: 'as-needed'`: the default locale has no prefix, every
 * other locale gets `/<locale>`.
 */
export function localizedPath(locale: AppLocale, path: string): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
}

/** Absolute URL on the canonical domain, never on a preview deployment. */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteSettings().url).toString();
}

/** hreflang alternates for one page, including `x-default`. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, path)])),
    'x-default': localizedPath(defaultLocale, path),
  };
}

type PageMetadataInput = {
  locale: AppLocale;
  /** Locale-free path, such as `/` or `/projects/felpsxp-hub`. */
  path: string;
  title: string;
  description: string;
  /** Use the title as is, without the site-wide " · Felipe Sousa" suffix. */
  absoluteTitle?: boolean;
};

/**
 * Metadata every page needs: title, description, canonical URL, hreflang
 * alternates and the Open Graph and Twitter fields. Relative URLs resolve
 * against `metadataBase`, set once in the locale layout.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path);
  const { name } = getSiteSettings();
  // The locale's share image from `[locale]/opengraph-image.tsx`. Setting
  // `openGraph` on a page replaces the layout's, file-based image included,
  // so it is listed here explicitly. `localizedPath` keeps the default
  // locale unprefixed, which avoids a redirect some crawlers do not follow.
  const image = {
    url: localizedPath(locale, '/opengraph-image'),
    width: 1200,
    height: 630,
    alt: name,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      url,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => openGraphLocales[other]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Serialises JSON-LD for an inline `<script type="application/ld+json">`.
 * Escaping `<` keeps any string that contains `</script>` from closing the
 * tag early and injecting markup.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** One step of a breadcrumb trail; `path` is locale-free, as in `localizedPath`. */
export type BreadcrumbItem = { name: string; path: string };

/**
 * schema.org BreadcrumbList for a trail of pages, root first. Search engines
 * may show it in place of the raw URL in their results.
 */
export function breadcrumbJsonLd(locale: AppLocale, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
