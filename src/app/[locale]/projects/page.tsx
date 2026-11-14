import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import type { AppLocale } from '@/i18n/routing';
import { getPublicProjects } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { requireLocale } from '@/i18n/locale';

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  return pageMetadata({
    locale: locale,
    path: '/projects',
    title: t('title'),
    description: t('lede'),
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const projects = getPublicProjects(locale);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
      </header>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
