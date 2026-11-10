import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { parseContent } from '@/lib/parse-content';

const schema = z.strictObject({ title: z.string().min(1), year: z.number() });

describe('parseContent', () => {
  it('returns the parsed value when it is valid', () => {
    expect(parseContent(schema, { title: 'Hub', year: 2026 }, 'sample')).toEqual({
      title: 'Hub',
      year: 2026,
    });
  });

  it('names the record and the failing field when it is invalid', () => {
    expect(() => parseContent(schema, { title: '', year: 2026 }, 'project "hub" (en)')).toThrow(
      /Invalid content in project "hub" \(en\):[\s\S]*title/,
    );
  });
});
