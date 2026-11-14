import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StructuredData } from '@/components/seo/structured-data';
import { locales, routing, type AppLocale } from '@/i18n/routing';
import { getProfile, getSiteSettings } from '@/lib/content';
import { NONCE_HEADER } from '@/lib/security-headers';
import { themeInitScript } from '@/lib/theme';
import '../globals.css';
import { requireLocale } from '@/i18n/locale';

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const { name, url } = getSiteSettings();
  const profile = getProfile(locale);

  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} · ${profile.title}`,
      template: `%s · ${name}`,
    },
    description: profile.shortBio,
    applicationName: name,
    authors: [{ name, url }],
    creator: name,
  };
}

/** The known locales. Pages render per request since ADR-0009 (nonce CSP). */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = requireLocale((await params).locale);


  // Lets next-intl read the locale from the route instead of the request
  // headers. Every page under this layout calls it as well.
  setRequestLocale(locale);

  // Per-request nonce from the proxy (ADR-0009). Reading it renders pages on
  // each request instead of at build time, the accepted cost of a strict CSP.
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;
  const messages = await getMessages();
  const t = await getTranslations('site');

  return (
    // suppressHydrationWarning: the inline theme script may set
    // `data-theme` on <html> before React hydrates; that attribute alone is
    // expected to differ from the server-rendered markup.
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Runs before first paint so a stored theme never flashes. Carries the
            request's nonce, so the strict CSP of ADR-0009 allows it. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <StructuredData locale={locale} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:outline-2 focus:outline-accent"
          >
            {t('skipToContent')}
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
