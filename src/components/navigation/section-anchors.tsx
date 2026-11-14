import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import type { TocItem } from '@/lib/anchors';

/**
 * A section heading with an id and a `#` link to itself, shown on hover and on
 * keyboard focus. The link's box is 24px square to meet WCAG 2.5.8.
 */
export async function AnchorHeading({
  id,
  className,
  children,
}: {
  id: string;
  className: string;
  children: ReactNode;
}) {
  const t = await getTranslations('toc');
  const label = typeof children === 'string' ? children : id;

  return (
    <h2 id={id} className={`group flex scroll-mt-8 items-center gap-1 ${className}`}>
      {children}
      <a
        href={`#${id}`}
        aria-label={t('anchor', { section: label })}
        className="inline-flex size-6 items-center justify-center rounded text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent focus-visible:opacity-100"
      >
        <span aria-hidden="true">#</span>
      </a>
    </h2>
  );
}

/** "On this page": links to the page's sections. Not rendered for short pages. */
export async function TableOfContents({ items, min = 3 }: { items: TocItem[]; min?: number }) {
  if (items.length < min) {
    return null;
  }
  const t = await getTranslations('toc');

  return (
    <nav aria-label={t('label')} className="flex flex-col gap-2 border-l-2 border-border pl-4">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{t('label')}</p>
      <ol className="flex flex-wrap gap-x-4 text-sm text-fg-muted">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-block py-1 underline underline-offset-4 hover:text-fg"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
