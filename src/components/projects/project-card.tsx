import Image from 'next/image';
import type { Project } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { ProjectBadges, statusStripe } from '@/components/projects/project-badges';
import { coverImage } from '@/lib/media';
import { domainLabel, projectDomains } from '@/lib/skill-taxonomy';

/**
 * One project as a linked card, used by the projects list and the home page:
 * option C of /design (ADR-0012), a side stripe in the status tone with the
 * status, level and XP badges on top. `headingLevel` keeps the document
 * outline correct wherever it is placed.
 */
export function ProjectCard({
  project,
  headingLevel = 'h2',
}: {
  project: Project;
  headingLevel?: 'h2' | 'h3';
}) {
  const cover = coverImage(project);
  const Heading = headingLevel;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`flex h-full flex-col gap-3 rounded-md border border-l-4 border-border p-5 transition hover:border-t-accent/50 hover:border-r-accent/50 hover:border-b-accent/50 ${
        statusStripe[project.status]
      }`}
    >
      {cover && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      )}

      <ProjectBadges project={project} />

      <Heading className="text-xl font-medium text-fg">{project.title}</Heading>
      <p className="flex-1 text-fg">{project.summary}</p>

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
