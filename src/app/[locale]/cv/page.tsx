import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { PrintButton } from '@/components/cv/print-button';
import type { Cv } from '@/content/types';
import { requireLocale } from '@/i18n/locale';
import { getCv, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type CvPageProps = {
  params: Promise<{ locale: string }>;
};

type Period = Cv['experience'][number]['period'];

export async function generateMetadata({ params }: CvPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'cv' });

  return pageMetadata({ locale, path: '/cv', title: t('title'), description: t('description') });
}

const sectionClass = 'flex flex-col gap-3 print:gap-1';
const headingClass =
  'border-b border-border pb-1 text-sm font-semibold uppercase tracking-wide text-fg-muted print:text-xs';
const listClass = 'flex list-disc flex-col gap-1 pl-5 text-fg print:gap-0';
const linkClass = 'text-accent underline underline-offset-4 hover:decoration-2';

export default async function CvPage({ params }: CvPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('cv');
  const format = await getFormatter();
  const cv = getCv(locale);
  const settings = getSiteSettings();

  // Months are stated as YYYY-MM; format them in UTC so the month never shifts.
  const month = (value: string) =>
    format.dateTime(new Date(`${value}-01T00:00:00Z`), { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const period = ({ start, end }: Period) =>
    t('period', { start: month(start), end: end ? month(end) : t('present') });

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 text-[0.95rem] print:max-w-none print:gap-3 print:px-0 print:py-0 print:text-[9.5pt] print:leading-snug">
      <header className="flex flex-col gap-2 print:gap-1">
        <h1 className="text-3xl font-semibold text-fg print:text-2xl">{cv.name}</h1>
        <p className="text-lg text-fg print:text-base">{cv.headline}</p>
        <p className="font-mono text-sm text-fg-muted">{cv.stack.join(' · ')}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
          <li>{cv.location}</li>
          <li>
            <a href={`mailto:${settings.contactEmail}`} className={linkClass}>
              {settings.contactEmail}
            </a>
          </li>
          <li>
            <a href={settings.url} className={linkClass}>
              {new URL(settings.url).host}
            </a>
          </li>
          {settings.socialLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass} rel="me noopener noreferrer">
                {link.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-col gap-2 print:hidden">
          <PrintButton label={t('print')} />
          <p className="text-sm text-fg-muted">{t('printHint')}</p>
        </div>
      </header>

      <section aria-labelledby="summary" className={sectionClass}>
        <h2 id="summary" className={headingClass}>
          {t('summary')}
        </h2>
        <ul className={listClass}>
          {cv.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills" className={sectionClass}>
        <h2 id="skills" className={headingClass}>
          {t('skills')}
        </h2>
        <dl className="flex flex-col gap-1 text-fg print:gap-0">
          {cv.skills.map((group) => (
            <div key={group.area} className="flex flex-wrap gap-x-2">
              <dt className="font-semibold">{group.area}:</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="experience" className="flex flex-col gap-5 print:gap-2">
        <h2 id="experience" className={headingClass}>
          {t('experience')}
        </h2>
        {cv.experience.map((job) => (
          <div key={`${job.organization}-${job.period.start}`} className="flex flex-col gap-2 print:gap-1">
            <div className="break-inside-avoid">
              <h3 className="font-semibold text-fg">
                {job.role}, {job.organization}
              </h3>
              <p className="text-sm text-fg-muted">
                {period(job.period)}. {job.terms}.
              </p>
            </div>
            {job.bullets.length > 0 && (
              <ul className={listClass}>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {job.projects.map((project) => (
              <div key={project.name} className="flex flex-col gap-1 break-inside-avoid pl-2">
                <h4 className="text-fg">
                  <span className="font-semibold">{project.name}</span>
                  {project.url && (
                    <>
                      {' '}
                      <a href={project.url} className={`${linkClass} text-sm`}>
                        ({new URL(project.url).host.replace(/^www\./, '')})
                      </a>
                    </>
                  )}
                  {project.period && <span className="text-sm text-fg-muted">, {period(project.period)}</span>}
                </h4>
                <p className="text-fg">{project.description}</p>
                <ul className={listClass}>
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section aria-labelledby="own-projects" className={sectionClass}>
        <h2 id="own-projects" className={headingClass}>
          {t('ownProjects')}
        </h2>
        <ul className={listClass}>
          {cv.ownProjects.map((project) => (
            <li key={project.name}>
              <span className="font-semibold">
                {project.url ? (
                  <a href={project.url} className={linkClass}>
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
                :
              </span>{' '}
              {project.text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="earlier" className={sectionClass}>
        <h2 id="earlier" className={headingClass}>
          {t('earlierExperience')}
        </h2>
        <ul className={listClass}>
          {cv.earlierExperience.map((item) => (
            <li key={item.title}>
              <span className="font-semibold">{item.title}</span> ({item.context}): {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="education" className={sectionClass}>
        <h2 id="education" className={headingClass}>
          {t('education')}
        </h2>
        <ul className={listClass}>
          {cv.education.map((item) => (
            <li key={item.title}>
              <span className="font-semibold">{item.title}</span>, {item.institution}, {item.period}
              {item.note && `, ${item.note.toLowerCase()}`}.
            </li>
          ))}
          {cv.courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="languages" className={sectionClass}>
        <h2 id="languages" className={headingClass}>
          {t('languages')}
        </h2>
        <ul className={listClass}>
          {cv.languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
