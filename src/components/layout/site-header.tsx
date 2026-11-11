import { getTranslations } from 'next-intl/server';
import { MobileNav } from '@/components/layout/mobile-nav';
import { NavLink } from '@/components/layout/nav-link';
import { Link } from '@/i18n/navigation';
import { getSiteSettings } from '@/lib/content';
import { primaryNavigation } from '@/lib/navigation';

export async function SiteHeader() {
  const t = await getTranslations();
  const { name } = getSiteSettings();

  return (
    <header className="relative border-b border-border">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={`${name}, ${t('site.homeLink')}`}
          className="font-semibold text-fg hover:text-accent"
        >
          {name}
        </Link>

        <nav aria-label={t('nav.label')} className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm">
            {primaryNavigation.map((item) => (
              <li key={item.key}>
                <NavLink href={item.href}>{t(`nav.${item.key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
