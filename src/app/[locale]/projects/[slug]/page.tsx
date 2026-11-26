import {
  BookIcon,
  ChecklistIcon,
  CodeIcon,
  DeviceCameraIcon,
  FlameIcon,
  type Icon,
  LightBulbIcon,
  RocketIcon,
  StackIcon,
  TrophyIcon,
} from '@primer/octicons-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { AnchorHeading, TableOfContents } from '@/components/navigation/section-anchors';
import { Link } from '@/i18n/navigation';
import type { TocItem } from '@/lib/anchors';
import { ProjectBadges } from '@/components/projects/project-badges';
import { ProjectScreens } from '@/components/projects/project-screens';
import { getAdjacentProjects, getProjectBySlug, getProjectStaticParams } from '@/lib/content';
import { coverImage, screenImages } from '@/lib/media';
import { pageMetadata } from '@/lib/seo';
import { domainLabel, projectDomains, projectXp, projectXpBreakdown } from '@/lib/skill-taxonomy';
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

/**
 * A section of the page as a Box with an icon and an anchored heading in its
 * header row (option B of /design, chosen on 2026-11-26, ADR-0012).
 */
function SectionBox({
  id,
  title,
  icon: IconComponent,
  children,
}: {
  id: string;
  title: string;
  icon: Icon;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
        <IconComponent aria-hidden size={16} className="shrink-0 text-fg-muted" />
        <AnchorHeading id={id} className="text-sm font-semibold text-fg">
          {title}
        </AnchorHeading>
      </div>
      {children}
    </section>
  );
}

function ListSection({ id, title, icon, items }: { id: string; title: string; icon: Icon; items: string[] }) {
  return (
    <SectionBox id={id} title={title} icon={icon}>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item} className="px-4 py-3 text-fg">
            {item}
          </li>
        ))}
      </ul>
    </SectionBox>
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

  const cover = coverImage(project);
  const screens = screenImages(project);
  const { previous, next } = getAdjacentProjects(project.slug, locale);
  const tCrumb = await getTranslations('breadcrumb');

  // Section ids are the same in every locale, so a link to a section keeps
  // working after the locale switcher changes the language.
  const listSections = [
    { id: 'architecture', title: t('architectureHighlightsLabel'), icon: StackIcon, items: project.architectureHighlights },
    { id: 'challenges', title: t('challengesLabel'), icon: FlameIcon, items: project.challenges },
    { id: 'responsibilities', title: t('responsibilitiesLabel'), icon: ChecklistIcon, items: project.responsibilities },
    { id: 'outcomes', title: t('outcomesLabel'), icon: TrophyIcon, items: project.outcomes },
    { id: 'learnings', title: t('learningsLabel'), icon: BookIcon, items: project.learnings },
  ].filter((section) => section.items.length > 0);
  const toc: TocItem[] = [
    { id: 'problem', label: t('problemLabel') },
    { id: 'solution', label: t('solutionLabel') },
    ...(screens.length > 0 ? [{ id: 'screens', label: t('screensLabel') }] : []),
    ...listSections.map(({ id, title }) => ({ id, label: title })),
    { id: 'stack', label: t('stackLabel') },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-20">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCrumb('home'), path: '/' },
          { name: t('title'), path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ]}
      />

      <header className="flex flex-col gap-3">
        <ProjectBadges project={project} />
        <h1 className="text-3xl font-semibold text-fg">{project.title}</h1>
        <p className="text-fg">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {projectDomains(project).map((domain) => (
            <span key={domain} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {domainLabel(domain)}
            </span>
          ))}
        </div>
        {/* The XP of ADR-0013, part by part, each piece of evidence linking to its proof. */}
        <div className="flex flex-col gap-1 text-sm text-fg-muted">
          <p className="font-medium text-fg">
            {t('xp.breakdownLabel')}:{' '}
            <span className="text-accent">{t('xp.breakdownTotal', { points: projectXp(project) })}</span>
          </p>
          <p>
            {projectXpBreakdown(project).map((part, index) => (
              <span key={part.kind}>
                {index > 0 && ' + '}
                {part.kind === 'level' ? (
                  `${t(`filters.levels.${part.level}`)} ${part.points}`
                ) : (
                  <a href={part.href} className="text-link underline underline-offset-4 hover:decoration-2">
                    {t(`xp.kinds.${part.kind}`)} {part.points}
                  </a>
                )}
              </span>
            ))}
            {' · '}
            <Link href="/projects#xp" className="text-link underline underline-offset-4 hover:decoration-2">
              {t('xp.howItWorks')}
            </Link>
          </p>
        </div>
      </header>

      <TableOfContents items={toc} />

      {cover && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image src={cover.url} alt={cover.alt} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <SectionBox id="problem" title={t('problemLabel')} icon={LightBulbIcon}>
        <p className="px-4 py-3 text-fg">{project.problem}</p>
      </SectionBox>

      <SectionBox id="solution" title={t('solutionLabel')} icon={RocketIcon}>
        <p className="px-4 py-3 text-fg">{project.solution}</p>
      </SectionBox>

      {screens.length > 0 && (
        <SectionBox id="screens" title={t('screensLabel')} icon={DeviceCameraIcon}>
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm text-fg-muted">{t('screensNote')}</p>
            <ProjectScreens screens={screens} />
          </div>
        </SectionBox>
      )}

      {listSections.map((section) => (
        <ListSection key={section.id} {...section} />
      ))}

      <SectionBox id="stack" title={t('stackLabel')} icon={CodeIcon}>
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {project.stack.map((tech) => (
            <span key={tech} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
              {tech}
            </span>
          ))}
        </div>
      </SectionBox>

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
