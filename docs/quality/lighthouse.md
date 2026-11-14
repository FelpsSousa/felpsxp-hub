# Lighthouse baseline

Measured on 2026-11-14, at v0.18.2, against a local production build (`next build` and
`next start`). Lighthouse 13.6.0 with Chrome 157, default mobile profile (simulated slow 4G
and 4x CPU slowdown) and the desktop preset.

## Scores

Mobile performance is the median of three runs on a quiet machine, with the range in
parentheses; the other categories were identical in every run.

| Page | Mobile perf. | Desktop perf. | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- | --- |
| `/` | 97 (94 to 99) | 100 | 100 | 100 | 100 |
| `/en/projects` | 99 (98 to 100) | 100 | 100 | 100 | 100 |
| `/projects/felpsxp-hub` | 98 (94 to 100) | 100 | 100 | 100 | 100 |
| `/contact` | 82 (78 to 99) | 100 | 100 | 100 | 100 |

Mobile performance is the only score below 100, and it is sensitive to the load on the
machine: a first run, taken while another build was running, gave 66 to 90 on these pages.
Cumulative Layout Shift is 0 on every page. On the contact page, the Turnstile script accounts
for most of the blocking time, which is why its score swings the most.

## Cost of per-request rendering (ADR-0009)

Same pages, version 0.18.1 (static) against 0.18.2 (rendered per request for the CSP nonce),
25 requests each after warm-up, on the same machine:

| | Static (0.18.1) | Per request (0.18.2) |
| --- | --- | --- |
| Time to first byte, median | 4 to 5 ms | 13 to 15 ms |
| Time to first byte, p90 | 5 to 6 ms | 15 to 23 ms |
| HTML, gzip | 9.8 to 13.2 KB | 11.0 to 15.4 KB |
| `Cache-Control` | `s-maxage=31536000` | `private, no-cache, no-store` |
| Mobile performance, `/projects/felpsxp-hub` | 97 to 100 | 94 to 100 |

The server cost is about 10 ms per page and does not move the scores. The real costs are
elsewhere: HTML is no longer cached at the CDN, so production adds a function invocation (and
an occasional cold start) to every page view, and `no-store` keeps pages out of the browser's
back/forward cache, so going back reloads the page instead of restoring it.

## Findings

- **Cross-Origin-Opener-Policy breaks Lighthouse's trace.** With `same-origin`, every run ends
  in `NO_NAVSTART` and no performance score; a blank page with only that header reproduces
  it. The header stays (it isolates the window from cross-origin openers, threat E5); local
  runs go through a measuring proxy that drops it. PageSpeed Insights may show the same error
  against production.
- **hreflang announced twice** (fixed in #79): next-intl's `Link` header repeated the
  alternates with the request's host, conflicting with the HTML on preview domains.
- **Not acted on:** about 29 KB of unused JavaScript and 14 KB of legacy polyfills, both in
  the framework's shared chunk, and the render-blocking stylesheet, which is the site's only
  CSS file. None of them is fixable from this repository without a framework change.

## How to repeat

```sh
pnpm build && pnpm exec next start --port 3100
# In another terminal: a proxy on 3300 that forwards to 3100 and drops COOP, then
npx lighthouse@13.6.0 http://localhost:3300/en/projects --output=json --output-path=report.json
```

Run each page three times, keep the median, and avoid other heavy work on the machine meanwhile.
