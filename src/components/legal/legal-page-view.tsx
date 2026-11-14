import { getFormatter, getTranslations } from 'next-intl/server';
import { AnchorHeading, TableOfContents } from '@/components/navigation/section-anchors';
import type { LegalPage } from '@/content/types';
import { headingIds } from '@/lib/anchors';

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
  const ids = headingIds(page.sections.map((section) => section.heading));

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{page.title}</h1>
        <p className="text-fg">{page.summary}</p>
        <p className="text-sm text-fg-muted">
          <time dateTime={page.updatedAt}>{t('updated', { date: updated })}</time>
        </p>
      </header>

      <TableOfContents
        items={page.sections.map((section, index) => ({ id: ids[index], label: section.heading }))}
      />

      {page.sections.map((section, index) => (
        <section key={ids[index]} aria-labelledby={ids[index]} className="flex flex-col gap-3">
          <AnchorHeading id={ids[index]} className="text-xl font-semibold text-fg">
            {section.heading}
          </AnchorHeading>
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
