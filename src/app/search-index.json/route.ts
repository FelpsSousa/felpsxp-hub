import { buildSearchIndexes } from '@/lib/search-index';

// Built once at build time and served as a static file. The dotted path keeps
// it outside the locale proxy; the dialog fetches it on first open only.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndexes());
}
