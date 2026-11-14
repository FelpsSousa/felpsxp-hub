import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import {
  createNonce,
  NONCE_HEADER,
  strictContentSecurityPolicy,
} from '@/lib/security-headers';

const handleLocale = createIntlMiddleware(routing);

/**
 * Locale routing, plus the strict CSP of ADR-0009 in report-only mode: each
 * request gets a fresh nonce, passed on as request headers (next-intl copies
 * them onto the response it builds), so Next.js and the root layout put it on
 * their inline scripts. The enforced policy still comes from `next.config.ts`.
 */
export default function proxy(request: NextRequest) {
  const nonce = createNonce();
  const policy = strictContentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production');

  // Always overwritten, so a client cannot choose the nonce.
  request.headers.set(NONCE_HEADER, nonce);
  request.headers.set('content-security-policy-report-only', policy);

  const response = handleLocale(request);
  response.headers.set('Content-Security-Policy-Report-Only', policy);
  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
