/**
 * HTTP security headers applied to every response (see `next.config.ts`).
 * Kept as plain data in its own module so tests can assert on them: a
 * header that silently disappears is a regression nobody would notice.
 */

export type Header = { key: string; value: string };

export const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com';

/** Where browsers send CSP violation reports (`src/app/api/csp-report`). */
export const CSP_REPORT_PATH = '/api/csp-report';

/** Reporting API endpoint name, declared in the `Reporting-Endpoints` header. */
export const CSP_REPORT_GROUP = 'csp-endpoint';

/** The request header that carries the per-request nonce to the root layout. */
export const NONCE_HEADER = 'x-nonce';

/**
 * Baseline policy, enforced on every response. 'unsafe-inline' in script-src
 * stays for browsers without nonce support: Next.js ships each page's RSC
 * hydration payload as an inline <script> that differs per page, so it cannot
 * be hashed. 'unsafe-eval' is needed only in development, for Fast Refresh's
 * eval()-wrapped chunks.
 *
 * Pages pass their request's nonce (ADR-0009, amendment of 2026-11-25). Every
 * browser with nonce support then ignores 'unsafe-inline' and runs only the
 * inline scripts that carry it. It also has to be here for Next.js to sign its
 * own scripts at all: Next.js reads the nonce from the request's enforced
 * policy first, and on Vercel the response's enforced policy is copied onto
 * that request, so a policy without the nonce left every framework script
 * unsigned in production.
 */
export function contentSecurityPolicy(isDev: boolean, nonce?: string): string {
  return policy(
    [
      "'self'",
      nonce ? `'nonce-${nonce}'` : null,
      "'unsafe-inline'",
      // Cloudflare Turnstile on the contact form (ADR-0007), the only third-party origin.
      TURNSTILE_ORIGIN,
    ],
    isDev,
  );
}

/**
 * Strict policy (ADR-0009): only scripts carrying this request's nonce run,
 * and 'strict-dynamic' extends that trust to the scripts they load, such as
 * the Next.js chunks and Turnstile. No 'unsafe-inline' and no host allowlist.
 * Next.js reads the nonce from this header on the request and adds it to its
 * own inline scripts.
 */
export function strictContentSecurityPolicy(nonce: string, isDev: boolean): string {
  return policy([`'nonce-${nonce}'`, "'strict-dynamic'"], isDev);
}

/**
 * Where browsers send violation reports: `report-to` names the Reporting API
 * endpoint declared in the `Reporting-Endpoints` header; `report-uri` serves
 * browsers without the Reporting API (Chrome ignores it when `report-to` is set).
 */
export function withViolationReports(policy: string): string {
  return `${policy}; report-uri ${CSP_REPORT_PATH}; report-to ${CSP_REPORT_GROUP}`;
}

/** The `Reporting-Endpoints` header value; the URL must be absolute. */
export function reportingEndpoints(origin: string): string {
  return `${CSP_REPORT_GROUP}="${origin}${CSP_REPORT_PATH}"`;
}

/** A fresh, unguessable nonce: 128 random bits, base64-encoded. */
export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

function policy(scriptSources: (string | null)[], isDev: boolean): string {
  const scriptSrc = [...scriptSources, isDev ? "'unsafe-eval'" : null].filter(Boolean).join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    `frame-src ${TURNSTILE_ORIGIN}`,
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

/**
 * Headers for every response. The enforced CSP is not among them: pages get
 * theirs, with the nonce, from the proxy (`src/proxy.ts`), and everything the
 * proxy skips gets the baseline from `next.config.ts` (`PROXY_SKIPPED_SOURCE`).
 */
export function securityHeaders(): Header[] {
  return [
    { key: 'Strict-Transport-Security', value: strictTransportSecurity },
    { key: 'Permissions-Policy', value: permissionsPolicy },
    // Isolates this window from cross-origin pages it opens or is opened by.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ];
}

/**
 * The paths the proxy's main matcher skips: API routes, Next.js assets and
 * files with an extension. They get the baseline CSP from `next.config.ts`;
 * every other path gets its policy from the proxy. A second enforced policy
 * from the config on a page would reach Next.js on Vercel in place of the one
 * with the nonce.
 */
export const PROXY_SKIPPED_SOURCE = '/:path((?:api|_next)/.*|.*\\..*)';
