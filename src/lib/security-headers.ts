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
 * Baseline policy for responses that run no page scripts: files, API routes
 * and the canary 404s, none of which pass through a nonce. Pages enforce
 * `strictContentSecurityPolicy` instead (ADR-0009). 'unsafe-inline' and the
 * host allowlist are kept here only so that a file opened directly, such as
 * an SVG, behaves as before; 'unsafe-eval' is needed only in development.
 */
export function contentSecurityPolicy(isDev: boolean): string {
  return policy(
    [
      "'self'",
      "'unsafe-inline'",
      // Cloudflare Turnstile on the contact form (ADR-0007), the only third-party origin.
      TURNSTILE_ORIGIN,
    ],
    isDev,
  );
}

/**
 * Strict policy (ADR-0009), enforced on every page: only scripts carrying this
 * request's nonce run, and 'strict-dynamic' extends that trust to the scripts
 * they load, such as the Next.js chunks and Turnstile. No 'unsafe-inline' and
 * no host allowlist. Next.js reads the nonce from this header on the request
 * and adds it to its own scripts.
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

function policy(scriptSources: string[], isDev: boolean): string {
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
 * Headers for every response. The CSP is not among them: pages get the strict
 * policy from the proxy (`src/proxy.ts`), and everything the proxy skips gets
 * the baseline from `next.config.ts` (`PROXY_SKIPPED_SOURCE`).
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
