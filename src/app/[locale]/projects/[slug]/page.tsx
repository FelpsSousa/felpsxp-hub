import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { getProjectBySlug, getProjectStaticParams } from '@/lib/content';
import { domainLabel, projectDomains } from '@/lib/skill-taxonomy';

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getProjectStaticParams();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug, locale as AppLocale);

  return {
    title: project?.title ?? 'Project',
    description: project?.summary,
  };
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-fg">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('projects');
  const project = getProjectBySlug(slug, locale as AppLocale);

  if (!project) {
    notFound();
  }

  const cover = project.media.find((item) => item.kind === 'image');

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{project.title}</h1>
        <p className="text-fg">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {projectDomains(project).map((domain) => (
            <span key={domain} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {domainLabel(domain)}
            </span>
          ))}
        </div>
      </header>

      {cover && cover.kind === 'image' && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={cover.url} alt={cover.alt} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('problemLabel')}
        </h2>
        <p className="text-fg">{project.problem}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('solutionLabel')}
        </h2>
        <p className="text-fg">{project.solution}</p>
      </section>

      <Section title={t('architectureHighlightsLabel')} items={project.architectureHighlights} />
      <Section title={t('challengesLabel')} items={project.challenges} />
      <Section title={t('responsibilitiesLabel')} items={project.responsibilities} />
      <Section title={t('outcomesLabel')} items={project.outcomes} />
      <Section title={t('learningsLabel')} items={project.learnings} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('stackLabel')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
