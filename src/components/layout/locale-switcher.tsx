'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, type AppLocale } from '@/i18n/routing';

/** Each language's own name for itself, so it is recognisable in either locale. */
const nativeNames = {
  pt: 'Português',
  en: 'English',
} as const satisfies Record<AppLocale, string>;

/**
 * Plain links rather than a select: they work without JavaScript, are
 * crawlable, and carry `hrefLang`/`lang` for search engines and screen
 * readers. The accessible name starts with the visible code ("PT, Português"),
 * so voice control users can say what they see (WCAG 2.5.3, Label in Name). Each link keeps the current page, which is safe because slugs
 * are identical across locales (enforced by the content tests).
 */
export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher');
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')}>
      <ul className="flex items-center font-mono text-xs">
        {locales.map((locale) => {
          const active = locale === currentLocale;

          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-label={`${locale.toUpperCase()}, ${nativeNames[locale]}`}
                aria-current={active ? 'true' : undefined}
                className={`rounded-md px-2 py-1 focus-visible:outline-2 focus-visible:outline-accent ${
                  active ? 'bg-surface text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
