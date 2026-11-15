import { describe, expect, it, vi } from 'vitest';
import { parseCspReports } from '@/lib/csp-report';
import { handleCspReport } from '@/lib/csp-report-handler';

const site = 'https://felpsxp.com';
const now = new Date('2026-11-15T10:42:37Z');
const chrome = 'Mozilla/5.0 (Windows NT 10.0) Chrome/157.0';

const legacy = {
  'csp-report': {
    'document-uri': `${site}/en/contact?email=someone%40example.com#form`,
    'violated-directive': 'script-src-elem',
    'effective-directive': 'script-src-elem',
    'blocked-uri': 'https://evil.example/x.js?token=abc',
    'source-file': `${site}/_next/static/chunks/app.js?v=1`,
    'line-number': 12,
    disposition: 'report',
    'script-sample': 'alert(document.cookie)',
  },
};

const reportingApi = [
  {
    type: 'csp-violation',
    url: `${site}/projects`,
    body: {
      documentURL: `${site}/projects`,
      effectiveDirective: 'script-src-elem',
      blockedURL: 'inline',
      disposition: 'enforce',
      lineNumber: 3,
      sample: 'console.log(1)',
    },
  },
  { type: 'deprecation', body: { id: 'x' } },
];

function parse(contentType: string, body: unknown) {
  return parseCspReports({ contentType, body, siteHosts: ['felpsxp.com'], userAgent: chrome, now });
}

describe('parseCspReports', () => {
  it('reads the legacy report-uri format and keeps only what helps fix a policy', () => {
    expect(parse('application/csp-report', legacy)).toEqual([
      {
        schema: 'hub.csp.v1',
        disposition: 'report',
        directive: 'script-src-elem',
        blocked: 'https://evil.example',
        page: '/en/contact',
        source: `${site}/_next/static/chunks/app.js`,
        line: 12,
        clientClass: 'browser',
        occurredAt: '2026-11-15T10:42:00.000Z',
      },
    ]);
  });

  it('reads the Reporting API format and ignores other report types', () => {
    const events = parse('application/reports+json', reportingApi);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ disposition: 'enforce', blocked: 'inline', page: '/projects' });
  });

  it('never keeps query strings, fragments or script samples', () => {
    const serialised = JSON.stringify([
      ...parse('application/csp-report', legacy),
      ...parse('application/reports+json', reportingApi),
    ]);
    for (const secret of ['example.com', 'token', '#form', 'cookie', 'console.log', '?v=1']) {
      expect(serialised).not.toContain(secret);
    }
  });

  it('drops reports about pages on another origin and malformed entries', () => {
    const foreign = { 'csp-report': { ...legacy['csp-report'], 'document-uri': 'https://other.example/' } };
    expect(parse('application/csp-report', foreign)).toEqual([]);
    expect(parse('application/csp-report', { nope: 1 })).toEqual([]);
    expect(parse('application/reports+json', { not: 'a list' })).toEqual([]);
    const badDirective = { 'csp-report': { ...legacy['csp-report'], 'effective-directive': '<script>' } };
    expect(parse('application/csp-report', badDirective)).toEqual([]);
  });

  it('keeps at most ten reports from one batch', () => {
    const batch = Array.from({ length: 50 }, () => reportingApi[0]);
    expect(parse('application/reports+json', batch)).toHaveLength(10);
  });
});

describe('handleCspReport', () => {
  function post(body: string, contentType = 'application/csp-report', headers: Record<string, string> = {}) {
    return new Request(`${site}/api/csp-report`, {
      method: 'POST',
      headers: { 'content-type': contentType, 'user-agent': chrome, ...headers },
      body,
    });
  }

  it('emits one event per kept violation and answers 204', async () => {
    const emit = vi.fn();
    const response = await handleCspReport(post(JSON.stringify(legacy)), { emit, now: () => now, siteUrl: site });
    expect(response.status).toBe(204);
    expect(emit).toHaveBeenCalledTimes(1);
  });

  it('answers 204 without emitting when nothing is worth keeping', async () => {
    const emit = vi.fn();
    const response = await handleCspReport(post('{"csp-report":{}}'), { emit, now: () => now, siteUrl: site });
    expect(response.status).toBe(204);
    expect(emit).not.toHaveBeenCalled();
  });

  it('refuses other content types, invalid JSON and oversized bodies', async () => {
    const deps = { emit: vi.fn(), now: () => now, siteUrl: site };
    expect((await handleCspReport(post('{}', 'application/json'), deps)).status).toBe(415);
    expect((await handleCspReport(post('{not json'), deps)).status).toBe(400);
    expect((await handleCspReport(post('x'.repeat(17 * 1024)), deps)).status).toBe(413);
    expect(deps.emit).not.toHaveBeenCalled();
  });

  it('accepts reports from the Host header or the canonical domain behind a proxy', async () => {
    const emit = vi.fn();
    const proxied = new Request('http://localhost:3100/api/csp-report', {
      method: 'POST',
      headers: { 'content-type': 'application/csp-report', host: 'localhost:3300' },
      body: JSON.stringify({
        'csp-report': { 'document-uri': 'http://localhost:3300/en', 'effective-directive': 'script-src-attr', 'blocked-uri': 'inline' },
      }),
    });
    await handleCspReport(proxied, { emit, now: () => now, siteUrl: site });
    await handleCspReport(
      new Request('http://localhost:3100/api/csp-report', {
        method: 'POST',
        headers: { 'content-type': 'application/csp-report' },
        body: JSON.stringify(legacy),
      }),
      { emit, now: () => now, siteUrl: site },
    );
    expect(emit).toHaveBeenCalledTimes(2);
  });
});
