import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `public/.well-known/security.txt` (RFC 9116). An expired file is a common
 * audit finding, so CI starts failing 30 days before `Expires`, as a reminder
 * to renew it.
 */
const path = fileURLToPath(new URL('../../public/.well-known/security.txt', import.meta.url));
const lines = readFileSync(path, 'utf8')
  .split('\n')
  .filter((line) => line && !line.startsWith('#'));

function values(field: string): string[] {
  return lines
    .filter((line) => line.startsWith(`${field}: `))
    .map((line) => line.slice(field.length + 2));
}

const DAY = 24 * 60 * 60 * 1000;

describe('security.txt', () => {
  it('lists the security mailbox as a contact', () => {
    expect(values('Contact')).toContain('mailto:security@felpsxp.com');
  });

  it('has exactly one Expires, less than a year away and not within 30 days', () => {
    const expires = values('Expires');
    expect(expires).toHaveLength(1);
    const remaining = new Date(expires[0]).getTime() - Date.now();
    expect(remaining, 'renew public/.well-known/security.txt').toBeGreaterThan(30 * DAY);
    expect(remaining).toBeLessThanOrEqual(366 * DAY);
  });

  it('points to its canonical URL and to the policy', () => {
    expect(values('Canonical')).toEqual(['https://felpsxp.com/.well-known/security.txt']);
    expect(values('Policy')).toEqual(['https://felpsxp.com/security']);
  });

  it('only uses fields defined by RFC 9116', () => {
    const known = [
      'Acknowledgments',
      'Canonical',
      'Contact',
      'Encryption',
      'Expires',
      'Hiring',
      'Policy',
      'Preferred-Languages',
    ];
    for (const line of lines) {
      expect(known).toContain(line.split(':')[0]);
    }
  });
});
