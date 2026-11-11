import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StructuredData } from '@/components/seo/structured-data';
import { locales, routing, type AppLocale } from '@/i18n/routing';
import { getProfile, getSiteSettings } from '@/lib/content';
import { themeInitScript } from '@/lib/theme';
import '../globals.css';

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const { name, url } = getSiteSettings();
  const profile = getProfile(locale as AppLocale);

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

/** Prerender every locale at build time instead of on each request. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  // Lets next-intl read the locale without request headers, which keeps
  // the pages static. Every page under this layout calls it as well.
  setRequestLocale(locale as AppLocale);

  const messages = await getMessages();
  const t = await getTranslations('site');

  return (
    // suppressHydrationWarning: the inline theme script may set
    // `data-theme` on <html> before React hydrates; that attribute alone is
    // expected to differ from the server-rendered markup.
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Runs before first paint so a stored theme never flashes. Allowed by
            the current CSP's 'unsafe-inline'; when the CSP is tightened, this
            script gets a sha256 hash instead, which keeps pages static. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <StructuredData locale={locale as AppLocale} />
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
