import { describe, expect, it } from 'vitest';
import {
  buildContactEvent,
  classifyClient,
  minuteOf,
  normaliseCountry,
} from '@/lib/contact/events';

describe('classifyClient', () => {
  it.each([
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142.0 Safari/537.36', 'browser'],
    ['curl/8.11.0', 'tool'],
    ['python-requests/2.32.3', 'tool'],
    ['sqlmap/1.8#stable (https://sqlmap.org)', 'tool'],
    ['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'known-bot'],
    ['', 'unknown'],
    [null, 'unknown'],
    ['SomethingElse/1.0', 'unknown'],
  ])('classifies %j as %s', (userAgent, expected) => {
    expect(classifyClient(userAgent)).toBe(expected);
  });
});

describe('normaliseCountry', () => {
  it('keeps a two-letter code and drops anything else', () => {
    expect(normaliseCountry('BR')).toBe('BR');
    expect(normaliseCountry('br')).toBeNull();
    expect(normaliseCountry('<script>')).toBeNull();
    expect(normaliseCountry(null)).toBeNull();
  });
});

describe('minuteOf', () => {
  it('rounds down to the minute', () => {
    expect(minuteOf(new Date('2026-11-12T14:37:59.999Z'))).toBe('2026-11-12T14:37:00.000Z');
  });
});

describe('buildContactEvent', () => {
  const userAgent = 'curl/8.11.0';
  const event = buildContactEvent({
    outcome: 'rejected',
    reason: 'turnstile',
    turnstileErrors: ['invalid-input-response'],
    country: 'US',
    userAgent,
    now: new Date('2026-11-12T14:37:42Z'),
  });

  it('follows schema hub.contact.v1', () => {
    expect(event).toEqual({
      schema: 'hub.contact.v1',
      outcome: 'rejected',
      reason: 'turnstile',
      turnstileErrors: ['invalid-input-response'],
      country: 'US',
      clientClass: 'tool',
      occurredAt: '2026-11-12T14:37:00.000Z',
    });
  });

  it('never carries the raw User-Agent', () => {
    expect(JSON.stringify(event)).not.toContain(userAgent);
  });

  it('omits empty optional fields', () => {
    const delivered = buildContactEvent({
      outcome: 'delivered',
      country: null,
      userAgent: null,
      now: new Date(),
    });
    expect(delivered).not.toHaveProperty('reason');
    expect(delivered).not.toHaveProperty('turnstileErrors');
  });
});
