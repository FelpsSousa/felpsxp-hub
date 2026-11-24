import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildProbeEvent, DOTTED_PROBE_MATCHERS, probeCategory } from '@/lib/probes';

// The proxy imports next-intl's middleware, which only resolves inside
// Next.js, so its static matcher is read as text instead of imported.
const proxySource = readFileSync('src/proxy.ts', 'utf8');
const matcherBlock = proxySource.slice(proxySource.indexOf('matcher: ['));
const matcher = [...matcherBlock.slice(0, matcherBlock.indexOf(']')).matchAll(/'([^']+)'/g)].map((m) => m[1]);

describe('probe categories', () => {
  it.each([
    ['/.env', 'secrets'],
    ['/.env.production', 'secrets'],
    ['/.aws/credentials', 'secrets'],
    ['/wp-config.php', 'secrets'],
    ['/.git/config', 'vcs'],
    ['/.git/HEAD', 'vcs'],
    ['/.svn/entries', 'vcs'],
    ['/wp-admin', 'wordpress'],
    ['/wp-admin/', 'wordpress'],
    ['/wp-login.php', 'wordpress'],
    ['/WP-LOGIN.PHP', 'wordpress'],
    ['/wp-content/plugins/x/readme.txt', 'wordpress'],
    ['/xmlrpc.php', 'wordpress'],
    ['/phpmyadmin', 'db-admin'],
    ['/pma/index.php', 'db-admin'],
    ['/adminer.php', 'db-admin'],
    ['/server-status', 'server'],
    ['/.DS_Store', 'server'],
    ['/phpinfo.php', 'php'],
  ])('%s is %s', (path, category) => {
    expect(probeCategory(path)).toBe(category);
  });

  it.each(['/', '/en', '/projects', '/contact', '/en/contact', '/cv', '/environment', '/wp', '/git', '/robots.txt', '/.well-known/security.txt'])(
    '%s is an ordinary request',
    (path) => {
      expect(probeCategory(path)).toBeNull();
    },
  );

  it('routes every dotted target through the proxy', () => {
    expect(matcher.slice(1)).toEqual([...DOTTED_PROBE_MATCHERS]);
    // And every listed entry is a probe, so the proxy never handles an
    // ordinary dotted path such as /robots.txt.
    for (const entry of DOTTED_PROBE_MATCHERS) {
      expect(probeCategory(entry.replace('/:path*', '/x')), entry).not.toBeNull();
    }
  });
});

describe('probe event', () => {
  it('carries only the category, country, client class and minute', () => {
    const event = buildProbeEvent({
      category: 'secrets',
      country: 'BR',
      userAgent: 'curl/8.0',
      now: new Date('2026-11-24T10:42:31.123Z'),
    });
    expect(event).toEqual({
      schema: 'hub.probe.v1',
      category: 'secrets',
      country: 'BR',
      clientClass: 'tool',
      occurredAt: '2026-11-24T10:42:00.000Z',
    });
  });

  it('drops a country header that is not two uppercase letters', () => {
    const event = buildProbeEvent({ category: 'vcs', country: 'xx; drop', userAgent: null, now: new Date() });
    expect(event.country).toBeNull();
    expect(event.clientClass).toBe('unknown');
  });
});
