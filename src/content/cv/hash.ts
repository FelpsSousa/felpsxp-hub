import { createHash } from 'node:crypto';

/**
 * A fingerprint of everything the CV PDF prints for one locale: the CV
 * content and the page's own labels. `pnpm cv:pdf` records it next to the
 * PDFs, and a unit test fails when the content changes without the PDFs
 * being rendered again (ADR-0010). Plain imports only, so the script can
 * load this file with Node's type stripping.
 */
export function cvFingerprint(cv: unknown, labels: unknown): string {
  return createHash('sha256').update(JSON.stringify({ cv, labels })).digest('hex');
}
