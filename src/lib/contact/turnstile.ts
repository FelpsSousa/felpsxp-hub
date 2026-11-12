/**
 * Server-side verification of a Cloudflare Turnstile token (ADR-0007).
 * The visitor's IP is deliberately not sent: Cloudflare does not need it to
 * validate the token, and not sharing it keeps one less copy of personal data.
 */

export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Cloudflare's published test secrets (`1x…AA` passes, `2x…AA` fails,
 * `3x…AA` reports a duplicate token). They answer with a placeholder
 * hostname, so the hostname check is skipped for them, and only for them.
 */
const TEST_SECRET = /^[123]x0+AA$/;

export type TurnstileResult = { success: true } | { success: false; errorCodes: string[] };

type SiteverifyResponse = {
  success?: boolean;
  hostname?: string;
  'error-codes'?: string[];
};

export async function verifyTurnstileToken({
  token,
  secret,
  expectedHostname,
  fetchImpl = fetch,
}: {
  token: string | null;
  secret: string;
  /** The hostname the form was served from; the token must have been issued there. */
  expectedHostname: string | null;
  fetchImpl?: typeof fetch;
}): Promise<TurnstileResult> {
  if (!token) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  let body: SiteverifyResponse;
  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    body = (await response.json()) as SiteverifyResponse;
  } catch {
    return { success: false, errorCodes: ['siteverify-unreachable'] };
  }

  if (body.success !== true) {
    return { success: false, errorCodes: body['error-codes'] ?? ['unknown'] };
  }

  const isTestSecret = TEST_SECRET.test(secret);
  if (!isTestSecret && (!expectedHostname || body.hostname !== expectedHostname)) {
    return { success: false, errorCodes: ['hostname-mismatch'] };
  }

  return { success: true };
}
