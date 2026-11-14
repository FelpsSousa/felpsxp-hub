import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { requireLocale } from '@/i18n/locale';
import { buildInfo } from '@/lib/build-info';
import { getChangelog, type ChangelogRelease } from '@/lib/changelog';
import { pageMetadata } from '@/lib/seo';

type ChangelogPageProps = {
  params: Promise<{ locale: string }>;
};

/** release-please's section titles, mapped to translation keys. */
const sectionKeys: Record<string, string> = {
  Features: 'features',
  'Bug Fixes': 'fixes',
  Security: 'security',
  'Performance Improvements': 'performance',
  Reverts: 'reverts',
  '⚠ BREAKING CHANGES': 'breaking',
};

const linkClass = 'inline-block py-1 underline underline-offset-4 hover:text-fg';

/** Renders `code` spans from a commit subject; everything else stays plain text. */
function InlineCode({ text }: { text: string }) {
  return text.split('`').map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="rounded bg-surface px-1 font-mono text-[0.9em]">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

export async function generateMetadata({ params }: ChangelogPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'changelog' });

  return pageMetadata({
    locale,
    path: '/changelog',
    title: t('title'),
    description: t('lede'),
  });
}

export default async function ChangelogPage({ params }: ChangelogPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('changelog');
  const format = await getFormatter();
  const releases = getChangelog();

  // Date-only values are UTC midnight; format in UTC so the day never shifts.
  const released = (release: ChangelogRelease) =>
    t('released', {
      date: format.dateTime(new Date(release.date), { dateStyle: 'long', timeZone: 'UTC' }),
    });
  const sectionTitle = (title: string) =>
    sectionKeys[title] ? t(`sections.${sectionKeys[title]}`) : title;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
        <p className="text-sm text-fg-muted">
          <a href={buildInfo().releasesUrl} className={linkClass}>
            {t('allReleases')}
          </a>
        </p>
      </header>

      {releases.length === 0 && <p className="text-fg">{t('empty')}</p>}

      {releases.map((release) => (
        <section
          key={release.id}
          id={release.id}
          aria-labelledby={`${release.id}-heading`}
          className="flex scroll-mt-8 flex-col gap-4"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id={`${release.id}-heading`} className="font-mono text-xl font-semibold text-fg">
              <a href={`#${release.id}`} className="hover:underline hover:underline-offset-4">
                {release.id}
              </a>
            </h2>
            <p className="text-sm text-fg-muted">
              <time dateTime={release.date}>{released(release)}</time>
              {' · '}
              <a
                href={release.releaseUrl}
                aria-label={t('releaseLink', { version: release.version })}
                className={linkClass}
              >
                GitHub
              </a>
            </p>
          </header>

          {release.sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
                {sectionTitle(section.title)}
              </h3>
              <ul className="flex flex-col gap-2 pl-5 text-fg [list-style:disc]">
                {section.entries.map((entry, index) => (
                  <li key={index} className="leading-relaxed">
                    {entry.scope && <span className="font-semibold">{entry.scope}: </span>}
                    <InlineCode text={entry.text} />
                    {(entry.pullRequest || entry.commit) && (
                      <span className="text-sm text-fg-muted">
                        {entry.pullRequest && (
                          <>
                            {' '}
                            <a
                              href={entry.pullRequest.url}
                              aria-label={t('pullRequest', { number: entry.pullRequest.number })}
                              className={linkClass}
                            >
                              #{entry.pullRequest.number}
                            </a>
                          </>
                        )}
                        {entry.commit && (
                          <>
                            {entry.pullRequest ? ' · ' : ' '}
                            <a
                              href={entry.commit.url}
                              aria-label={t('commit', { commit: entry.commit.short })}
                              className={`${linkClass} font-mono`}
                            >
                              {entry.commit.short}
                            </a>
                          </>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}
