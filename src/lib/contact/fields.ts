/**
 * Plain constants of the contact form, shared by the server and the browser.
 * They live apart from `schema.ts` so the form does not ship Zod to the client.
 */

/** Name of the hidden field people never fill (ADR-0007). */
export const HONEYPOT_FIELD = 'website';

/** Name of the field Cloudflare Turnstile writes its token into. */
export const TURNSTILE_FIELD = 'cf-turnstile-response';

/** Why someone is writing. Kept small so the e-mail subject stays scannable. */
export const contactIntents = ['hiring', 'partnership', 'collaboration', 'other'] as const;

export type ContactIntent = (typeof contactIntents)[number];
