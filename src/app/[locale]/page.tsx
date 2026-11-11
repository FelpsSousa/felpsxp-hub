import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getProfile, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import type { AppLocale } from '@/i18n/routing';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const profile = getProfile(locale as AppLocale);

  return pageMetadata({
    locale: locale as AppLocale,
    path: '/',
    title: `${getSiteSettings().name} · ${profile.title}`,
    description: profile.shortBio,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const profile = getProfile(locale as AppLocale);

  return <HomeContent profile={profile} />;
}

function HomeContent({ profile }: { profile: ReturnType<typeof getProfile> }) {
  const t = useTranslations('home');

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold text-fg">{profile.displayName}</h1>
        <p className="text-lg text-fg">{profile.title}</p>
        <p className="text-sm text-fg-muted">{profile.location}</p>
        <p className="mt-2 text-fg">{profile.shortBio}</p>
      </header>

      <section className="flex flex-col gap-4">
        {profile.summaryParagraphs.map((paragraph) => (
          <p key={paragraph} className="text-fg">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('focusLabel')}
        </h2>
        <ul className="flex flex-col gap-2">
          {profile.currentFocus.map((item) => (
            <li key={item} className="text-fg">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('statsLabel')}
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {profile.highlightStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border p-4">
              <dt className="font-mono text-2xl font-semibold text-accent">{stat.value}</dt>
              <dd className="mt-1 text-sm text-fg-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
