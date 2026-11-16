import {
  CSP_REPORT_CONTENT_TYPES,
  MAX_REPORT_BYTES,
  parseCspReports,
  type CspViolationEvent,
} from '@/lib/csp-report';

type Deps = {
  emit: (event: CspViolationEvent) => void;
  now: () => Date;
  /** The canonical site URL, accepted besides the host the request came to. */
  siteUrl: string;
};

const empty = (status: number) => new Response(null, { status });

/** Reads at most `limit` bytes; null when the body is larger. */
async function readCapped(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/**
 * The CSP report endpoint, kept apart from the route so it can be tested
 * with plain `Request` objects. It answers 204 to anything well formed, even
 * when nothing in it is kept, so a sender learns nothing about the filtering.
 */
export async function handleCspReport(request: Request, deps: Deps): Promise<Response> {
  const contentType = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (!CSP_REPORT_CONTENT_TYPES.includes(contentType)) return empty(415);

  const declared = Number(request.headers.get('content-length'));
  if (declared > MAX_REPORT_BYTES) return empty(413);

  const raw = await readCapped(request, MAX_REPORT_BYTES);
  if (raw === null) return empty(413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return empty(400);
  }

  const events = parseCspReports({
    contentType,
    body,
    // Behind a proxy, `request.url` may carry the server's own host, so the
    // Host header and the canonical domain are accepted as well.
    siteHosts: [
      new URL(request.url).host,
      request.headers.get('host') ?? '',
      new URL(deps.siteUrl).host,
    ].filter(Boolean),
    userAgent: request.headers.get('user-agent'),
    now: deps.now(),
  });
  for (const event of events) deps.emit(event);

  return empty(204);
}
