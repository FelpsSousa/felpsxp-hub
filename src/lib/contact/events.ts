/**
 * Anonymous security events for the contact form, schema `hub.contact.v1`
 * (ADR-0007). They carry no personal data: no names, addresses, message
 * text, IP addresses or raw User-Agent. Until the Platform's ingestion API
 * exists they are written as one structured log line.
 */

export type ContactRejectionReason = 'turnstile' | 'honeypot' | 'validation' | 'delivery';

export type ClientClass = 'browser' | 'tool' | 'known-bot' | 'unknown';

export type ContactEvent = {
  schema: 'hub.contact.v1';
  outcome: 'rejected' | 'delivered';
  reason?: ContactRejectionReason;
  turnstileErrors?: string[];
  country: string | null;
  clientClass: ClientClass;
  occurredAt: string;
};

const knownBots = /bot|crawl|spider|slurp|facebookexternalhit|preview/i;
const tools =
  /curl|wget|python|httpx|aiohttp|go-http-client|java\/|okhttp|axios|node-fetch|undici|postman|insomnia|libwww|scrapy|nuclei|sqlmap|nikto|zgrab/i;
const browsers = /mozilla\/5\.0/i;

/** Coarse client class; the User-Agent itself is discarded right after. */
export function classifyClient(userAgent: string | null): ClientClass {
  if (!userAgent) return 'unknown';
  if (knownBots.test(userAgent)) return 'known-bot';
  if (tools.test(userAgent)) return 'tool';
  if (browsers.test(userAgent)) return 'browser';
  return 'unknown';
}

/** Two uppercase letters, or nothing: the header is not trusted blindly. */
export function normaliseCountry(value: string | null): string | null {
  return value && /^[A-Z]{2}$/.test(value) ? value : null;
}

/** ISO timestamp rounded down to the minute. */
export function minuteOf(date: Date): string {
  const rounded = new Date(date);
  rounded.setUTCSeconds(0, 0);
  return rounded.toISOString();
}

export function buildContactEvent({
  outcome,
  reason,
  turnstileErrors,
  country,
  userAgent,
  now,
}: {
  outcome: ContactEvent['outcome'];
  reason?: ContactRejectionReason;
  turnstileErrors?: string[];
  country: string | null;
  userAgent: string | null;
  now: Date;
}): ContactEvent {
  return {
    schema: 'hub.contact.v1',
    outcome,
    ...(reason ? { reason } : {}),
    ...(turnstileErrors?.length ? { turnstileErrors } : {}),
    country: normaliseCountry(country),
    clientClass: classifyClient(userAgent),
    occurredAt: minuteOf(now),
  };
}
