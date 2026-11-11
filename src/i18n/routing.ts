import { defineRouting } from 'next-intl/routing';

export const locales = ['pt', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // The cookie only remembers the visitor's language choice. It is a
  // session cookie (no max-age), never readable cross-site, and HTTPS-only.
  // Browsers treat localhost as a secure context, so `secure` does not
  // break local development.
  localeCookie: {
    sameSite: 'lax',
    secure: true,
  },
});
