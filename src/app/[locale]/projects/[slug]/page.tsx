import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { AnchorHeading, TableOfContents } from '@/components/navigation/section-anchors';
import { Link } from '@/i18n/navigation';
import type { TocItem } from '@/lib/anchors';
import { getAdjacentProjects, getProjectBySlug, getProjectStaticParams } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { domainLabel, projectDomains } from '@/lib/skill-taxonomy';
import { requireLocale } from '@/i18n/locale';

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getProjectStaticParams();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    return {};
  }

  return pageMetadata({
    locale: locale,
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.summary,
  });
}

const headingClass = 'text-sm font-medium uppercase tracking-wide text-fg-muted';

function Section({ id, title, items }: { id: string; title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <AnchorHeading id={id} className={headingClass}>
        {title}
      </AnchorHeading>
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
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const cover = project.media.find((item) => item.kind === 'image');
  const { previous, next } = getAdjacentProjects(project.slug, locale);
  const tCrumb = await getTranslations('breadcrumb');

  // Section ids are the same in every locale, so a link to a section keeps
  // working after the locale switcher changes the language.
  const listSections = [
    { id: 'architecture', title: t('architectureHighlightsLabel'), items: project.architectureHighlights },
    { id: 'challenges', title: t('challengesLabel'), items: project.challenges },
    { id: 'responsibilities', title: t('responsibilitiesLabel'), items: project.responsibilities },
    { id: 'outcomes', title: t('outcomesLabel'), items: project.outcomes },
    { id: 'learnings', title: t('learningsLabel'), items: project.learnings },
  ].filter((section) => section.items.length > 0);
  const toc: TocItem[] = [
    { id: 'problem', label: t('problemLabel') },
    { id: 'solution', label: t('solutionLabel') },
    ...listSections.map(({ id, title }) => ({ id, label: title })),
    { id: 'stack', label: t('stackLabel') },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCrumb('home'), path: '/' },
          { name: t('title'), path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ]}
      />

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

      <TableOfContents items={toc} />

      {cover && cover.kind === 'image' && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={cover.url} alt={cover.alt} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <section aria-labelledby="problem" className="flex flex-col gap-3">
        <AnchorHeading id="problem" className={headingClass}>
          {t('problemLabel')}
        </AnchorHeading>
        <p className="text-fg">{project.problem}</p>
      </section>

      <section aria-labelledby="solution" className="flex flex-col gap-3">
        <AnchorHeading id="solution" className={headingClass}>
          {t('solutionLabel')}
        </AnchorHeading>
        <p className="text-fg">{project.solution}</p>
      </section>

      {listSections.map((section) => (
        <Section key={section.id} {...section} />
      ))}

      <section aria-labelledby="stack" className="flex flex-col gap-3">
        <AnchorHeading id="stack" className={headingClass}>
          {t('stackLabel')}
        </AnchorHeading>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <nav aria-label={t('moreProjects')} className="flex flex-col gap-4 border-t border-border pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {previous && (
            <Link
              href={`/projects/${previous.slug}`}
              rel="prev"
              className="flex flex-col gap-1 rounded-lg border border-border p-4 hover:border-accent"
            >
              <span className="text-xs uppercase tracking-wide text-fg-muted">
                ← {t('previousProject')}
              </span>
              <span className="font-medium text-fg">{previous.title}</span>
            </Link>
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              rel="next"
              className="flex flex-col gap-1 rounded-lg border border-border p-4 text-right hover:border-accent sm:col-start-2"
            >
              <span className="text-xs uppercase tracking-wide text-fg-muted">
                {t('nextProject')} →
              </span>
              <span className="font-medium text-fg">{next.title}</span>
            </Link>
          )}
        </div>
        <Link
          href="/projects"
          className="self-start py-1 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          {t('allProjects')}
        </Link>
      </nav>
    </div>
  );
}
