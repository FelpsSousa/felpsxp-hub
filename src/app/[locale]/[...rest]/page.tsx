import { notFound } from 'next/navigation';

/**
 * Catches every path inside a locale that no other route matches, so an
 * unknown URL renders the localized `not-found.tsx` inside the site shell
 * instead of Next.js's generic, unstyled 404.
 */
export default function CatchAllPage() {
  notFound();
}
