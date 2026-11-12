import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPageView } from '@/components/legal/legal-page-view';
import type { AppLocale } from '@/i18n/routing';
import { getSecurityPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type SecurityPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SecurityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = getSecurityPage(locale as AppLocale);

  return pageMetadata({
    locale: locale as AppLocale,
    path: '/security',
    title: page.title,
    description: page.summary,
  });
}

export default async function SecurityPage({ params }: SecurityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations('legal');

  return (
    <LegalPageView
      page={getSecurityPage(locale as AppLocale)}
      contactLabel={t('securityContact')}
      contactEmail={getSiteSettings().securityEmail}
    />
  );
}
