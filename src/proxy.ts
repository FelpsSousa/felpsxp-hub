import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { buildProbeEvent, probeCategory } from '@/lib/probes';
import {
  createNonce,
  NONCE_HEADER,
  reportingEndpoints,
  strictContentSecurityPolicy,
  withViolationReports,
} from '@/lib/security-headers';

const handleLocale = createIntlMiddleware(routing);

/**
 * Locale routing, plus the strict CSP of ADR-0009 in report-only mode: each
 * request gets a fresh nonce, passed on as request headers (next-intl copies
 * them onto the response it builds), so Next.js and the root layout put it on
 * their inline scripts. Violations are reported to `/api/csp-report`. The
 * enforced policy still comes from `next.config.ts`.
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
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const nonce = createNonce();
  const policy = strictContentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production');

  // Always overwritten, so a client cannot choose the nonce.
  request.headers.set(NONCE_HEADER, nonce);
  request.headers.set('content-security-policy-report-only', policy);

  const response = handleLocale(request);
  response.headers.set('Content-Security-Policy-Report-Only', withViolationReports(policy));
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
