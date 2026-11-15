import { describe, expect, it } from 'vitest';
import {
  contentSecurityPolicy,
  createNonce,
  securityHeaders,
  reportingEndpoints,
  strictContentSecurityPolicy,
  withViolationReports,
} from '@/lib/security-headers';

function headerMap(isDev: boolean): Map<string, string> {
  return new Map(securityHeaders(isDev).map(({ key, value }) => [key, value]));
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
    const keys = securityHeaders(false).map(({ key }) => key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.sort()).toEqual(
      [
        'Content-Security-Policy',
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
    const headers = headerMap(false);
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
  });

  it('enforces HTTPS for two years, subdomains included', () => {
    const hsts = headerMap(false).get('Strict-Transport-Security') ?? '';
    expect(hsts).toContain('max-age=63072000');
    expect(hsts).toContain('includeSubDomains');
  });

  it('switches off sensitive browser features', () => {
    const policy = headerMap(false).get('Permissions-Policy') ?? '';
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
