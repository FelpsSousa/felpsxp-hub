import { z } from 'zod';

/**
 * Zod schemas for structured content (ADR-0004). They are the single
 * source of truth: the TypeScript types in `types.ts` are inferred from
 * them, so a schema and its type can never drift apart. Records are parsed
 * through these schemas in `src/lib/content.ts`, which fails the build with
 * a readable error instead of rendering a malformed record.
 */

const text = z.string().trim().min(1);

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase kebab-case');

/** A real calendar date in `YYYY-MM-DD` form. */
const isoDate = z.iso.date();

/** A same-origin asset path such as `/projects/felpsxp-hub/home.png`. */
const localPath = z
  .string()
  .regex(/^\/(?!\/)[^\s]*$/, 'must be a same-origin path starting with a single "/"');

/** External links must use HTTPS: no plain HTTP, no `javascript:` or `data:` URLs. */
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });

export const navigationLinkSchema = z.strictObject({
  href: z.union([httpsUrl, localPath]),
  label: text,
  external: z.boolean().optional(),
});

export const highlightStatSchema = z.strictObject({
  value: text,
  label: text,
});

export const surfaceKeySchema = z.enum([
  'platform',
  'hub',
  'store',
  'farm',
  'sentinel',
  'command',
  'finance',
]);

export const projectStatusSchema = z.enum(['planned', 'active', 'evolving', 'paused', 'archived']);

export const projectTypeSchema = z.enum([
  'surface',
  'platform',
  'system',
  'product',
  'tooling',
  'experiment',
]);

export const projectVisibilitySchema = z.enum(['public', 'unlisted', 'private']);

/**
 * Fixed, small taxonomy for filtering projects by skill area: a recruiter
 * should recognize every value in seconds, not get a complete internal map.
 */
export const skillDomainSchema = z.enum([
  'appsec',
  'iam',
  'backend',
  'frontend',
  'devops-infra',
  'observability',
  'data',
]);

export const projectDifficultySchema = z.enum(['foundational', 'applied', 'advanced', 'frontier']);

const mediaUrl = z.union([httpsUrl, localPath]);

/**
 * Gallery media for a project's detail page. A discriminated union, not
 * three optional arrays on Project, so a consumer renders a single ordered
 * `media` list without caring which kind each item is.
 */
export const projectMediaSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('image'),
    url: mediaUrl,
    alt: text,
    caption: text.optional(),
  }),
  z.strictObject({
    kind: z.literal('video'),
    url: mediaUrl,
    caption: text.optional(),
  }),
  z.strictObject({
    kind: z.literal('audio'),
    url: mediaUrl,
    caption: text.optional(),
  }),
]);

export const projectSchema = z.strictObject({
  slug,
  title: text,
  summary: text,
  status: projectStatusSchema,
  visibility: projectVisibilitySchema,
  type: projectTypeSchema,
  difficulty: projectDifficultySchema,
  primaryDomain: skillDomainSchema,
  secondaryDomains: z.array(skillDomainSchema),
  media: z.array(projectMediaSchema),
  role: text,
  problem: text,
  solution: text,
  architectureHighlights: z.array(text),
  challenges: z.array(text),
  responsibilities: z.array(text),
  outcomes: z.array(text),
  learnings: z.array(text),
  stack: z.array(text),
  tags: z.array(text),
  relatedSurfaceKeys: z.array(surfaceKeySchema),
  startedAt: isoDate,
  updatedAt: isoDate,
  featured: z.boolean(),
  links: z.array(navigationLinkSchema).optional(),
});

/** Site-wide settings: identity, canonical URL and outbound links. */
export const siteSettingsSchema = z.strictObject({
  name: text,
  url: httpsUrl,
  repositoryUrl: httpsUrl,
  socialLinks: z.array(navigationLinkSchema).min(1),
});

export const profileSchema = z.strictObject({
  displayName: text,
  title: text,
  location: text,
  languages: z.array(text).min(1),
  shortBio: text,
  summaryParagraphs: z.array(text).min(1),
  currentFocus: z.array(text),
  principles: z.array(text),
  highlights: z.array(text),
  highlightStats: z.array(highlightStatSchema),
});
