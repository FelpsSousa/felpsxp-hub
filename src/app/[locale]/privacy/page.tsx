import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
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
  const t = await getTranslations('privacy');
  const format = await getFormatter();
  const page = getPrivacyPage(locale as AppLocale);
  const { privacyEmail } = getSiteSettings();
  // Date-only values are UTC midnight; format in UTC so the day never shifts.
  const updated = format.dateTime(new Date(page.updatedAt), { dateStyle: 'long', timeZone: 'UTC' });

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{page.title}</h1>
        <p className="text-fg">{page.summary}</p>
        <p className="text-sm text-fg-muted">
          <time dateTime={page.updatedAt}>{t('updated', { date: updated })}</time>
        </p>
      </header>

      {page.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-fg">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <p className="text-fg">
        {t('contactLabel')}{' '}
        <a
          href={`mailto:${privacyEmail}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {privacyEmail}
        </a>
      </p>
    </article>
  );
}
