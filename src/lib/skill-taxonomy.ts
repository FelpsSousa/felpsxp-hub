import { projectDifficultySchema, skillDomainSchema } from '@/content/schemas';
import type { Project, ProjectDifficulty, SkillDomain, XpEvidence } from '@/content/types';
import { screenImages } from '@/lib/media';

export const SKILL_DOMAINS: readonly SkillDomain[] = skillDomainSchema.options;

export const PROJECT_DIFFICULTIES: readonly ProjectDifficulty[] = projectDifficultySchema.options;

const DOMAIN_LABEL: Record<SkillDomain, string> = {
  appsec: 'AppSec',
  iam: 'IAM',
  backend: 'Backend',
  frontend: 'Frontend',
  'devops-infra': 'DevOps/Infra',
  observability: 'Observability',
  data: 'Data',
};

export function domainLabel(domain: SkillDomain): string {
  return DOMAIN_LABEL[domain];
}

export function projectDomains(
  project: Pick<Project, 'primaryDomain' | 'secondaryDomains'>,
): SkillDomain[] {
  return [project.primaryDomain, ...project.secondaryDomains];
}

/**
 * Project XP (ADR-0013): a public rubric, computed at build time from the
 * content and never per visitor. The level gives the base, in bands that do
 * not overlap, and each piece of evidence the page can prove adds a fixed
 * bonus, so evidence ranks projects within a level but never across levels.
 */
export const XP_LEVEL_BASE: Record<ProjectDifficulty, number> = {
  foundational: 10,
  applied: 35,
  advanced: 60,
  frontier: 100,
};

export const XP_EVIDENCE_BONUS = 5;

export type XpEvidenceKind = XpEvidence['kind'] | 'screens';

/** Every kind of evidence, in the order the legend and the breakdown use. */
export const XP_EVIDENCE_KINDS: readonly XpEvidenceKind[] = [
  'production',
  'public-code',
  'decision-records',
  'screens',
];

/** The most a project can add on top of its level. */
export const XP_MAX_BONUS = XP_EVIDENCE_KINDS.length * XP_EVIDENCE_BONUS;

export type XpPart =
  | { kind: 'level'; level: ProjectDifficulty; points: number }
  | { kind: XpEvidenceKind; points: number; href: string };

type XpInput = Pick<Project, 'difficulty' | 'xpEvidence' | 'media'>;

/** The parts of a project's XP: its level first, then its evidence. */
export function projectXpBreakdown(project: XpInput): XpPart[] {
  const declared = new Map<XpEvidenceKind, string>(project.xpEvidence.map(({ kind, href }) => [kind, href]));
  if (screenImages(project).length > 0) declared.set('screens', '#screens');

  return [
    { kind: 'level', level: project.difficulty, points: XP_LEVEL_BASE[project.difficulty] },
    ...XP_EVIDENCE_KINDS.flatMap((kind) => {
      const href = declared.get(kind);
      return href ? [{ kind, points: XP_EVIDENCE_BONUS, href }] : [];
    }),
  ];
}

export function projectXp(project: XpInput): number {
  return projectXpBreakdown(project).reduce((total, part) => total + part.points, 0);
}
