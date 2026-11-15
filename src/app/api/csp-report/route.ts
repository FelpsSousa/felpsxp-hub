import { getSiteSettings } from '@/lib/content';
import { handleCspReport } from '@/lib/csp-report-handler';

/** Receives CSP violation reports from browsers (ADR-0009). POST only. */
export async function POST(request: Request): Promise<Response> {
  return handleCspReport(request, {
    emit: (event) => console.warn(JSON.stringify(event)),
    now: () => new Date(),
    siteUrl: getSiteSettings().url,
  });
}
