import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import type { Cv } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { requireLocale } from '@/i18n/locale';
import { getCv, getPublicProjects } from '@/lib/content';
import { skillTree, timeline } from '@/lib/experience';
import { pageMetadata } from '@/lib/seo';

type ExperiencePageProps = {
  params: Promise<{ locale: string }>;
};

type Period = Cv['experience'][number]['period'];

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'experience' });

  return pageMetadata({ locale, path: '/experience', title: t('title'), description: t('description') });
}

const headingClass = 'text-xl font-semibold text-fg';
const linkClass = 'text-accent underline underline-offset-4 hover:decoration-2';

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('experience');
  const format = await getFormatter();
  const cv = getCv(locale);
  const entries = timeline(cv);
  const tree = skillTree(cv, getPublicProjects(locale));

  // Months are stated as YYYY-MM; format them in UTC so the month never shifts.
  const month = (value: string) =>
    format.dateTime(new Date(`${value}-01T00:00:00Z`), { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const period = ({ start, end }: Period) =>
    start === end ? month(start) : t('period', { start: month(start), end: end ? month(end) : t('present') });

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
        <p>
          <Link href="/cv" className={linkClass}>
            {t('cvLink')}
          </Link>
        </p>
      </header>

      <section aria-labelledby="timeline" className="flex flex-col gap-6">
        <h2 id="timeline" className={headingClass}>
          {t('timeline')}
        </h2>
        <ol className="flex flex-col border-l-2 border-border">
          {entries.map((entry) => (
            <li key={`${entry.kind}-${entry.title}-${entry.period.start}`} className="relative pb-8 pl-6 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-canvas ${
                  entry.period.end === null ? 'bg-accent' : 'bg-fg-muted'
                }`}
              />
              <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-muted">
                <span>{period(entry.period)}</span>
                <span className="rounded-full border border-border px-2 py-0.5">{t(`kinds.${entry.kind}`)}</span>
              </p>
              <h3 className="mt-1 font-semibold text-fg">
                {entry.slug ? (
                  <Link href={`/projects/${entry.slug}`} className={linkClass}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
                {entry.organization && <span className="font-normal text-fg-muted">, {entry.organization}</span>}
              </h3>
              {entry.text && <p className="mt-1 text-fg">{entry.text}</p>}
              {entry.parts.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 text-fg">
                  {entry.parts.map((part) => (
                    <li key={part.name}>
                      {part.slug ? (
                        <Link href={`/projects/${part.slug}`} className={linkClass}>
                          {part.name}
                        </Link>
                      ) : (
                        part.name
                      )}
                      {part.period && <span className="text-sm text-fg-muted"> ({period(part.period)})</span>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 id="skills" className={headingClass}>
            {t('skills')}
          </h2>
          <p className="text-sm text-fg-muted">{t('skillsNote')}</p>
        </div>
        {tree.map((group) => (
          <div key={group.area} className="flex flex-col gap-2">
            <h3 className="font-semibold text-fg">{group.area}</h3>
            <ul className="flex flex-col gap-1">
              {group.skills.map((skill) => (
                <li key={skill.name} className="text-fg">
                  {skill.name}
                  {skill.projects.length > 0 && (
                    <span className="text-sm text-fg-muted">
                      {' '}
                      {t('usedIn')}{' '}
                      {skill.projects.map((project, index) => (
                        <span key={project.slug}>
                          {index > 0 && ', '}
                          <Link href={`/projects/${project.slug}`} className={linkClass}>
                            {project.title}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
