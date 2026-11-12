/**
 * HTTP security headers applied to every response (see `next.config.ts`).
 * Kept as plain data in its own module so tests can assert on them: a
 * header that silently disappears is a regression nobody would notice.
 */

export type Header = { key: string; value: string };

/**
 * Baseline, not hardened: 'unsafe-inline' on script/style is required
 * because Next.js's own RSC hydration payload ships as an inline <script>,
 * and 'unsafe-eval' is needed only in development for Fast Refresh's
 * eval()-wrapped chunks. Production builds don't use eval-wrapped chunks.
 * Tightening this (theme script by hash, report-only first) is tracked in
 * the roadmap.
 */
export function contentSecurityPolicy(isDev: boolean): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", isDev ? "'unsafe-eval'" : null]
    .filter(Boolean)
    .join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}

/**
 * Browser features this site never uses, switched off for the page and for
 * anything embedded in it. Only widely recognised feature names are listed,
 * so browsers do not log warnings about unknown ones.
 */
export const permissionsPolicy = [
  'accelerometer=()',
  'browsing-topics=()',
  'camera=()',
  'display-capture=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  'usb=()',
].join(', ');

/**
 * Two years, covering subdomains, since every FelpsXP module is served over
 * HTTPS at `<module>.felpsxp.com`. `preload` is deliberately left out:
 * joining the browsers' preload list is hard to undo and is a separate
 * decision for the go-live.
 */
export const strictTransportSecurity = 'max-age=63072000; includeSubDomains';

export function securityHeaders(isDev: boolean): Header[] {
  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy(isDev) },
    { key: 'Strict-Transport-Security', value: strictTransportSecurity },
    { key: 'Permissions-Policy', value: permissionsPolicy },
    // Isolates this window from cross-origin pages it opens or is opened by.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ];
}
