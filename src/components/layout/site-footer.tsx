import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buildInfo } from '@/lib/build-info';
import { getSiteSettings } from '@/lib/content';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const { name, repositoryUrl, socialLinks } = getSiteSettings();
  const year = new Date().getFullYear();
  const build = buildInfo();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p>
            © {year} {name} ·{' '}
            <a href={repositoryUrl} className="underline underline-offset-4 hover:text-fg">
              {t('sourceCode')}
            </a>{' '}
            ({t('license')}) ·{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">
              {t('privacy')}
            </Link> ·{' '}
            <Link href="/security" className="underline underline-offset-4 hover:text-fg">
              {t('security')}
            </Link> ·{' '}
            <Link href="/accessibility" className="underline underline-offset-4 hover:text-fg">
              {t('accessibility')}
            </Link>
          </p>
          {/* Small text, so each link gets a 24px-high box of its own to meet
              WCAG 2.5.8 (target size) wherever the line above wraps. */}
          <p className="font-mono text-xs">
            <Link
              href={`/changelog#v${build.version}`}
              title={t('versionLabel', { version: build.version })}
              className="inline-block py-1 underline underline-offset-4 hover:text-fg"
            >
              v{build.version}
            </Link>
            {build.commit && (
              <>
                {' · '}
                <a
                  href={build.commit.url}
                  title={t('commitLabel', { commit: build.commit.short })}
                  className="inline-block py-1 underline underline-offset-4 hover:text-fg"
                >
                  {build.commit.short}
                </a>
              </>
            )}
          </p>
        </div>

        <nav aria-label={t('elsewhere')}>
          <ul className="flex gap-4">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel="me noopener noreferrer"
                  target="_blank"
                  className="underline underline-offset-4 hover:text-fg"
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
