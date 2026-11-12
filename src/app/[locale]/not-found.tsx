import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/**
 * Localized 404, rendered inside the site shell.
 *
 * Known limitation: because the root layout lives under the dynamic
 * `[locale]` segment, Next.js 16 sends a bare error document and renders
 * this page on the client from the Flight payload. The response is still a
 * real 404 with `noindex`, so crawlers see the right status. The documented
 * alternative, `global-not-found.js`, is experimental and bypasses the
 * layout (no header, footer or locale), so it is not used for now.
 */
export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-20">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
      <p className="text-fg-muted">{t('description')}</p>
      <Link href="/" className="w-fit text-accent underline underline-offset-4 hover:decoration-2">
        {t('backHome')}
      </Link>
    </div>
  );
}
