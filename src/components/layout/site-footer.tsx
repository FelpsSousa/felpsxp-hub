import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSiteSettings } from '@/lib/content';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const { name, repositoryUrl, socialLinks } = getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {name} ·{' '}
          <a href={repositoryUrl} className="underline-offset-4 hover:text-fg hover:underline">
            {t('sourceCode')}
          </a>{' '}
          ({t('license')}) ·{' '}
          <Link href="/privacy" className="underline-offset-4 hover:text-fg hover:underline">
            {t('privacy')}
          </Link>
        </p>

        <nav aria-label={t('elsewhere')}>
          <ul className="flex gap-4">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel="me noopener noreferrer"
                  target="_blank"
                  className="underline-offset-4 hover:text-fg hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
