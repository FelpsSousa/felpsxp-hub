import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { domainLabel, projectDomains, projectXp } from '@/lib/skill-taxonomy';

/**
 * One project as a linked card, used by the projects list and the home page.
 * `headingLevel` keeps the document outline correct wherever it is placed.
 */
export function ProjectCard({
  project,
  headingLevel = 'h2',
}: {
  project: Project;
  headingLevel?: 'h2' | 'h3';
}) {
  const t = useTranslations('projects.filters.levels');
  const cover = project.media.find((item) => item.kind === 'image');
  const Heading = headingLevel;

  return (
    <Link
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
        <span className="rounded-full border border-border px-2 py-0.5">{project.status}</span>
        <span className="rounded-full border border-border px-2 py-0.5">{t(project.difficulty)}</span>
        <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">
          ~{projectXp(project)} XP
        </span>
      </div>

      <Heading className="text-xl font-medium text-fg">{project.title}</Heading>
      <p className="text-fg">{project.summary}</p>

      <div className="flex flex-wrap gap-2">
        {projectDomains(project).map((domain) => (
          <span key={domain} className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg-muted">
            {domainLabel(domain)}
          </span>
        ))}
      </div>
    </Link>
  );
}
