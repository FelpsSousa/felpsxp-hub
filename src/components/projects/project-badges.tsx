import {
  ArchiveIcon,
  ChecklistIcon,
  GoalIcon,
  type Icon,
  PulseIcon,
  ToolsIcon,
} from '@primer/octicons-react';
import { useTranslations } from 'next-intl';
import { Badge, type Tone } from '@/components/ui/primitives';
import type { Project, ProjectStatus } from '@/content/types';
import { projectXp } from '@/lib/skill-taxonomy';

/**
 * The badges of a project, as chosen on /design on 2026-11-26 (ADR-0012):
 * the status on a muted fill in its tone, with an icon (option C); the level
 * outlined and neutral; the XP of ADR-0013 in the pixel face, at the height
 * of the other badges (option B).
 */
export const statusTone: Record<ProjectStatus, Tone> = {
  planned: 'info',
  active: 'success',
  evolving: 'attention',
  paused: 'neutral',
  archived: 'neutral',
};

/** The left stripe of a card in the status tone (card option C). */
export const statusStripe: Record<ProjectStatus, string> = {
  planned: 'border-l-link',
  active: 'border-l-success',
  evolving: 'border-l-attention',
  paused: 'border-l-border',
  archived: 'border-l-border',
};

const statusIcon: Record<ProjectStatus, Icon> = {
  planned: GoalIcon,
  active: PulseIcon,
  evolving: ToolsIcon,
  paused: ChecklistIcon,
  archived: ArchiveIcon,
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const t = useTranslations('projects');
  return (
    <Badge tone={statusTone[status]} filled icon={statusIcon[status]}>
      {t(`status.${status}`)}
    </Badge>
  );
}

export function LevelBadge({ level }: { level: Project['difficulty'] }) {
  const t = useTranslations('projects');
  return <Badge>{t(`filters.levels.${level}`)}</Badge>;
}

export function XpBadge({ project, className = '' }: { project: Project; className?: string }) {
  const t = useTranslations('projects');
  return (
    <span
      className={`rounded-full bg-accent-muted px-2 py-1 font-pixel text-[0.5625rem] leading-none text-accent ${className}`}
    >
      {t('xp.badge', { points: projectXp(project) })}
    </span>
  );
}

/** Status, level and XP in one row, as on the card and the project page. */
export function ProjectBadges({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={project.status} />
      <LevelBadge level={project.difficulty} />
      <XpBadge project={project} className="ml-auto" />
    </div>
  );
}
