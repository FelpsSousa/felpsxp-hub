import { profileByLocale } from '@/content/profile/profile';
import { beecrowdProblemSolvingProjectByLocale } from '@/content/projects/beecrowd-problem-solving';
import { candidattusProjectByLocale } from '@/content/projects/candidattus';
import { connexiccoProjectByLocale } from '@/content/projects/connexicco';
import { felpsxpArchitectureProjectByLocale } from '@/content/projects/felpsxp-architecture';
import { felpsxpFinanceProjectByLocale } from '@/content/projects/felpsxp-finance';
import { felpsxpHubProjectByLocale } from '@/content/projects/felpsxp-hub';
import { felpsxpPlatformProjectByLocale } from '@/content/projects/felpsxp-platform';
import { homeNetworkObservabilityProjectByLocale } from '@/content/projects/home-network-observability';
import { profileSchema, projectSchema } from '@/content/schemas';
import type { Localized, Profile, Project } from '@/content/types';
import type { AppLocale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { parseContent } from '@/lib/parse-content';

/** Display order of the projects list. */
const projectSources: Localized<Project>[] = [
  felpsxpHubProjectByLocale,
  felpsxpPlatformProjectByLocale,
  felpsxpFinanceProjectByLocale,
  homeNetworkObservabilityProjectByLocale,
  felpsxpArchitectureProjectByLocale,
  beecrowdProblemSolvingProjectByLocale,
  candidattusProjectByLocale,
  connexiccoProjectByLocale,
];

function byLocale<T>(build: (locale: AppLocale) => T): Localized<T> {
  return Object.fromEntries(locales.map((locale) => [locale, build(locale)])) as Localized<T>;
}

// Parsed once, when this module is first imported. Every page reads content
// through this module, so `next build` fails on a malformed record before
// any page is generated (ADR-0004).
const projectsByLocale = byLocale((locale) =>
  projectSources.map((source, index) =>
    parseContent(
      projectSchema,
      source[locale],
      `project "${source[locale]?.slug ?? `#${index}`}" (${locale})`,
    ),
  ),
);

const profilesByLocale = byLocale((locale) =>
  parseContent(profileSchema, profileByLocale[locale], `profile (${locale})`),
);

export function getProfile(locale: AppLocale): Profile {
  return profilesByLocale[locale];
}

/** Every project record for a locale, including unlisted and private ones. */
export function getAllProjects(locale: AppLocale): Project[] {
  return projectsByLocale[locale];
}

export function getPublicProjects(locale: AppLocale): Project[] {
  return getAllProjects(locale).filter((project) => project.visibility === 'public');
}

export function getProjectBySlug(slug: string, locale: AppLocale): Project | undefined {
  return getPublicProjects(locale).find((project) => project.slug === slug);
}

export function getProjectStaticParams() {
  // The [locale] segment above [slug] has no generateStaticParams of its
  // own, so Next.js needs every {locale, slug} pair from this leaf segment
  // to statically generate both locales. Returning the slug alone produces
  // an incomplete static output.
  return locales.flatMap((locale) =>
    getPublicProjects(locale).map((project) => ({
      locale,
      slug: project.slug,
    })),
  );
}
