'use client';

import { ThreeBarsIcon, XIcon } from '@primer/octicons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { NavLink } from '@/components/layout/nav-link';
import { usePathname } from '@/i18n/navigation';
import { primaryNavigation } from '@/lib/navigation';

/**
 * Disclosure menu for small screens. The menu remembers the pathname it was
 * opened on and only counts as open while that is still the current page,
 * so navigating anywhere closes it without an effect that sets state.
 */
export function MobileNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t('closeMenu') : t('openMenu')}
        onClick={() => setOpenedOn(open ? null : pathname)}
        className="-mr-2 rounded-md p-2 text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
      >
        {open ? <XIcon aria-hidden size={20} /> : <ThreeBarsIcon aria-hidden size={20} />}
      </button>

      <nav
        id={panelId}
        aria-label={t('label')}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-canvas"
      >
        <ul className="mx-auto flex max-w-3xl flex-col px-6 py-2">
          {primaryNavigation.map((item) => (
            <li key={item.key}>
              <NavLink href={item.href} className="-ml-3 block border-l-2 border-transparent py-3 pl-3 text-base aria-[current=page]:border-accent aria-[current=page]:font-medium">
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
