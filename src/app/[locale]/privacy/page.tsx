import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPageView } from '@/components/legal/legal-page-view';
import type { AppLocale } from '@/i18n/routing';
import { getPrivacyPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { requireLocale } from '@/i18n/locale';

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const page = getPrivacyPage(locale);

  return pageMetadata({
    locale: locale,
    path: '/privacy',
    title: page.title,
    description: page.summary,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <LegalPageView
      page={getPrivacyPage(locale)}
      contactLabel={t('privacyContact')}
      contactEmail={getSiteSettings().privacyEmail}
    />
  );
}
