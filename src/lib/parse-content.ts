import { z } from 'zod';

/**
 * Parses one content record and throws an error that names the record and
 * every failing field, so a broken build points straight at the file to fix.
 */
export function parseContent<Schema extends z.ZodType>(
  schema: Schema,
  value: unknown,
  label: string,
): z.output<Schema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(`Invalid content in ${label}:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}
