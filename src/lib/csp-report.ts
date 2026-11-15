import { classifyClient, minuteOf, type ClientClass } from '@/lib/contact/events';

/**
 * CSP violation reports (ADR-0009), turned into anonymous events with schema
 * `hub.csp.v1`. Browsers send two formats: the legacy `report-uri` one
 * (`application/csp-report`) and the Reporting API one
 * (`application/reports+json`). Anyone can post to the endpoint, so input is
 * parsed defensively and reduced to what helps fix a policy: no query
 * strings, no fragments, no script samples, no IP address, no raw User-Agent.
 */

/** Bodies above this size are refused; a real report is well under 2 KB. */
export const MAX_REPORT_BYTES = 16 * 1024;

/** Reports kept from one batch; the rest are dropped. */
const MAX_REPORTS_PER_BATCH = 10;

const MAX_FIELD_LENGTH = 200;

export const CSP_REPORT_CONTENT_TYPES = ['application/csp-report', 'application/reports+json'];

export type CspViolationEvent = {
  schema: 'hub.csp.v1';
  disposition: 'enforce' | 'report';
  directive: string;
  /** A CSP keyword (`inline`, `eval`) or the origin of the blocked resource. */
  blocked: string;
  /** Path of the page, without query or fragment. */
  page: string;
  /** Origin and path of the script that triggered it, when the browser says. */
  source: string | null;
  line: number | null;
  clientClass: ClientClass;
  occurredAt: string;
};

type RawViolation = {
  documentURL?: unknown;
  effectiveDirective?: unknown;
  blockedURL?: unknown;
  sourceFile?: unknown;
  lineNumber?: unknown;
  disposition?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.slice(0, MAX_FIELD_LENGTH) : '';
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** Keeps CSP keywords as they are and reduces URLs to their origin. */
function blockedOf(value: string): string {
  if (/^[a-z-]+$/.test(value)) return value;
  const url = parseUrl(value);
  if (!url) return 'unknown';
  return url.origin === 'null' ? `${url.protocol}` : url.origin;
}

function sourceOf(value: string): string | null {
  const url = parseUrl(value);
  return url && url.origin !== 'null' ? `${url.origin}${url.pathname}` : null;
}

/** Both report formats, reduced to the same raw shape. */
function rawViolations(contentType: string, body: unknown): RawViolation[] {
  if (contentType === 'application/csp-report') {
    const report = isRecord(body) ? body['csp-report'] : undefined;
    if (!isRecord(report)) return [];
    return [
      {
        documentURL: report['document-uri'],
        effectiveDirective: report['effective-directive'] ?? report['violated-directive'],
        blockedURL: report['blocked-uri'],
        sourceFile: report['source-file'],
        lineNumber: report['line-number'],
        disposition: report.disposition,
      },
    ];
  }

  if (!Array.isArray(body)) return [];
  return body
    .filter((entry) => isRecord(entry) && entry.type === 'csp-violation' && isRecord(entry.body))
    .map((entry) => (entry as { body: RawViolation }).body);
}

/**
 * Events for the violations in one request body. Reports about pages on
 * other hosts are dropped: only this site's own pages produce real ones. The
 * check trims noise; it is not authentication, since any client can lie.
 */
export function parseCspReports({
  contentType,
  body,
  siteHosts,
  userAgent,
  now,
}: {
  contentType: string;
  body: unknown;
  /** Hosts (`name[:port]`) this site answers on. */
  siteHosts: readonly string[];
  userAgent: string | null;
  now: Date;
}): CspViolationEvent[] {
  const events: CspViolationEvent[] = [];

  for (const raw of rawViolations(contentType, body).slice(0, MAX_REPORTS_PER_BATCH)) {
    const page = parseUrl(text(raw.documentURL));
    const directive = text(raw.effectiveDirective).split(' ')[0];
    if (!page || !siteHosts.includes(page.host) || !/^[a-z-]+$/.test(directive)) continue;

    const line = Number(raw.lineNumber);
    events.push({
      schema: 'hub.csp.v1',
      disposition: raw.disposition === 'enforce' ? 'enforce' : 'report',
      directive,
      blocked: blockedOf(text(raw.blockedURL)),
      page: page.pathname,
      source: sourceOf(text(raw.sourceFile)),
      line: Number.isInteger(line) && line > 0 ? line : null,
      clientClass: classifyClient(userAgent),
      occurredAt: minuteOf(now),
    });
  }

  return events;
}
