import { describe, expect, it, vi } from 'vitest';
import { requireLocale } from '@/i18n/locale';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

describe('requireLocale', () => {
  it('returns a supported locale unchanged', () => {
    expect(requireLocale('pt')).toBe('pt');
    expect(requireLocale('en')).toBe('en');
  });

  it('turns anything else into a 404', () => {
    for (const value of ['favicon.ico', 'wp-login.php', 'EN', '']) {
      expect(() => requireLocale(value)).toThrow('NEXT_NOT_FOUND');
    }
  });
});
