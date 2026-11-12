import type { ContactInput } from '@/lib/contact/schema';

export const RESEND_API_URL = 'https://api.resend.com/emails';

export type ContactEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
};

/**
 * Builds a plain-text e-mail (ADR-0007): visitor input is never rendered as
 * HTML. Every value that reaches a header (subject, reply-to) has already been
 * validated as a single line by the schema.
 */
export function buildContactEmail(
  input: ContactInput,
  { from, to }: { from: string; to: string },
): ContactEmail {
  const company = input.company ? ` (${input.company})` : '';

  return {
    from,
    to: [to],
    reply_to: input.email,
    subject: `[felpsxp.com] ${input.intent}: ${input.name}${company}`,
    text: [
      `Name: ${input.name}`,
      `E-mail: ${input.email}`,
      `Company: ${input.company ?? '-'}`,
      `Intent: ${input.intent}`,
      '',
      input.message,
      '',
      '--',
      'Sent from the contact form at felpsxp.com. Reply to answer the sender directly.',
    ].join('\n'),
  };
}

/** Sends through the Resend API with a plain `fetch` (no SDK). Never throws. */
export async function sendContactEmail(
  email: ContactEmail,
  { apiKey, fetchImpl = fetch }: { apiKey: string; fetchImpl?: typeof fetch },
): Promise<boolean> {
  try {
    const response = await fetchImpl(RESEND_API_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(email),
    });
    return response.ok;
  } catch {
    return false;
  }
}
