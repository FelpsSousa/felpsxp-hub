import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cvByLocale } from '@/content/cv/cv';
import { cvFingerprint } from '@/content/cv/hash';
import fingerprints from '@/content/cv/pdf-fingerprints.json';
import en from '../../../messages/en.json';
import pt from '../../../messages/pt.json';

const labels = { pt: pt.cv, en: en.cv } as const;

describe('CV PDFs (ADR-0010)', () => {
  for (const locale of ['pt', 'en'] as const) {
    const file = `public/cv/felipe-sousa-cv-${locale}.pdf`;

    it(`ships the ${locale} PDF`, () => {
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file).subarray(0, 5).toString()).toBe('%PDF-');
    });

    it(`has a ${locale} PDF rendered from the current content (run pnpm cv:pdf if this fails)`, () => {
      expect(fingerprints[locale]).toBe(cvFingerprint(cvByLocale[locale], labels[locale]));
    });
  }
});
