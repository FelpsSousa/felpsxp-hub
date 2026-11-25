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
  const scriptSrc = csp.split('; ').find((directive) => directive.startsWith('script-src ')) ?? '';
  expect(scriptSrc).toContain("'strict-dynamic'");
  expect(scriptSrc).not.toContain('unsafe-inline');
  expect(headers['content-security-policy-report-only']).toBeUndefined();
});

test('the locale cookie is Secure and SameSite=Lax', async ({ request }) => {
  const response = await request.get('/pt/projects', { maxRedirects: 0 });
  const cookie = response.headers()['set-cookie'] ?? '';

  expect(response.status()).toBe(307);
  expect(cookie).toMatch(/NEXT_LOCALE=pt/);
  expect(cookie).toMatch(/Secure/i);
  expect(cookie).toMatch(/SameSite=lax/i);
});

test.describe('strict CSP, enforced (ADR-0009)', () => {
  test('each response gets its own nonce, and every script carries it', async ({ request }) => {
    const nonces = new Set<string>();
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await request.get('/en/projects');
      const policy = response.headers()['content-security-policy'] ?? '';
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

  // On Vercel the response's enforced policy is what Next.js reads the nonce
  // from, so every script, on every page including the 404, carries its nonce.
  for (const path of ['/en/projects', '/no-such-page']) {
    test(`the enforced policy on ${path} carries the same nonce as every script`, async ({ request }) => {
      const response = await request.get(path);
      const policy = response.headers()['content-security-policy'] ?? '';
      expect(policy).toContain("'strict-dynamic'");
      const nonce = policy.match(/'nonce-([^']+)'/)?.[1] ?? '';
      expect(nonce).not.toBe('');
      const scripts = (await response.text()).match(/<script(?![^>]*application\/ld\+json)[^>]*>/g) ?? [];
      expect(scripts.length).toBeGreaterThan(1);
      for (const script of scripts) expect(script).toContain(`nonce="${nonce}"`);
    });
  }

  test('files and API routes keep the baseline policy, without a nonce', async ({ request }) => {
    for (const path of ['/robots.txt', '/search-index.json']) {
      const csp = (await request.get(path)).headers()['content-security-policy'] ?? '';
      expect(csp, path).toContain("default-src 'self'");
      expect(csp, path).not.toContain('nonce-');
    }
  });

  test('a client cannot choose the nonce', async ({ request }) => {
    const response = await request.get('/en/projects', {
      headers: { 'x-nonce': 'attacker', 'content-security-policy-report-only': "script-src 'nonce-attacker'" },
    });
    expect(response.headers()['content-security-policy']).not.toContain('attacker');
    expect(await response.text()).not.toContain('nonce="attacker"');
  });

  // Next.js reads the nonce from the request's enforced CSP header before the
  // report-only one. On Vercel that header arrives without a nonce, which once
  // left every framework script unsigned in production while this suite,
  // run without it, stayed green.
  for (const [label, header] of [
    ['carries no nonce', "default-src 'self'"],
    ['names its own nonce', "script-src 'nonce-attacker'"],
  ] as const) {
    test(`every script keeps the response nonce when the request CSP ${label}`, async ({ request }) => {
      const response = await request.get('/en/projects', { headers: { 'content-security-policy': header } });
      const nonce = response.headers()['content-security-policy']?.match(/'nonce-([^']+)'/)?.[1] ?? '';
      expect(nonce).not.toBe('');
      expect(nonce).not.toBe('attacker');
      const scripts = (await response.text()).match(/<script(?![^>]*application\/ld\+json)[^>]*>/g) ?? [];
      expect(scripts.length).toBeGreaterThan(1);
      for (const script of scripts) expect(script).toContain(`nonce="${nonce}"`);
    });
  }

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
  test('the enforced policy names the report endpoint', async ({ request }) => {
    const response = await request.get('/en/projects');
    const policy = response.headers()['content-security-policy'] ?? '';
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

test.describe('canary routes (ADR-0011)', () => {
  for (const path of ['/.env', '/.git/config', '/wp-login.php', '/wp-admin', '/phpmyadmin']) {
    test(`${path} answers a plain 404 with the security headers`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(404);
      expect(response.headers()['content-type']).toContain('text/plain');
      expect(response.headers()['cache-control']).toBe('no-store');
      expect(response.headers()['x-frame-options']).toBe('DENY');
      expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
      expect(await response.text()).toBe('Not Found');
    });
  }

  test('ordinary dotted files are still served', async ({ request }) => {
    expect((await request.get('/robots.txt')).status()).toBe(200);
    expect((await request.get('/.well-known/security.txt')).status()).toBe(200);
  });
});
