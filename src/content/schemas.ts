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
    /** The same image captured in the dark theme, shown when the site is dark. */
    darkUrl: mediaUrl.optional(),
    /**
     * `cover` (the default) is the wide image on the card and at the top of
     * the page; `screen` is an app screen, shown uncropped in the gallery.
     */
    presentation: z.enum(['cover', 'screen']).optional(),
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

/**
 * Evidence that earns XP (ADR-0013), declared with the link that proves it.
 * Screens are not declared: the gallery itself is their proof, so they are
 * derived from `media`.
 */
export const xpEvidenceKindSchema = z.enum(['production', 'public-code', 'decision-records']);

/** A section of the project's own page, such as `#outcomes`. */
const projectSectionAnchor = z.enum([
  '#problem',
  '#solution',
  '#architecture',
  '#challenges',
  '#responsibilities',
  '#outcomes',
  '#learnings',
]);

const anchorSection = {
  '#problem': 'problem',
  '#solution': 'solution',
  '#architecture': 'architectureHighlights',
  '#challenges': 'challenges',
  '#responsibilities': 'responsibilities',
  '#outcomes': 'outcomes',
  '#learnings': 'learnings',
} as const;

export const xpEvidenceSchema = z.strictObject({
  kind: xpEvidenceKindSchema,
  href: z.union([httpsUrl, projectSectionAnchor]),
});

const githubRepository = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
const githubAdrFolder = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/tree\/[\w.-]+\/(?:.+\/)?adr\/?$/;

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
  xpEvidence: z.array(xpEvidenceSchema),
}).superRefine((project, ctx) => {
  // Each kind of evidence counts once, and each needs the proof its kind
  // implies: the page must be able to show what the XP claims.
  const seen = new Set<string>();
  project.xpEvidence.forEach(({ kind, href }, index) => {
    const path = ['xpEvidence', index, 'href'];
    if (seen.has(kind)) {
      ctx.addIssue({ code: 'custom', path: ['xpEvidence', index, 'kind'], message: `"${kind}" is declared twice` });
    }
    seen.add(kind);
    if (kind === 'public-code' && !githubRepository.test(href)) {
      ctx.addIssue({ code: 'custom', path, message: 'public code needs a link to a public GitHub repository' });
    }
    if (kind === 'decision-records' && !githubAdrFolder.test(href)) {
      ctx.addIssue({ code: 'custom', path, message: 'decision records need a link to an ADR folder on GitHub' });
    }
    if (href.startsWith('#')) {
      if (kind !== 'production') {
        ctx.addIssue({ code: 'custom', path, message: 'only production can be proven by a section of the page' });
      }
      const field = anchorSection[href as keyof typeof anchorSection];
      const content = project[field];
      if (Array.isArray(content) ? content.length === 0 : !content) {
        ctx.addIssue({ code: 'custom', path, message: `${href} is empty on this page` });
      }
    }
  });
});

/** A legal page (privacy notice and similar): plain sections of paragraphs. */
export const legalPageSchema = z.strictObject({
  title: text,
  summary: text,
  updatedAt: isoDate,
  sections: z
    .array(z.strictObject({ heading: text, paragraphs: z.array(text).min(1) }))
    .min(1),
});

/** Site-wide settings: identity, canonical URL and outbound links. */
export const siteSettingsSchema = z.strictObject({
  name: text,
  url: httpsUrl,
  repositoryUrl: httpsUrl,
  contactEmail: z.email(),
  privacyEmail: z.email(),
  securityEmail: z.email(),
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
  /** How Felipe works, for /about; kept true to AI.md and the repository itself. */
  howIWork: z.array(text).min(1),
  highlights: z.array(text),
  highlightStats: z.array(highlightStatSchema),
});

/** A month as `YYYY-MM`: CV periods are stated to the month, never to the day. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

/** From one month to another, or to the present when `end` is null. */
const cvPeriodSchema = z
  .strictObject({ start: yearMonth, end: yearMonth.nullable() })
  .refine((period) => period.end === null || period.end >= period.start, {
    message: 'A period cannot end before it starts',
  });

/** A product or engagement inside a role, with its own period when it has one. */
const cvProjectSchema = z.strictObject({
  name: text,
  url: httpsUrl.optional(),
  /** The project's own page on this site, when it has one. */
  slug: slug.optional(),
  description: text,
  period: cvPeriodSchema.optional(),
  bullets: z.array(text).min(1),
});

/**
 * The public CV (ADR-0010): the single source for `/cv`, its PDF and the
 * planned `/experience` and `/about` pages. Contact data is limited to what
 * the site already publishes; no phone number, no personal address.
 */
export const cvSchema = z.strictObject({
  name: text,
  headline: text,
  stack: z.array(text).min(1),
  location: text,
  summary: z.array(text).min(1),
  skills: z.array(z.strictObject({ area: text, items: z.array(text).min(1) })).min(1),
  experience: z
    .array(
      z.strictObject({
        role: text,
        organization: text,
        period: cvPeriodSchema,
        terms: text,
        bullets: z.array(text),
        projects: z.array(cvProjectSchema),
      }),
    )
    .min(1),
  ownProjects: z
    .array(
      z.strictObject({
        name: text,
        url: httpsUrl.optional(),
        slug: slug.optional(),
        period: cvPeriodSchema.optional(),
        text,
      }),
    )
    .min(1),
  earlierExperience: z.array(
    z.strictObject({
      title: text,
      context: text,
      /** Where it sits on the /experience timeline. */
      kind: z.enum(['work', 'research', 'teaching', 'project']),
      /** Items without an exact period stay off the timeline. */
      period: cvPeriodSchema.optional(),
      text,
    }),
  ),
  education: z
    .array(
      z.strictObject({
        title: text,
        institution: text,
        period: text,
        span: cvPeriodSchema.optional(),
        note: text.optional(),
      }),
    )
    .min(1),
  courses: z.array(text),
  languages: z.array(text).min(1),
});
