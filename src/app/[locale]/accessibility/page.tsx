import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPageView } from '@/components/legal/legal-page-view';
import { getAccessibilityPage, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { requireLocale } from '@/i18n/locale';

type AccessibilityPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AccessibilityPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const page = getAccessibilityPage(locale);

  return pageMetadata({
    locale: locale,
    path: '/accessibility',
    title: page.title,
    description: page.summary,
  });
}

export default async function AccessibilityPage({ params }: AccessibilityPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <LegalPageView
      page={getAccessibilityPage(locale)}
      contactLabel={t('accessibilityContact')}
      contactEmail={getSiteSettings().contactEmail}
    />
  );
}
