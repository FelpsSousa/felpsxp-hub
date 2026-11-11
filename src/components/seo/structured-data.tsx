import type { AppLocale } from '@/i18n/routing';
import { getProfile, getSiteSettings } from '@/lib/content';
import { absoluteUrl, localizedPath, serializeJsonLd } from '@/lib/seo';

/**
 * Person and WebSite JSON-LD (schema.org), rendered once per page by the
 * locale layout. JSON-LD is a data block, not executable script, so the
 * CSP's `script-src` does not apply to it.
 */
export function StructuredData({ locale }: { locale: AppLocale }) {
  const { name, url, socialLinks } = getSiteSettings();
  const profile = getProfile(locale);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}/#person`,
        name,
        jobTitle: profile.title,
        description: profile.shortBio,
        url,
        sameAs: socialLinks.filter((link) => link.external).map((link) => link.href),
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        name,
        url: absoluteUrl(localizedPath(locale, '/')),
        inLanguage: locale,
        author: { '@id': `${url}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
    />
  );
}
