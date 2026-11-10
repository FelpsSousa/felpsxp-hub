import type { z } from 'zod';
import type { AppLocale } from '@/i18n/routing';
import type {
  highlightStatSchema,
  navigationLinkSchema,
  profileSchema,
  projectDifficultySchema,
  projectMediaSchema,
  projectSchema,
  projectStatusSchema,
  projectTypeSchema,
  projectVisibilitySchema,
  siteSettingsSchema,
  skillDomainSchema,
  surfaceKeySchema,
} from '@/content/schemas';

/**
 * Content that differs by locale is keyed by `AppLocale` rather than
 * duplicated as separate exports, matching hub-web's pattern.
 */
export type Localized<T> = Record<AppLocale, T>;

// Every type below is inferred from its Zod schema in `schemas.ts`
// (ADR-0004), so the runtime validation and the compile-time type are the
// same definition. Field-level documentation lives on the schemas.

export type NavigationLink = z.infer<typeof navigationLinkSchema>;
export type HighlightStat = z.infer<typeof highlightStatSchema>;
export type SurfaceKey = z.infer<typeof surfaceKeySchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>;
export type ProjectVisibility = z.infer<typeof projectVisibilitySchema>;
export type SkillDomain = z.infer<typeof skillDomainSchema>;
export type ProjectDifficulty = z.infer<typeof projectDifficultySchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type ProjectMediaImage = Extract<ProjectMedia, { kind: 'image' }>;
export type ProjectMediaVideo = Extract<ProjectMedia, { kind: 'video' }>;
export type ProjectMediaAudio = Extract<ProjectMedia, { kind: 'audio' }>;
export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
