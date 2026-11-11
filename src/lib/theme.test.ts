import { describe, expect, it } from 'vitest';
import {
  nextThemePreference,
  parseThemePreference,
  THEME_STORAGE_KEY,
  themeInitScript,
} from '@/lib/theme';

describe('nextThemePreference', () => {
  it('cycles system, light, dark and back to system', () => {
    expect(nextThemePreference('system')).toBe('light');
    expect(nextThemePreference('light')).toBe('dark');
    expect(nextThemePreference('dark')).toBe('system');
  });
});

describe('parseThemePreference', () => {
  it('accepts only the two explicit themes', () => {
    expect(parseThemePreference('light')).toBe('light');
    expect(parseThemePreference('dark')).toBe('dark');
  });

  it.each([null, undefined, '', 'system', 'Dark', '"><script>', 42])(
    'falls back to system for %j',
    (value) => {
      expect(parseThemePreference(value)).toBe('system');
    },
  );
});

describe('themeInitScript', () => {
  it('reads the same storage key the toggle writes', () => {
    expect(themeInitScript).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`);
  });

  it('only ever applies the literal light or dark values', () => {
    expect(themeInitScript).toContain("t==='light'||t==='dark'");
  });

  it('applies a stored theme and ignores anything else', () => {
    for (const [stored, expected] of [
      ['dark', 'dark'],
      ['light', 'light'],
      ['purple', undefined],
      [null, undefined],
    ] as const) {
      const dataset: Record<string, string> = {};
      const localStorage = { getItem: () => stored };
      const document = { documentElement: { dataset } };
      new Function('localStorage', 'document', themeInitScript)(localStorage, document);
      expect(dataset.theme).toBe(expected);
    }
  });

  it('does not throw when storage is unavailable', () => {
    const localStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    const document = { documentElement: { dataset: {} } };
    expect(() =>
      new Function('localStorage', 'document', themeInitScript)(localStorage, document),
    ).not.toThrow();
  });
});
