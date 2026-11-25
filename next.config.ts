import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { contentSecurityPolicy, PROXY_SKIPPED_SOURCE, securityHeaders } from './src/lib/security-headers';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // The contact form is the only Server Action; a real message is a few KB (ADR-0007).
      bodySizeLimit: '64kb',
    },
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders() },
      // Pages get their enforced CSP, with the nonce, from `src/proxy.ts`.
      {
        source: PROXY_SKIPPED_SOURCE,
        headers: [{ key: 'Content-Security-Policy', value: contentSecurityPolicy(isDev) }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
