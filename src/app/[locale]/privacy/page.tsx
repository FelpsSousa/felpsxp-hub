import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPageView } from '@/components/legal/legal-page-view';
import type { AppLocale } from '@/i18n/routing';
import { getPrivacyPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = getPrivacyPage(locale as AppLocale);

  return pageMetadata({
    locale: locale as AppLocale,
    path: '/privacy',
    title: page.title,
    description: page.summary,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations('legal');

  return (
    <LegalPageView
      page={getPrivacyPage(locale as AppLocale)}
      contactLabel={t('privacyContact')}
      contactEmail={getSiteSettings().privacyEmail}
    />
  );
}
