import { getFormatter, getTranslations } from 'next-intl/server';
import type { LegalPage } from '@/content/types';

/** Renders a legal page (privacy notice, security policy) with a contact line at the end. */
export async function LegalPageView({
  page,
  contactLabel,
  contactEmail,
}: {
  page: LegalPage;
  contactLabel: string;
  contactEmail: string;
}) {
  const t = await getTranslations('legal');
  const format = await getFormatter();
  // Date-only values are UTC midnight; format in UTC so the day never shifts.
  const updated = format.dateTime(new Date(page.updatedAt), { dateStyle: 'long', timeZone: 'UTC' });

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{page.title}</h1>
        <p className="text-fg">{page.summary}</p>
        <p className="text-sm text-fg-muted">
          <time dateTime={page.updatedAt}>{t('updated', { date: updated })}</time>
        </p>
      </header>

      {page.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-fg">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <p className="text-fg">
        {contactLabel}{' '}
        <a
          href={`mailto:${contactEmail}`}
          className="text-accent underline underline-offset-4 hover:decoration-2"
        >
          {contactEmail}
        </a>
      </p>
    </article>
  );
}
