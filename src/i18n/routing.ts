import { defineRouting } from 'next-intl/routing';

export const locales = ['pt', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // hreflang alternates come only from the page metadata (src/lib/seo.ts),
  // which always uses the production domain. next-intl's own `Link` header
  // would repeat them with the request's host, so a preview or vercel.app
  // URL would advertise itself as the alternate.
  alternateLinks: false,
  // The cookie only remembers the visitor's language choice. It is a
  // session cookie (no max-age), never readable cross-site, and HTTPS-only.
  // Browsers treat localhost as a secure context, so `secure` does not
  // break local development.
  localeCookie: {
    sameSite: 'lax',
    secure: true,
  },
});
