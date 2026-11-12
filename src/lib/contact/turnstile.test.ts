import { describe, expect, it, vi } from 'vitest';
import { TURNSTILE_VERIFY_URL, verifyTurnstileToken } from '@/lib/contact/turnstile';

const realSecret = '0x4AAAAAAAexampleSecretValue';
const testSecret = '1x0000000000000000000000000000000AA';

function respondWith(body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body)));
}

describe('verifyTurnstileToken', () => {
  it('rejects a missing token without calling Cloudflare', async () => {
    const fetchImpl = respondWith({ success: true });
    const result = await verifyTurnstileToken({
      token: null,
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl,
    });
    expect(result).toEqual({ success: false, errorCodes: ['missing-input-response'] });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('posts the secret and token to siteverify, without the visitor IP', async () => {
    const fetchImpl = respondWith({ success: true, hostname: 'felpsxp.com' });
    await verifyTurnstileToken({
      token: 'token',
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl,
    });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const body = init.body as URLSearchParams;
    expect(url).toBe(TURNSTILE_VERIFY_URL);
    expect(body.get('secret')).toBe(realSecret);
    expect(body.get('response')).toBe('token');
    expect(body.has('remoteip')).toBe(false);
  });

  it('accepts a valid token issued for the expected hostname', async () => {
    const result = await verifyTurnstileToken({
      token: 'token',
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl: respondWith({ success: true, hostname: 'felpsxp.com' }),
    });
    expect(result).toEqual({ success: true });
  });

  it('rejects a valid token issued for another hostname', async () => {
    const result = await verifyTurnstileToken({
      token: 'token',
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl: respondWith({ success: true, hostname: 'evil.example' }),
    });
    expect(result).toEqual({ success: false, errorCodes: ['hostname-mismatch'] });
  });

  it('passes on Cloudflare error codes', async () => {
    const result = await verifyTurnstileToken({
      token: 'token',
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl: respondWith({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
    });
    expect(result).toEqual({ success: false, errorCodes: ['timeout-or-duplicate'] });
  });

  it('fails closed when Cloudflare is unreachable', async () => {
    const result = await verifyTurnstileToken({
      token: 'token',
      secret: realSecret,
      expectedHostname: 'felpsxp.com',
      fetchImpl: vi.fn(async () => {
        throw new Error('network down');
      }),
    });
    expect(result).toEqual({ success: false, errorCodes: ['siteverify-unreachable'] });
  });

  it('skips the hostname check only for the published test secrets', async () => {
    const result = await verifyTurnstileToken({
      token: 'token',
      secret: testSecret,
      expectedHostname: 'localhost',
      fetchImpl: respondWith({ success: true, hostname: 'example.com' }),
    });
    expect(result).toEqual({ success: true });
  });
});
