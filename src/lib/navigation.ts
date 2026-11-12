/**
 * Primary navigation. Only pages that already exist are listed: each new
 * page adds its entry in the same pull request that ships it, so the menu
 * never links to a 404. Labels live in `messages/*.json` under `nav`.
 */
export const primaryNavigation = [
  { key: 'projects', href: '/projects' },
  { key: 'contact', href: '/contact' },
] as const;

export type PrimaryNavigationKey = (typeof primaryNavigation)[number]['key'];

/**
 * Whether `href` is the current page or one of its children, given a
 * locale-free pathname such as next-intl's `usePathname()` returns.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
