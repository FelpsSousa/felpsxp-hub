import { z } from 'zod';

/** Why someone is writing. Kept small so the e-mail subject stays scannable. */
export const contactIntents = ['hiring', 'partnership', 'collaboration', 'other'] as const;

export type ContactIntent = (typeof contactIntents)[number];

/** Any carriage return or line feed. Fields that reach an e-mail header must not contain one. */
const lineBreak = /[\r\n]/;

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => !lineBreak.test(value), { message: 'must be a single line' });

/**
 * The contact form's fields (ADR-0007). The server is the authority: the
 * client may run the same schema for instant feedback, but every submission
 * is parsed here again.
 */
export const contactSchema = z.strictObject({
  name: singleLine(100).pipe(z.string().min(1)),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email())
    .refine((value) => !lineBreak.test(value), { message: 'must be a single line' }),
  company: singleLine(100).optional(),
  intent: z.enum(contactIntents),
  message: z.string().trim().min(10).max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = keyof ContactInput;
