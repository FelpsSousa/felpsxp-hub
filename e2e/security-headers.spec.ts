import { expect, test } from '@playwright/test';
import { locales, pages, urlFor } from './pages';

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

test.describe('strict CSP in report-only mode (ADR-0009)', () => {
  test('each response gets its own nonce, and every script carries it', async ({ request }) => {
    const nonces = new Set<string>();
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await request.get('/en/projects');
      const policy = response.headers()['content-security-policy-report-only'] ?? '';
      const scriptSrc = policy.split('; ').find((directive) => directive.startsWith('script-src '));
      expect(scriptSrc).toMatch(/^script-src 'nonce-[^']+' 'strict-dynamic'$/);

      const nonce = policy.match(/'nonce-([^']+)'/)?.[1] ?? '';
      expect(nonce).not.toBe('');
      nonces.add(nonce);

      // JSON-LD is data, not code; every executable script must carry the nonce.
      const html = await response.text();
      const scripts = html.match(/<script(?![^>]*application\/ld\+json)[^>]*>/g) ?? [];
      expect(scripts.length).toBeGreaterThan(0);
      for (const script of scripts) expect(script).toContain(`nonce="${nonce}"`);
    }
    expect(nonces.size).toBe(2);
  });

  test('a client cannot choose the nonce', async ({ request }) => {
    const response = await request.get('/en/projects', {
      headers: { 'x-nonce': 'attacker', 'content-security-policy-report-only': "script-src 'nonce-attacker'" },
    });
    expect(response.headers()['content-security-policy-report-only']).not.toContain('attacker');
    expect(await response.text()).not.toContain('nonce="attacker"');
  });

  for (const { code, prefix } of locales) {
    for (const path of pages) {
      test(`${urlFor(prefix, path)} (${code}) runs without a single violation`, async ({ page }) => {
        await page.addInitScript(() => {
          const seen: string[] = [];
          (window as unknown as { cspViolations: string[] }).cspViolations = seen;
          document.addEventListener('securitypolicyviolation', (event) => {
            seen.push(`${event.disposition} ${event.effectiveDirective} ${event.blockedURI} ${event.sourceFile}:${event.lineNumber}`);
          });
        });
        await page.goto(urlFor(prefix, path));
        if (path === '/contact') {
          // Turnstile keeps the network busy; its token proves its scripts ran.
          await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, {
            timeout: 20_000,
          });
        } else {
          await page.waitForLoadState('networkidle');
        }
        const violations = await page.evaluate(
          () => (window as unknown as { cspViolations: string[] }).cspViolations,
        );
        expect(violations).toEqual([]);
      });
    }
  }
});

test('hreflang alternates come only from the HTML, on the production domain', async ({ request }) => {
  const response = await request.get('/en/projects');
  expect(response.headers()['link'] ?? '').not.toContain('hreflang');

  const html = await response.text();
  const alternates = html.match(/<link rel="alternate" hrefLang="[^"]+" href="[^"]+"/g) ?? [];
  expect(alternates).toHaveLength(3);
  for (const link of alternates) expect(link).toContain('href="https://felpsxp.com');
});

test.describe('CSP violation reports (ADR-0009)', () => {
  test('the report-only policy names the report endpoint', async ({ request }) => {
    const response = await request.get('/en/projects');
    const policy = response.headers()['content-security-policy-report-only'] ?? '';
    expect(policy).toContain('report-uri /api/csp-report');
    expect(policy).toContain('report-to csp-endpoint');
    expect(response.headers()['reporting-endpoints']).toMatch(
      /^csp-endpoint="http:\/\/localhost:\d+\/api\/csp-report"$/,
    );
  });

  test('the endpoint accepts both report formats, outside the locale routing', async ({
    request,
    baseURL,
  }) => {
    const legacy = await request.post('/api/csp-report', {
      headers: { 'content-type': 'application/csp-report' },
      data: JSON.stringify({
        'csp-report': {
          'document-uri': `${baseURL}/en/projects`,
          'effective-directive': 'script-src-elem',
          'blocked-uri': 'inline',
        },
      }),
    });
    expect(legacy.status()).toBe(204);

    const reportingApi = await request.post('/api/csp-report', {
      headers: { 'content-type': 'application/reports+json' },
      data: JSON.stringify([{ type: 'csp-violation', body: { documentURL: `${baseURL}/` } }]),
    });
    expect(reportingApi.status()).toBe(204);
  });

  test('the endpoint refuses anything that is not a report', async ({ request }) => {
    expect((await request.get('/api/csp-report')).status()).toBe(405);
    const json = await request.post('/api/csp-report', {
      headers: { 'content-type': 'application/json' },
      data: '{}',
    });
    expect(json.status()).toBe(415);
    const huge = await request.post('/api/csp-report', {
      headers: { 'content-type': 'application/csp-report' },
      data: 'x'.repeat(64 * 1024),
    });
    expect(huge.status()).toBe(413);
  });
});
