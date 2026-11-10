import { profileByLocale } from '@/content/profile/profile';
import { beecrowdProblemSolvingProjectByLocale } from '@/content/projects/beecrowd-problem-solving';
import { candidattusProjectByLocale } from '@/content/projects/candidattus';
import { connexiccoProjectByLocale } from '@/content/projects/connexicco';
import { exampleAuroraMetricsProjectByLocale } from '@/content/projects/example-aurora-metrics';
import { exampleNimbusInventoryProjectByLocale } from '@/content/projects/example-nimbus-inventory';
import { exampleTaskflowProjectByLocale } from '@/content/projects/example-taskflow';
import { felpsxpArchitectureProjectByLocale } from '@/content/projects/felpsxp-architecture';
import { felpsxpFinanceProjectByLocale } from '@/content/projects/felpsxp-finance';
import { felpsxpHubProjectByLocale } from '@/content/projects/felpsxp-hub';
import { felpsxpPlatformProjectByLocale } from '@/content/projects/felpsxp-platform';
import { homeNetworkObservabilityProjectByLocale } from '@/content/projects/home-network-observability';
import type { Project } from '@/content/types';
import type { AppLocale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';

function projectRecords(locale: AppLocale): Project[] {
  return [
    felpsxpHubProjectByLocale[locale],
    felpsxpPlatformProjectByLocale[locale],
    felpsxpFinanceProjectByLocale[locale],
    homeNetworkObservabilityProjectByLocale[locale],
    felpsxpArchitectureProjectByLocale[locale],
    beecrowdProblemSolvingProjectByLocale[locale],
    candidattusProjectByLocale[locale],
    connexiccoProjectByLocale[locale],
    exampleTaskflowProjectByLocale[locale],
    exampleAuroraMetricsProjectByLocale[locale],
    exampleNimbusInventoryProjectByLocale[locale],
  ];
}

export function getProfile(locale: AppLocale) {
  return profileByLocale[locale];
}

export function getPublicProjects(locale: AppLocale) {
  return projectRecords(locale).filter((project) => project.visibility === 'public');
}

export function getProjectBySlug(slug: string, locale: AppLocale) {
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
