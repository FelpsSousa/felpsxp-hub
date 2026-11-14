import { describe, expect, it } from 'vitest';
import {
  filterOptions,
  filtersQuery,
  matchesFilters,
  parseProjectFilters,
  type FilterableProject,
} from '@/lib/project-filters';
import { PROJECT_DIFFICULTIES, SKILL_DOMAINS } from '@/lib/skill-taxonomy';

const vocabulary = { domains: SKILL_DOMAINS, levels: PROJECT_DIFFICULTIES };

const query = (value: string) => new URLSearchParams(value);

const projects: FilterableProject[] = [
  { domains: ['appsec', 'backend'], difficulty: 'advanced' },
  { domains: ['frontend'], difficulty: 'applied' },
  { domains: ['backend', 'frontend'], difficulty: 'applied' },
];

describe('parseProjectFilters', () => {
  it('reads known values', () => {
    expect(parseProjectFilters(query('domain=appsec&level=advanced'), vocabulary)).toEqual({
      domain: 'appsec',
      level: 'advanced',
    });
  });

  it('ignores unknown or missing values', () => {
    expect(parseProjectFilters(query('domain=<script>&level=easy'), vocabulary)).toEqual({
      domain: null,
      level: null,
    });
    expect(parseProjectFilters(query(''), vocabulary)).toEqual({ domain: null, level: null });
  });
});

describe('matchesFilters', () => {
  it('matches any of a project’s domains and its exact difficulty', () => {
    const filters = { domain: 'backend', level: 'applied' } as const;
    expect(projects.map((project) => matchesFilters(project, filters))).toEqual([
      false,
      false,
      true,
    ]);
    expect(projects.every((project) => matchesFilters(project, { domain: null, level: null }))).toBe(
      true,
    );
  });
});

describe('filtersQuery', () => {
  it('writes the set filters in a fixed order and nothing when none is set', () => {
    expect(filtersQuery({ level: 'applied', domain: 'iam' })).toBe('?domain=iam&level=applied');
    expect(filtersQuery({ domain: null, level: 'applied' })).toBe('?level=applied');
    expect(filtersQuery({ domain: null, level: null })).toBe('');
  });
});

describe('filterOptions', () => {
  it('offers only values some project has, counted against the other filter', () => {
    const options = filterOptions(projects, { domain: null, level: 'applied' }, vocabulary);
    expect(options.domains).toEqual([
      { value: 'appsec', count: 0 },
      { value: 'backend', count: 1 },
      { value: 'frontend', count: 2 },
    ]);
    expect(options.levels).toEqual([
      { value: 'applied', count: 2 },
      { value: 'advanced', count: 1 },
    ]);
  });
});
