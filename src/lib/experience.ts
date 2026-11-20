import type { Cv, Project } from '@/content/types';

type Period = Cv['experience'][number]['period'];

export type TimelineKind = 'work' | 'research' | 'teaching' | 'project' | 'education';

export type TimelineEntry = {
  kind: TimelineKind;
  title: string;
  organization?: string;
  period: Period;
  text?: string;
  /** A project page on this site. */
  slug?: string;
  /** Products inside a role, each with its own period. */
  parts: { name: string; period?: Period; slug?: string }[];
};

/**
 * The career timeline for /experience, built from the CV so nothing is
 * typed twice (ADR-0010): roles, own projects, research, teaching and
 * education. Items without an exact period stay off the timeline. Newest
 * first; entries still running come before finished ones that started later.
 */
export function timeline(cv: Cv): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...cv.experience.map((job) => ({
      kind: 'work' as const,
      title: job.role,
      organization: job.organization,
      period: job.period,
      parts: job.projects.map((project) => ({ name: project.name, period: project.period, slug: project.slug })),
    })),
    ...cv.ownProjects.flatMap((project) =>
      project.period
        ? [{ kind: 'project' as const, title: project.name, period: project.period, text: project.text, slug: project.slug, parts: [] }]
        : [],
    ),
    ...cv.earlierExperience.flatMap((item) =>
      item.period
        ? [{ kind: item.kind, title: item.title, period: item.period, text: item.text, parts: [] }]
        : [],
    ),
    ...cv.education.flatMap((item) =>
      item.span
        ? [{ kind: 'education' as const, title: item.title, organization: item.institution, period: item.span, text: item.note, parts: [] }]
        : [],
    ),
  ];

  const end = (period: Period) => period.end ?? '9999-12';
  return entries.sort(
    (a, b) => end(b.period).localeCompare(end(a.period)) || b.period.start.localeCompare(a.period.start),
  );
}

/** Lowercase, without accents, for matching a skill to a project's stack. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export type SkillArea = { area: string; skills: { name: string; projects: Pick<Project, 'slug' | 'title'>[] }[] };

/**
 * The skill tree: each CV skill with the public project pages whose stack
 * lists it, so a skill points at evidence when there is some.
 */
export function skillTree(cv: Cv, projects: Project[]): SkillArea[] {
  return cv.skills.map((group) => ({
    area: group.area,
    skills: group.items.map((name) => ({
      name,
      projects: projects
        .filter((project) => project.stack.some((tech) => normalize(tech) === normalize(name)))
        .map(({ slug, title }) => ({ slug, title })),
    })),
  }));
}
