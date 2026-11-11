'use client';

import type { ComponentProps } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { isActivePath } from '@/lib/navigation';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/** A locale-aware link that marks itself as the current page. */
export function NavLink({ href, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`${className ?? ''} ${active ? 'text-fg' : 'text-fg-muted hover:text-fg'}`}
      {...props}
    />
  );
}
