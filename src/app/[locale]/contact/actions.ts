'use server';

import { headers } from 'next/headers';
import { sendContactEmail } from '@/lib/contact/email';
import {
  contactConfigFromEnv,
  handleContactSubmission,
  type ContactActionState,
} from '@/lib/contact/handle-submission';
import { verifyTurnstileToken } from '@/lib/contact/turnstile';

/**
 * Contact form Server Action (ADR-0007). Next.js accepts only POST here and
 * rejects requests whose Origin does not match the Host, which covers CSRF.
 * All the logic lives in `handleContactSubmission`, which is unit tested.
 */
export async function submitContact(
  _previous: ContactActionState,
  form: FormData,
): Promise<ContactActionState> {
  const requestHeaders = await headers();

  return handleContactSubmission(
    form,
    {
      host: requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host'),
      country: requestHeaders.get('x-vercel-ip-country'),
      userAgent: requestHeaders.get('user-agent'),
    },
    contactConfigFromEnv(process.env),
    {
      verifyTurnstile: (args) => verifyTurnstileToken(args),
      sendEmail: (email, apiKey) => sendContactEmail(email, { apiKey }),
      // One structured line per submission, without personal data.
      emit: (event) => console.info(JSON.stringify(event)),
      now: () => new Date(),
    },
  );
}
