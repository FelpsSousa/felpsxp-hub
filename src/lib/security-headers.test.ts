import { describe, expect, it } from 'vitest';
import {
  contentSecurityPolicy,
  createNonce,
  PROXY_SKIPPED_SOURCE,
  securityHeaders,
  reportingEndpoints,
  strictContentSecurityPolicy,
  withViolationReports,
} from '@/lib/security-headers';

function headerMap(): Map<string, string> {
  return new Map(securityHeaders().map(({ key, value }) => [key, value]));
}

function directives(policy: string): Map<string, string> {
  return new Map(
    policy.split('; ').map((directive) => {
      const [name, ...values] = directive.split(' ');
      return [name, values.join(' ')];
    }),
  );
}

describe('securityHeaders', () => {
  it('sends every expected header exactly once', () => {
    const keys = securityHeaders().map(({ key }) => key);
    expect(new Set(keys).size).toBe(keys.length);
    // The enforced CSP comes from the proxy (pages) or from the config entry
    // for the paths the proxy skips, never from this shared list.
    expect(keys.sort()).toEqual(
      [
        'Cross-Origin-Opener-Policy',
        'Permissions-Policy',
        'Referrer-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
      ].sort(),
    );
  });

  it('forbids framing and MIME sniffing', () => {
    const headers = headerMap();
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
  });

  it('enforces HTTPS for two years, subdomains included', () => {
    const hsts = headerMap().get('Strict-Transport-Security') ?? '';
    expect(hsts).toContain('max-age=63072000');
    expect(hsts).toContain('includeSubDomains');
  });

  it('switches off sensitive browser features', () => {
    const policy = headerMap().get('Permissions-Policy') ?? '';
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment', 'usb']) {
      expect(policy).toContain(`${feature}=()`);
    }
  });
});

describe('contentSecurityPolicy', () => {
  it('never allows eval in production', () => {
    expect(directives(contentSecurityPolicy(false)).get('script-src')).not.toContain(
      'unsafe-eval',
    );
  });

  it('allows eval only in development, for Fast Refresh', () => {
    expect(directives(contentSecurityPolicy(true)).get('script-src')).toContain('unsafe-eval');
  });

  it('allows Cloudflare Turnstile as the only third-party origin', () => {
    const policy = directives(contentSecurityPolicy(false));
    expect(policy.get('script-src')).toContain('https://challenges.cloudflare.com');
    expect(policy.get('frame-src')).toBe('https://challenges.cloudflare.com');
    const origins = contentSecurityPolicy(false).match(/https:\/\/[^\s;]+/g) ?? [];
    expect(new Set(origins)).toEqual(new Set(['https://challenges.cloudflare.com']));
  });

  it('carries the request nonce on pages, next to the fallback for old browsers', () => {
    const scriptSrc = directives(contentSecurityPolicy(false, 'abc123')).get('script-src') ?? '';
    expect(scriptSrc).toContain("'nonce-abc123'");
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(contentSecurityPolicy(false)).not.toContain('nonce-');
  });

  it('keeps the restrictive directives', () => {
    const policy = directives(contentSecurityPolicy(false));
    expect(policy.get('default-src')).toBe("'self'");
    expect(policy.get('frame-ancestors')).toBe("'none'");
    expect(policy.get('object-src')).toBe("'none'");
    expect(policy.get('base-uri')).toBe("'self'");
    expect(policy.get('form-action')).toBe("'self'");
  });
});

describe('strictContentSecurityPolicy', () => {
  it('allows scripts only by nonce, with strict-dynamic and no unsafe-inline', () => {
    const scriptSrc = directives(strictContentSecurityPolicy('abc123', false)).get('script-src');
    expect(scriptSrc).toBe("'nonce-abc123' 'strict-dynamic'");
  });

  it('keeps every other directive of the baseline policy', () => {
    const strict = directives(strictContentSecurityPolicy('abc123', false));
    const baseline = directives(contentSecurityPolicy(false));
    strict.delete('script-src');
    baseline.delete('script-src');
    expect(strict).toEqual(baseline);
  });

  it('allows eval only in development', () => {
    expect(directives(strictContentSecurityPolicy('n', true)).get('script-src')).toContain(
      'unsafe-eval',
    );
  });
});

describe('createNonce', () => {
  it('returns 128 random bits in base64, different every time', () => {
    const nonces = new Set(Array.from({ length: 50 }, () => createNonce()));
    expect(nonces.size).toBe(50);
    for (const nonce of nonces) expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });
});

describe('violation reports', () => {
  it('adds report-uri and report-to to a policy', () => {
    const policy = directives(withViolationReports(strictContentSecurityPolicy('n', false)));
    expect(policy.get('report-uri')).toBe('/api/csp-report');
    expect(policy.get('report-to')).toBe('csp-endpoint');
  });

  it('declares the Reporting API endpoint with an absolute URL', () => {
    expect(reportingEndpoints('https://felpsxp.com')).toBe(
      'csp-endpoint="https://felpsxp.com/api/csp-report"',
    );
  });
});

describe('PROXY_SKIPPED_SOURCE', () => {
  // Next.js turns the source into an anchored pattern; this is its parameter.
  const pattern = new RegExp(`^/${PROXY_SKIPPED_SOURCE.match(/^\/:path\((.*)\)$/)?.[1]}$`);

  it.each(['/api/csp-report', '/_next/static/chunks/a.js', '/robots.txt', '/cv/felipe-sousa-en.pdf', '/.env'])(
    '%s gets the baseline CSP from the config',
    (path) => expect(pattern.test(path)).toBe(true),
  );

  it.each(['/', '/en', '/projects', '/en/projects/felpsxp-hub', '/wp-admin'])(
    '%s gets its CSP from the proxy only',
    (path) => expect(pattern.test(path)).toBe(false),
  );
});
