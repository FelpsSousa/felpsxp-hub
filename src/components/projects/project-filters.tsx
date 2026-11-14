'use client';

import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ProjectDifficulty, SkillDomain } from '@/content/types';
import { Link } from '@/i18n/navigation';
import {
  filterOptions,
  filtersQuery,
  matchesFilters,
  parseProjectFilters,
  type FilterableProject,
  type FilterVocabulary,
  type ProjectFilters,
} from '@/lib/project-filters';

export type FilterableCard = FilterableProject & { slug: string; card: ReactNode };

const chipClass =
  'inline-block rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-accent';
const activeChip = `${chipClass} border-accent text-accent`;
const idleChip = `${chipClass} border-border text-fg-muted hover:border-accent/50 hover:text-fg`;
const emptyChip = `${chipClass} border-border text-fg-muted opacity-60`;

/** One row of filter chips; "all" first, then each value with its count. */
function FilterGroup<T extends string>({
  id,
  allLabel,
  title,
  current,
  values,
  label,
  set,
}: {
  id: string;
  allLabel: string;
  title: string;
  current: T | null;
  values: { value: T; count: number }[];
  label: (value: T) => string;
  set: (value: T | null) => ProjectFilters;
}) {
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
      <p id={id} className="text-xs font-medium uppercase tracking-wide text-fg-muted">
        {title}
      </p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={`/projects${filtersQuery(set(null))}`}
            scroll={false}
            aria-current={current === null ? 'true' : undefined}
            className={current === null ? activeChip : idleChip}
          >
            {allLabel}
          </Link>
        </li>
        {values.map(({ value, count }) => (
          <li key={value}>
            {count === 0 && current !== value ? (
              <span className={emptyChip}>
                {label(value)} <span className="font-mono text-xs">0</span>
              </span>
            ) : (
              <Link
                href={`/projects${filtersQuery(set(value))}`}
                scroll={false}
                aria-current={current === value ? 'true' : undefined}
                className={current === value ? activeChip : idleChip}
              >
                {label(value)} <span className="font-mono text-xs">{count}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The projects list with domain and level filters kept in the URL query.
 * The cards are rendered on the server and passed in; this component only
 * decides which ones to show, so the page stays statically rendered.
 */
export function ProjectFiltersList({
  items,
  vocabulary,
  domainLabels,
}: {
  items: FilterableCard[];
  vocabulary: FilterVocabulary;
  domainLabels: Record<SkillDomain, string>;
}) {
  const t = useTranslations('projects.filters');
  const filters = parseProjectFilters(useSearchParams(), vocabulary);
  const options = filterOptions(items, filters, vocabulary);
  const shown = items.filter((item) => matchesFilters(item, filters));
  const active = filters.domain !== null || filters.level !== null;

  const levelLabel = (level: ProjectDifficulty) => t(`levels.${level}`);

  return (
    <div className="flex flex-col gap-6">
      <section aria-label={t('label')} className="flex flex-col gap-4">
        <FilterGroup
          allLabel={t('all')}
          id="filter-domain"
          title={t('domain')}
          current={filters.domain}
          values={options.domains}
          label={(domain) => domainLabels[domain]}
          set={(domain) => ({ ...filters, domain })}
        />
        <FilterGroup
          allLabel={t('all')}
          id="filter-level"
          title={t('level')}
          current={filters.level}
          values={options.levels}
          label={levelLabel}
          set={(level) => ({ ...filters, level })}
        />
        <p role="status" className="flex flex-wrap items-center gap-x-3 text-sm text-fg-muted">
          {t('showing', { shown: shown.length, total: items.length })}
          {active && (
            <Link
              href="/projects"
              scroll={false}
              className="inline-block py-1 underline underline-offset-4 hover:text-fg"
            >
              {t('clear')}
            </Link>
          )}
        </p>
      </section>

      {shown.length === 0 ? (
        <p className="text-fg">{t('empty')}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {shown.map((item) => (
            <div key={item.slug}>{item.card}</div>
          ))}
        </div>
      )}
    </div>
  );
}
