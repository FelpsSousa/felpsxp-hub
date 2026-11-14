import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectFiltersList, type FilterableCard } from '@/components/projects/project-filters';
import type { SkillDomain } from '@/content/types';
import { getPublicProjects } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import {
  PROJECT_DIFFICULTIES,
  SKILL_DOMAINS,
  domainLabel,
  projectDomains,
} from '@/lib/skill-taxonomy';
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
  const items: FilterableCard[] = projects.map((project) => ({
    slug: project.slug,
    domains: projectDomains(project),
    difficulty: project.difficulty,
    card: <ProjectCard project={project} />,
  }));
  const domainLabels = Object.fromEntries(
    SKILL_DOMAINS.map((domain) => [domain, domainLabel(domain)]),
  ) as Record<SkillDomain, string>;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
      </header>

      {/* The filters read the URL query on the client, so the page itself
          stays static. Without JavaScript, the fallback lists every project. */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.slug}>{item.card}</div>
            ))}
          </div>
        }
      >
        <ProjectFiltersList
          items={items}
          vocabulary={{ domains: SKILL_DOMAINS, levels: PROJECT_DIFFICULTIES }}
          domainLabels={domainLabels}
        />
      </Suspense>
    </div>
  );
}
