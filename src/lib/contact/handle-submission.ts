import { buildContactEmail, type ContactEmail } from '@/lib/contact/email';
import {
  buildContactEvent,
  type ContactEvent,
  type ContactRejectionReason,
} from '@/lib/contact/events';
import { HONEYPOT_FIELD, TURNSTILE_FIELD } from '@/lib/contact/fields';
import { contactSchema, type ContactField } from '@/lib/contact/schema';
import type { TurnstileResult } from '@/lib/contact/turnstile';


export type ContactActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; fields: ContactField[] }
  | { status: 'error' };

export type ContactConfig = {
  turnstileSecret: string;
  resendApiKey: string;
  fromEmail: string;
  toEmail: string;
};

export type SubmissionContext = {
  host: string | null;
  country: string | null;
  userAgent: string | null;
};

export type SubmissionDeps = {
  verifyTurnstile: (args: {
    token: string | null;
    secret: string;
    expectedHostname: string | null;
  }) => Promise<TurnstileResult>;
  sendEmail: (email: ContactEmail, apiKey: string) => Promise<boolean>;
  emit: (event: ContactEvent) => void;
  now: () => Date;
};

function field(form: FormData, name: string): string | null {
  const value = form.get(name);
  return typeof value === 'string' ? value : null;
}

/** The hostname without a port, as Turnstile reports it. */
function hostnameOf(host: string | null): string | null {
  return host ? host.split(':')[0].toLowerCase() : null;
}

/**
 * Handles one contact submission in the order fixed by ADR-0007:
 * Turnstile, honeypot, validation, delivery. Responses are generic, and every
 * outcome produces one anonymous security event.
 */
export async function handleContactSubmission(
  form: FormData,
  context: SubmissionContext,
  config: ContactConfig | null,
  deps: SubmissionDeps,
): Promise<ContactActionState> {
  const emit = (
    outcome: ContactEvent['outcome'],
    reason?: ContactRejectionReason,
    turnstileErrors?: string[],
  ) =>
    deps.emit(
      buildContactEvent({
        outcome,
        reason,
        turnstileErrors,
        country: context.country,
        userAgent: context.userAgent,
        now: deps.now(),
      }),
    );

  if (!config) {
    // Misconfiguration is not the visitor's fault; nothing to blame in the event.
    emit('rejected', 'delivery');
    return { status: 'error' };
  }

  const turnstile = await deps.verifyTurnstile({
    token: field(form, TURNSTILE_FIELD),
    secret: config.turnstileSecret,
    expectedHostname: hostnameOf(context.host),
  });
  if (!turnstile.success) {
    emit('rejected', 'turnstile', turnstile.errorCodes);
    return { status: 'error' };
  }

  if (field(form, HONEYPOT_FIELD)) {
    // Looks like success to the sender, so bots learn nothing; nothing is sent.
    emit('rejected', 'honeypot');
    return { status: 'success' };
  }

  const parsed = contactSchema.safeParse({
    name: field(form, 'name') ?? '',
    email: field(form, 'email') ?? '',
    company: field(form, 'company') || undefined,
    intent: field(form, 'intent') ?? '',
    message: field(form, 'message') ?? '',
  });
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path[0] as ContactField)),
    ];
    emit('rejected', 'validation');
    return { status: 'invalid', fields };
  }

  const email = buildContactEmail(parsed.data, {
    from: config.fromEmail,
    to: config.toEmail,
  });
  const delivered = await deps.sendEmail(email, config.resendApiKey);
  if (!delivered) {
    emit('rejected', 'delivery');
    return { status: 'error' };
  }

  emit('delivered');
  return { status: 'success' };
}

/** Reads the configuration from the environment; `null` when anything is missing. */
export function contactConfigFromEnv(
  env: Record<string, string | undefined>,
): ContactConfig | null {
  const config = {
    turnstileSecret: env.TURNSTILE_SECRET_KEY?.trim() ?? '',
    resendApiKey: env.RESEND_API_KEY?.trim() ?? '',
    fromEmail: env.CONTACT_FROM_EMAIL?.trim() ?? '',
    toEmail: env.CONTACT_TO_EMAIL?.trim() ?? '',
  };
  return Object.values(config).every(Boolean) ? config : null;
}
