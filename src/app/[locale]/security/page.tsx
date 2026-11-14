import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPageView } from '@/components/legal/legal-page-view';
import type { AppLocale } from '@/i18n/routing';
import { getSecurityPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { requireLocale } from '@/i18n/locale';

type SecurityPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SecurityPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const page = getSecurityPage(locale);

  return pageMetadata({
    locale: locale,
    path: '/security',
    title: page.title,
    description: page.summary,
  });
}

export default async function SecurityPage({ params }: SecurityPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <LegalPageView
      page={getSecurityPage(locale)}
      contactLabel={t('securityContact')}
      contactEmail={getSiteSettings().securityEmail}
    />
  );
}
