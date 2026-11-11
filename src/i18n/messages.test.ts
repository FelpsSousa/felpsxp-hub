import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import pt from '../../messages/pt.json';

function keyPaths(value: unknown, prefix = ''): string[] {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function leafValues(value: unknown): unknown[] {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).flatMap(leafValues);
  }
  return [value];
}

describe('translation messages', () => {
  it('define exactly the same keys in every locale', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(pt).sort());
  });

  it('have no empty strings and no em or en dashes', () => {
    for (const value of [...leafValues(pt), ...leafValues(en)]) {
      expect(typeof value).toBe('string');
      expect((value as string).trim()).not.toBe('');
      expect(value).not.toMatch(/[–—]/);
    }
  });
});
