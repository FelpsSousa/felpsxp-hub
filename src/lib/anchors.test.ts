import { describe, expect, it } from 'vitest';
import { headingIds, slugify } from '@/lib/anchors';

describe('slugify', () => {
  it('drops accents and punctuation and joins words with hyphens', () => {
    expect(slugify('Por quanto tempo guardo os dados?')).toBe('por-quanto-tempo-guardo-os-dados');
    expect(slugify('Divulgação responsável')).toBe('divulgacao-responsavel');
    expect(slugify('  LGPD: seus direitos  ')).toBe('lgpd-seus-direitos');
  });

  it('returns an empty string when nothing usable is left', () => {
    expect(slugify('¿?! …')).toBe('');
  });
});

describe('headingIds', () => {
  it('keeps ids unique and falls back when a heading has no usable characters', () => {
    expect(headingIds(['Escopo', 'Escopo', '?!', 'Escopo'])).toEqual([
      'escopo',
      'escopo-2',
      'section-3',
      'escopo-3',
    ]);
  });
});
