import { describe, expect, it, vi } from 'vitest';
import { buildContactEmail, RESEND_API_URL, sendContactEmail } from '@/lib/contact/email';

const input = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  intent: 'hiring' as const,
  message: '<script>alert(1)</script>\nSecond line.',
};

const addresses = { from: 'FelpsXP Hub <site@felpsxp.com>', to: 'owner@example.com' };

describe('buildContactEmail', () => {
  it('sends to the owner and replies to the visitor', () => {
    const email = buildContactEmail(input, addresses);
    expect(email.from).toBe(addresses.from);
    expect(email.to).toEqual([addresses.to]);
    expect(email.reply_to).toBe('ada@example.com');
    expect(email.subject).toBe('[felpsxp.com] hiring: Ada Lovelace (Analytical Engines)');
  });

  it('is plain text only, with the message kept verbatim', () => {
    const email = buildContactEmail(input, addresses);
    expect(email).not.toHaveProperty('html');
    expect(email.text).toContain('<script>alert(1)</script>\nSecond line.');
  });

  it('marks a missing company instead of leaving it blank', () => {
    const email = buildContactEmail({ ...input, company: undefined }, addresses);
    expect(email.subject).toBe('[felpsxp.com] hiring: Ada Lovelace');
    expect(email.text).toContain('Company: -');
  });
});

describe('sendContactEmail', () => {
  const email = buildContactEmail(input, addresses);

  it('posts JSON to Resend with the API key as a bearer token', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 200 }));
    expect(await sendContactEmail(email, { apiKey: 're_test', fetchImpl })).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_API_URL);
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer re_test');
    expect(JSON.parse(init.body as string)).toEqual(email);
  });

  it('reports failure on an error status or a network error, without throwing', async () => {
    const rejected = vi.fn(async () => new Response('{}', { status: 422 }));
    const broken = vi.fn(async () => {
      throw new Error('network down');
    });
    expect(await sendContactEmail(email, { apiKey: 'k', fetchImpl: rejected })).toBe(false);
    expect(await sendContactEmail(email, { apiKey: 'k', fetchImpl: broken })).toBe(false);
  });
});
