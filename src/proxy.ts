import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { buildProbeEvent, probeCategory } from '@/lib/probes';
import {
  contentSecurityPolicy,
  createNonce,
  NONCE_HEADER,
  reportingEndpoints,
  strictContentSecurityPolicy,
  withViolationReports,
} from '@/lib/security-headers';

const handleLocale = createIntlMiddleware(routing);
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Locale routing and the CSP of every page (ADR-0009): each request gets a
 * fresh nonce, passed on as request headers, so Next.js and the root layout
 * put it on their inline scripts. The enforced baseline carries the nonce and
 * the strict policy runs in report-only mode, with violations reported to
 * `/api/csp-report`. Paths the proxy skips get the baseline from
 * `next.config.ts`.
 */
export default function proxy(request: NextRequest) {
  // Canary routes (ADR-0011): a plain 404 and an anonymous event, before any
  // locale or page work is done for a scanner.
  const category = probeCategory(request.nextUrl.pathname);
  if (category) {
    const event = buildProbeEvent({
      category,
      country: request.headers.get('x-vercel-ip-country'),
      userAgent: request.headers.get('user-agent'),
      now: new Date(),
    });
    console.warn(JSON.stringify(event));
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': contentSecurityPolicy(isDev),
      },
    });
  }

  const nonce = createNonce();
  const enforced = contentSecurityPolicy(isDev, nonce);
  const strict = strictContentSecurityPolicy(nonce, isDev);

  // Always overwritten, so a client cannot choose the nonce. Next.js reads the
  // nonce for its own scripts from the request's enforced policy first, and on
  // Vercel the response's enforced policy is copied onto that request, so both
  // carry the same nonce (ADR-0009, amendment of 2026-11-25).
  request.headers.set(NONCE_HEADER, nonce);
  request.headers.set('content-security-policy', enforced);
  request.headers.set('content-security-policy-report-only', strict);

  const response = handleLocale(request);
  response.headers.set('Content-Security-Policy', enforced);
  response.headers.set('Content-Security-Policy-Report-Only', withViolationReports(strict));
  response.headers.set('Reporting-Endpoints', reportingEndpoints(request.nextUrl.origin));
  return response;
}

export const config = {
  // Skips Next.js assets, files with an extension and API routes, which are
  // neither localised nor HTML. The entries after the first are the dotted
  // canary routes of `DOTTED_PROBE_MATCHERS` in `src/lib/probes.ts`; Next.js
  // reads this config statically, so they are written out here and a test
  // keeps the two lists in step.
  matcher: [
    '/((?!api/|_next|.*\\..*).*)',
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
  ],
};
