import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContactEvent } from '@/lib/contact/events';
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from '@/lib/contact/fields';
import {
  contactConfigFromEnv,
  handleContactSubmission,
  type ContactConfig,
  type SubmissionDeps,
} from '@/lib/contact/handle-submission';

const config: ContactConfig = {
  turnstileSecret: 'secret',
  resendApiKey: 're_key',
  fromEmail: 'FelpsXP Hub <site@felpsxp.com>',
  toEmail: 'owner@example.com',
};

const context = { host: 'felpsxp.com', country: 'BR', userAgent: 'Mozilla/5.0 Firefox' };

const personalData = ['Ada Lovelace', 'ada@example.com', 'Analytical Engines', 'senior role'];

function formWith(overrides: Record<string, string> = {}): FormData {
  const form = new FormData();
  const values: Record<string, string> = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Analytical Engines',
    intent: 'hiring',
    message: 'I would like to talk about a senior role.',
    [TURNSTILE_FIELD]: 'token',
    [HONEYPOT_FIELD]: '',
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
}

let events: ContactEvent[];
let deps: SubmissionDeps & {
  verifyTurnstile: ReturnType<typeof vi.fn>;
  sendEmail: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  events = [];
  deps = {
    verifyTurnstile: vi.fn(async () => ({ success: true as const })),
    sendEmail: vi.fn(async () => true),
    emit: (event) => events.push(event),
    now: () => new Date('2026-11-12T10:00:30Z'),
  };
});

describe('handleContactSubmission', () => {
  it('delivers a valid message and records a delivered event', async () => {
    const state = await handleContactSubmission(formWith(), context, config, deps);

    expect(state).toEqual({ status: 'success' });
    expect(deps.sendEmail).toHaveBeenCalledOnce();
    const [email, apiKey] = deps.sendEmail.mock.calls[0];
    expect(apiKey).toBe('re_key');
    expect(email).toMatchObject({ to: ['owner@example.com'], reply_to: 'ada@example.com' });
    expect(events).toEqual([expect.objectContaining({ outcome: 'delivered', country: 'BR' })]);
  });

  it('checks Turnstile first, against the request hostname without port', async () => {
    await handleContactSubmission(formWith(), { ...context, host: 'felpsxp.com:443' }, config, deps);
    expect(deps.verifyTurnstile).toHaveBeenCalledWith({
      token: 'token',
      secret: 'secret',
      expectedHostname: 'felpsxp.com',
    });
  });

  it('rejects a failed Turnstile check before reading anything else', async () => {
    deps.verifyTurnstile.mockResolvedValueOnce({
      success: false,
      errorCodes: ['invalid-input-response'],
    });
    const state = await handleContactSubmission(
      formWith({ [HONEYPOT_FIELD]: 'filled', email: 'bad' }),
      context,
      config,
      deps,
    );

    expect(state).toEqual({ status: 'error' });
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(events).toEqual([
      expect.objectContaining({ reason: 'turnstile', turnstileErrors: ['invalid-input-response'] }),
    ]);
  });

  it('answers a filled honeypot with a fake success and sends nothing', async () => {
    const state = await handleContactSubmission(
      formWith({ [HONEYPOT_FIELD]: 'https://spam.example' }),
      context,
      config,
      deps,
    );

    expect(state).toEqual({ status: 'success' });
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(events).toEqual([expect.objectContaining({ outcome: 'rejected', reason: 'honeypot' })]);
  });

  it('returns only the names of invalid fields', async () => {
    const state = await handleContactSubmission(
      formWith({ email: 'not-an-address', message: 'short' }),
      context,
      config,
      deps,
    );

    expect(state).toEqual({ status: 'invalid', fields: ['email', 'message'] });
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(events).toEqual([expect.objectContaining({ reason: 'validation' })]);
  });

  it('rejects header injection through the name field', async () => {
    const state = await handleContactSubmission(
      formWith({ name: 'Ada\r\nBcc: victim@example.com' }),
      context,
      config,
      deps,
    );
    expect(state).toEqual({ status: 'invalid', fields: ['name'] });
  });

  it('gives a generic error when delivery fails', async () => {
    deps.sendEmail.mockResolvedValueOnce(false);
    const state = await handleContactSubmission(formWith(), context, config, deps);

    expect(state).toEqual({ status: 'error' });
    expect(events).toEqual([expect.objectContaining({ reason: 'delivery' })]);
  });

  it('gives a generic error when the server is not configured', async () => {
    const state = await handleContactSubmission(formWith(), context, null, deps);

    expect(state).toEqual({ status: 'error' });
    expect(deps.verifyTurnstile).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it('never puts personal data in a security event', async () => {
    await handleContactSubmission(formWith(), context, config, deps);
    await handleContactSubmission(formWith({ message: 'short' }), context, config, deps);
    await handleContactSubmission(formWith({ [HONEYPOT_FIELD]: 'x' }), context, config, deps);

    const serialised = JSON.stringify(events);
    for (const value of personalData) {
      expect(serialised).not.toContain(value);
    }
    expect(serialised).not.toContain('Firefox');
  });
});

describe('contactConfigFromEnv', () => {
  const env = {
    TURNSTILE_SECRET_KEY: 'secret',
    RESEND_API_KEY: 're_key',
    CONTACT_FROM_EMAIL: 'site@felpsxp.com',
    CONTACT_TO_EMAIL: 'owner@example.com',
  };

  it('reads every variable', () => {
    expect(contactConfigFromEnv(env)).toEqual({
      turnstileSecret: 'secret',
      resendApiKey: 're_key',
      fromEmail: 'site@felpsxp.com',
      toEmail: 'owner@example.com',
    });
  });

  it.each(Object.keys(env))('returns null when %s is missing or blank', (key) => {
    expect(contactConfigFromEnv({ ...env, [key]: '  ' })).toBeNull();
    expect(contactConfigFromEnv({ ...env, [key]: undefined })).toBeNull();
  });
});
