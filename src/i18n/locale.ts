import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, type AppLocale } from '@/i18n/routing';

/**
 * The `[locale]` route parameter, checked. Next.js renders a layout, its
 * page and their metadata in parallel, so a path like `/wp-login.php` would
 * reach page code with `locale` set to "wp-login.php" before the layout's
 * own check runs. Every entry point calls this first, so an unknown locale
 * becomes a 404 instead of an error on content lookups.
 */
export function requireLocale(value: string): AppLocale {
  if (!hasLocale(locales, value)) {
    notFound();
  }
  return value;
}
