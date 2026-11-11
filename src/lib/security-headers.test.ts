import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, securityHeaders } from '@/lib/security-headers';

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

  it('keeps the restrictive directives', () => {
    const policy = directives(contentSecurityPolicy(false));
    expect(policy.get('default-src')).toBe("'self'");
    expect(policy.get('frame-ancestors')).toBe("'none'");
    expect(policy.get('object-src')).toBe("'none'");
    expect(policy.get('base-uri')).toBe("'self'");
    expect(policy.get('form-action')).toBe("'self'");
  });
});
