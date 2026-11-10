import type { Project, ProjectDifficulty, SkillDomain } from '@/content/types';

export const SKILL_DOMAINS: SkillDomain[] = [
  'appsec',
  'iam',
  'backend',
  'frontend',
  'devops-infra',
  'observability',
  'data',
];

export const PROJECT_DIFFICULTIES: ProjectDifficulty[] = [
  'foundational',
  'applied',
  'advanced',
  'frontier',
];

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

const DIFFICULTY_WEIGHT: Record<ProjectDifficulty, number> = {
  foundational: 1,
  applied: 2,
  advanced: 3,
  frontier: 5,
};

/**
 * Cosmetic-only "XP", computed on the fly from static metadata, never
 * persisted or scored per visitor. A real points/progression system was
 * deliberately rejected for the Hub.
 */
export function projectXp(project: Pick<Project, 'difficulty' | 'secondaryDomains'>): number {
  const domainCount = 1 + project.secondaryDomains.length;
  return DIFFICULTY_WEIGHT[project.difficulty] * domainCount;
}
