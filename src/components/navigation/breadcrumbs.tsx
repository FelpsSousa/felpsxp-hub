import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { breadcrumbJsonLd, serializeJsonLd, type BreadcrumbItem } from '@/lib/seo';

type BreadcrumbsProps = {
  locale: AppLocale;
  /** Root first; the last item is the current page and is not a link. */
  items: BreadcrumbItem[];
};

/**
 * A breadcrumb trail (WAI-ARIA breadcrumb pattern) plus its BreadcrumbList
 * JSON-LD. Links get a 24px-high box to meet WCAG 2.5.8 (target size).
 */
export async function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  const t = await getTranslations('breadcrumb');
  const last = items.length - 1;

  return (
    <nav aria-label={t('label')}>
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-fg-muted">
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center gap-x-2">
            {index === last ? (
              <span aria-current="page" className="text-fg">
                {item.name}
              </span>
            ) : (
              <>
                <Link
                  href={item.path}
                  className="inline-block py-1 underline underline-offset-4 hover:text-fg"
                >
                  {item.name}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(locale, items)) }}
      />
    </nav>
  );
}
