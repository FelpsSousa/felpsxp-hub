import { classifyClient, minuteOf, normaliseCountry, type ClientClass } from '@/lib/contact/events';

/**
 * Canary routes (ADR-0011): paths that only scanners ask for. A request to
 * one gets a plain 404, as before, and leaves an anonymous `hub.probe.v1`
 * event behind. The event names the category of the target, never the path
 * itself, so nothing an attacker types reaches the logs.
 */

export type ProbeCategory = 'secrets' | 'vcs' | 'wordpress' | 'db-admin' | 'server' | 'php';

export type ProbeEvent = {
  schema: 'hub.probe.v1';
  category: ProbeCategory;
  country: string | null;
  clientClass: ClientClass;
  occurredAt: string;
};

/** First matching rule wins; each pattern sees the lowercased path. */
const RULES: readonly [ProbeCategory, RegExp][] = [
  ['secrets', /^\/(\.env(\.[a-z]+)?|\.aws(\/.*)?|wp-config\.php|config\.php)$/],
  ['vcs', /^\/(\.git|\.svn|\.hg)(\/.*)?$/],
  ['wordpress', /^\/(wp-admin|wp-content|wp-includes)(\/.*)?$|^\/(wp-login|xmlrpc)\.php$/],
  ['db-admin', /^\/(phpmyadmin|pma)(\/.*)?$|^\/adminer\.php$/],
  ['server', /^\/(server-status|\.htaccess|\.ds_store)$/],
  ['php', /^\/(phpinfo|info)\.php$/],
];

/**
 * Matcher entries for `src/proxy.ts`. The proxy's main matcher skips paths
 * with a dot, so the dotted targets are listed one by one; a test keeps this
 * list and the proxy config in step. Paths without a dot already reach the
 * proxy through the main matcher.
 */
export const DOTTED_PROBE_MATCHERS = [
  '/.env',
  '/.env.local',
  '/.env.production',
  '/.env.development',
  '/.aws/:path*',
  '/.git/:path*',
  '/.svn/:path*',
  '/.hg/:path*',
  '/.htaccess',
  '/.DS_Store',
  '/wp-config.php',
  '/config.php',
  '/wp-login.php',
  '/xmlrpc.php',
  '/wp-content/:path*',
  '/wp-includes/:path*',
  '/adminer.php',
  '/phpinfo.php',
  '/info.php',
] as const;

/** The probe category of a path, or null for an ordinary request. */
export function probeCategory(pathname: string): ProbeCategory | null {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  for (const [category, pattern] of RULES) {
    if (pattern.test(path)) return category;
  }
  return null;
}

export function buildProbeEvent({
  category,
  country,
  userAgent,
  now,
}: {
  category: ProbeCategory;
  country: string | null;
  userAgent: string | null;
  now: Date;
}): ProbeEvent {
  return {
    schema: 'hub.probe.v1',
    category,
    country: normaliseCountry(country),
    clientClass: classifyClient(userAgent),
    occurredAt: minuteOf(now),
  };
}
