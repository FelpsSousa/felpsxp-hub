import type { AppLocale } from '@/i18n/routing';

/**
 * Content that differs by locale is keyed by `AppLocale` rather than
 * duplicated as separate exports, matching hub-web's pattern.
 */
export type Localized<T> = Record<AppLocale, T>;

export type HighlightStat = {
  value: string;
  label: string;
};

export type Profile = {
  displayName: string;
  title: string;
  location: string;
  languages: string[];
  shortBio: string;
  summaryParagraphs: string[];
  currentFocus: string[];
  principles: string[];
  highlights: string[];
  highlightStats: HighlightStat[];
};
