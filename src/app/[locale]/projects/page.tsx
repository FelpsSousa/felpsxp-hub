import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { getPublicProjects } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { domainLabel, projectDomains, projectXp } from '@/lib/skill-taxonomy';

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return pageMetadata({
    locale: locale as AppLocale,
    path: '/projects',
    title: t('title'),
    description: t('lede'),
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations('projects');
  const projects = getPublicProjects(locale as AppLocale);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
      </header>

      <div className="flex flex-col gap-6">
        {projects.map((project) => {
          const cover = project.media.find((item) => item.kind === 'image');
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="flex flex-col gap-3 rounded-lg border border-border p-5 transition hover:border-accent/50"
            >
              {cover && cover.kind === 'image' && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={cover.url}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-muted">
                <span className="rounded-full border border-border px-2 py-0.5">
                  {project.status}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5">
                  {project.difficulty}
                </span>
                <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">
                  ~{projectXp(project)} XP
                </span>
              </div>

              <h2 className="text-xl font-medium text-fg">{project.title}</h2>
              <p className="text-fg">{project.summary}</p>

              <div className="flex flex-wrap gap-2">
                {projectDomains(project).map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted"
                  >
                    {domainLabel(domain)}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
