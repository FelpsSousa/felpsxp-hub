import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact/schema';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  intent: 'hiring',
  message: 'I would like to talk about a senior role.',
};

const parse = (overrides: Record<string, unknown>) =>
  contactSchema.safeParse({ ...valid, ...overrides });

describe('contactSchema', () => {
  it('accepts a valid message, with or without a company', () => {
    expect(parse({}).success).toBe(true);
    expect(parse({ company: undefined }).success).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    const result = parse({ name: '  Ada  ', email: ' ada@example.com ' });
    expect(result.success && result.data).toMatchObject({ name: 'Ada', email: 'ada@example.com' });
  });

  it.each(['name', 'email', 'company'])('rejects a line break in %s (header injection)', (key) => {
    const injected = key === 'email' ? 'ada@example.com\r\nBcc: x@evil.test' : 'Ada\r\nBcc: x@evil.test';
    expect(parse({ [key]: injected }).success).toBe(false);
  });

  it('allows line breaks in the message body', () => {
    expect(parse({ message: 'First line.\nSecond line, still valid.' }).success).toBe(true);
  });

  it('enforces the length limits', () => {
    expect(parse({ name: '' }).success).toBe(false);
    expect(parse({ name: 'a'.repeat(101) }).success).toBe(false);
    expect(parse({ company: 'a'.repeat(101) }).success).toBe(false);
    expect(parse({ message: 'too short' }).success).toBe(false);
    expect(parse({ message: 'a'.repeat(5001) }).success).toBe(false);
    expect(parse({ email: `${'a'.repeat(250)}@x.io` }).success).toBe(false);
  });

  it('rejects an invalid e-mail address and an unknown intent', () => {
    expect(parse({ email: 'not-an-address' }).success).toBe(false);
    expect(parse({ intent: 'spam' }).success).toBe(false);
  });

  it('rejects unexpected fields', () => {
    expect(parse({ isAdmin: true }).success).toBe(false);
  });
});
