import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { securityHeaders } from './src/lib/security-headers';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
      {
        source: '/:path*',
        headers: securityHeaders(process.env.NODE_ENV !== 'production'),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
