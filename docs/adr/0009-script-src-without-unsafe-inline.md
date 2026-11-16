# ADR-0009: Removing `'unsafe-inline'` from `script-src`

- **Status:** Accepted
- **Date:** 2026-11-14
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (v1 stack and scope), ADR-0007 (contact form security model),
  `docs/security/threat-model.md` (residual risks), `docs/planning/roadmap.md` (Block 5)

## Context

The Content Security Policy allows `'unsafe-inline'` in `script-src`. The threat model lists
it as an accepted residual risk, and the roadmap planned to remove it by allowing the theme
init script through its SHA-256 hash, on the assumption that the theme script was the only
inline script that mattered.

Inspecting the production build shows that assumption is wrong. Every prerendered page
carries four inline scripts:

| Script | Content | Same on every page? |
| --- | --- | --- |
| Theme init (ours) | Reads the stored theme before first paint | Yes |
| `self.__next_f` bootstrap | Starts the React Server Components payload queue | Yes |
| `self.__next_f.push(...)` | The page's own RSC payload, needed for hydration | **No** |
| `_R_` (Turbopack runtime) | Lists the page's chunks | No |

Hashing `/en/accessibility` and `/pt` gives the same hashes for the first two scripts and
different ones for the payload. A CSP that lists hashes makes CSP Level 2 and later browsers
ignore `'unsafe-inline'`, so a policy carrying only the theme hash would block hydration on
every page: links, search, shortcuts, the theme toggle and the contact form would stop
working. The planned step cannot be shipped as written.

The remaining ways to drop `'unsafe-inline'` each cost something, which is why this needs
a decision rather than a pull request.

## Decision drivers

- The XSS defence should not depend on `'unsafe-inline'` if that is affordable: this is an
  AppSec portfolio, and the CSP is one of the first things a security reviewer reads.
- Pages are static today (ADR-0003): served from the CDN, fast, and free of per-request
  compute.
- Nothing may break silently; any tightening ships in report-only mode first.
- No reliance on undocumented Next.js internals that can change in a minor release.

## Options considered

### Option A: Keep `'unsafe-inline'`, document the real reason

- ✅ No change in performance, cost or architecture; pages stay static.
- ✅ The actual exposure is small: no user-generated content, no authentication, no cookies
  worth stealing, React escapes output, and the only raw HTML insertions are a constant
  script and escaped JSON-LD.
- ❌ An injected inline script would still run; the CSP stays a baseline, not a strict policy.
- ❌ The roadmap item and the threat model's plan have to be rewritten as "accepted".

### Option B: Per-request nonces with `'strict-dynamic'`

`proxy.ts` generates a nonce per request and sends
`script-src 'nonce-…' 'strict-dynamic'`; Next.js reads it from the request header and adds
it to its own scripts, and the theme script receives it too. This is the approach documented
by Next.js.

- ✅ A strict policy: no `'unsafe-inline'`, no host allowlist for scripts, and resistant to
  the allowlist bypasses that a host-based CSP suffers from.
- ✅ Documented and supported by Next.js, so it survives framework upgrades.
- ❌ Every page becomes dynamic: rendered per request by a serverless function instead of
  served as a static file from the CDN, which raises time to first byte and adds function
  invocations (well within the free tier at portfolio traffic, but no longer zero).
- ❌ Turnstile, loaded as an external script, needs checking under `'strict-dynamic'`.

### Option C: Build-time hashes per page

A post-build step hashes the inline scripts of every prerendered page and writes a manifest;
`proxy.ts` sends the matching hashes for each path.

- ✅ Strict policy while pages stay static.
- ❌ Depends on the exact inline scripts Next.js emits (`__next_f`, `_R_`), which are
  internals and can change in any release; a change would break hydration in production.
- ❌ The proxy reads a manifest produced after the build it is part of, which is awkward to
  wire and to test.
- ❌ Client-side navigation and any future dynamic route need separate handling.

## Decision

We will use **Option B**, per-request nonces with `'strict-dynamic'`, shipped in two steps:
first as `Content-Security-Policy-Report-Only` alongside the current policy, together with
the reporting endpoint already planned in Block 5, and enforced only after a clean period
with the end-to-end suite passing against it. It is the only option that gives a strict
policy through a mechanism Next.js documents and supports. Option C is rejected as too
fragile; Option A is the fallback if measurements show the dynamic rendering cost is not
acceptable.

## Consequences

**Positive**

- The CSP becomes a real second line of defence against XSS instead of a baseline.
- The threat model's residual risk is closed with a documented, supported mechanism.

**Negative**

- Pages lose static rendering; response time and hosting cost change and must be measured.
- One more moving part in `proxy.ts`, which then runs security logic on every request.

**Follow-ups**

- [x] Report-only rollout (#77).
- [x] Reporting endpoint, logging anonymous `hub.csp.v1` events.
- [ ] Enforcement, after a clean period in production.
- [x] Measure time to first byte before and after in the Lighthouse pass.
- [x] Update the threat model and the code comments in `security-headers.ts` and the root
      layout, which still describe the hash plan (#77).

## Amendments

- **2026-11-14:** measured the cost of per-request rendering (`docs/quality/lighthouse.md`).
  Server time grows from about 5 ms to about 13 ms per page and mobile Lighthouse scores do not
  change; the costs that matter are the loss of CDN caching for HTML and of the browser's
  back/forward cache, since dynamic pages are sent with `no-store`. The decision stands.
