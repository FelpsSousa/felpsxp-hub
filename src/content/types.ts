import type { AppLocale } from '@/i18n/routing';

/**
 * Content that differs by locale is keyed by `AppLocale` rather than
 * duplicated as separate exports, matching hub-web's pattern.
 */
export type Localized<T> = Record<AppLocale, T>;

export type NavigationLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type HighlightStat = {
  value: string;
  label: string;
};

export type SurfaceKey = 'platform' | 'hub' | 'store' | 'farm' | 'sentinel' | 'command' | 'finance';

export type ProjectStatus = 'planned' | 'active' | 'evolving' | 'paused' | 'archived';

export type ProjectType = 'surface' | 'platform' | 'system' | 'product' | 'tooling' | 'experiment';

export type ProjectVisibility = 'public' | 'unlisted' | 'private';

/**
 * Fixed, small taxonomy for filtering projects by skill area: a recruiter
 * should recognize every value in seconds, not get a complete internal map.
 */
export type SkillDomain =
  | 'appsec'
  | 'iam'
  | 'backend'
  | 'frontend'
  | 'devops-infra'
  | 'observability'
  | 'data';

export type ProjectDifficulty = 'foundational' | 'applied' | 'advanced' | 'frontier';

/**
 * Gallery media for a project's detail page. A discriminated union, not
 * three optional arrays on Project, so a consumer renders a single ordered
 * `media` list without caring which kind each item is.
 */
export type ProjectMediaImage = {
  kind: 'image';
  url: string;
  alt: string;
  caption?: string;
};

export type ProjectMediaVideo = {
  kind: 'video';
  url: string;
  caption?: string;
};

export type ProjectMediaAudio = {
  kind: 'audio';
  url: string;
  caption?: string;
};

export type ProjectMedia = ProjectMediaImage | ProjectMediaVideo | ProjectMediaAudio;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  type: ProjectType;
  difficulty: ProjectDifficulty;
  primaryDomain: SkillDomain;
  secondaryDomains: SkillDomain[];
  /**
   * True only for deliberately fictional demo projects. Drives a visible
   * "Example" badge; never silently inferred from any other field.
   */
  isExample: boolean;
  media: ProjectMedia[];
  role: string;
  problem: string;
  solution: string;
  architectureHighlights: string[];
  challenges: string[];
  responsibilities: string[];
  outcomes: string[];
  learnings: string[];
  stack: string[];
  tags: string[];
  relatedSurfaceKeys: SurfaceKey[];
  startedAt: string;
  updatedAt: string;
  featured: boolean;
  links?: NavigationLink[];
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
