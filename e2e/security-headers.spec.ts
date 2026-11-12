import { expect, test } from '@playwright/test';

/**
 * The unit tests check the header definitions; these check that a real
 * production response actually carries them.
 */
test('production responses carry the security headers', async ({ request }) => {
  const response = await request.get('/projects');
  const headers = response.headers();

  expect(headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-powered-by']).toBeUndefined();

  const csp = headers['content-security-policy'];
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toContain('unsafe-eval');
});

test('the locale cookie is Secure and SameSite=Lax', async ({ request }) => {
  const response = await request.get('/pt/projects', { maxRedirects: 0 });
  const cookie = response.headers()['set-cookie'] ?? '';

  expect(response.status()).toBe(307);
  expect(cookie).toMatch(/NEXT_LOCALE=pt/);
  expect(cookie).toMatch(/Secure/i);
  expect(cookie).toMatch(/SameSite=lax/i);
});
