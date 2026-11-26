import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { MobileNav } from '@/components/layout/mobile-nav';
import { NavLink } from '@/components/layout/nav-link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { SiteSearch } from '@/components/search/site-search';
import { Link } from '@/i18n/navigation';
import { getSiteSettings } from '@/lib/content';
import { primaryNavigation } from '@/lib/navigation';

export async function SiteHeader() {
  const t = await getTranslations();
  const { name } = getSiteSettings();

  return (
    <header className="relative border-b border-border print:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label={`${name}, ${t('site.homeLink')}`}
            className="font-semibold text-fg hover:text-accent"
          >
            {name}
          </Link>
          {/* The FelpsXP mark (option B on /design, ADR-0012). Decorative and
              outside the link, so the link's name still matches its text
              (WCAG 2.5.3). */}
          <span
            aria-hidden="true"
            className="rounded-sm bg-accent-muted px-1.5 py-1 font-pixel text-[0.5rem] leading-none text-accent"
          >
            XP
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label={t('nav.label')} className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {primaryNavigation.map((item) => (
                <li key={item.key}>
                  <NavLink
                    href={item.href}
                    className="rounded-sm decoration-accent decoration-2 underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent aria-[current=page]:underline"
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <SiteSearch />
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
