import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import { Link } from '@/i18n/navigation';
import { getFeaturedProjects, getProfile, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import type { Project } from '@/content/types';
import type { AppLocale } from '@/i18n/routing';
import { requireLocale } from '@/i18n/locale';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const profile = getProfile(locale);

  return pageMetadata({
    locale: locale,
    path: '/',
    title: `${getSiteSettings().name} · ${profile.title}`,
    description: profile.shortBio,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const profile = getProfile(locale);
  const featured = getFeaturedProjects(locale);

  return <HomeContent profile={profile} featured={featured} />;
}

function HomeContent({
  profile,
  featured,
}: {
  profile: ReturnType<typeof getProfile>;
  featured: Project[];
}) {
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

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('featuredLabel')}
        </h2>
        <div className="flex flex-col gap-4">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} headingLevel="h3" />
          ))}
        </div>
        <Link
          href="/projects"
          className="w-fit text-accent underline underline-offset-4 hover:decoration-2"
        >
          {t('allProjects')}
        </Link>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-fg">{t('ctaTitle')}</h2>
        <p className="text-fg">{t('ctaBody')}</p>
        <Link
          href="/contact"
          className="w-fit rounded-md bg-accent px-5 py-2 font-medium text-canvas hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('ctaButton')}
        </Link>
      </section>
    </div>
  );
}
