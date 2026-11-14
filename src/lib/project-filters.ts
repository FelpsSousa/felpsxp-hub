import type { ProjectDifficulty, SkillDomain } from '@/content/types';

/**
 * Filters for the projects list, kept in the URL query (`?domain=appsec&level=advanced`)
 * so a filtered list can be shared and the browser's back button returns to it.
 * Unknown values are ignored instead of producing an empty list.
 *
 * The allowed values come in as a `FilterVocabulary` instead of being imported
 * from the content schemas, so this module stays free of Zod in the browser.
 */

export type FilterVocabulary = {
  domains: readonly SkillDomain[];
  levels: readonly ProjectDifficulty[];
};

export type ProjectFilters = {
  domain: SkillDomain | null;
  level: ProjectDifficulty | null;
};

/** What a project exposes to the filters. */
export type FilterableProject = {
  domains: readonly SkillDomain[];
  difficulty: ProjectDifficulty;
};

type QueryReader = { get(name: string): string | null };

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

export function parseProjectFilters(query: QueryReader, vocabulary: FilterVocabulary): ProjectFilters {
  return {
    domain: pick(query.get('domain'), vocabulary.domains),
    level: pick(query.get('level'), vocabulary.levels),
  };
}

export function matchesFilters(project: FilterableProject, filters: ProjectFilters): boolean {
  return (
    (filters.domain === null || project.domains.includes(filters.domain)) &&
    (filters.level === null || project.difficulty === filters.level)
  );
}

/** The query string for a set of filters, in a fixed order; empty when none is set. */
export function filtersQuery(filters: ProjectFilters): string {
  const params = new URLSearchParams();
  if (filters.domain) params.set('domain', filters.domain);
  if (filters.level) params.set('level', filters.level);
  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * Options worth offering: values that at least one project has, in taxonomy
 * order, with how many projects each would show given the other filter.
 */
export function filterOptions(
  projects: readonly FilterableProject[],
  filters: ProjectFilters,
  vocabulary: FilterVocabulary,
) {
  const count = (next: ProjectFilters) =>
    projects.filter((project) => matchesFilters(project, next)).length;

  return {
    domains: vocabulary.domains.filter((domain) =>
      projects.some((project) => project.domains.includes(domain)),
    ).map((domain) => ({ value: domain, count: count({ ...filters, domain }) })),
    levels: vocabulary.levels.filter((level) =>
      projects.some((project) => project.difficulty === level),
    ).map((level) => ({ value: level, count: count({ ...filters, level }) })),
  };
}
