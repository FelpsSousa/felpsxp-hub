# ADR-0011: Telemetry source for the security observatory

- **Status:** Accepted (agreed by Felipe on 2026-11-24, in #114)
- **Date:** 2026-11-24
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (v1 stack and scope), ADR-0007 (contact form security model),
  ADR-0009 (CSP nonces), `docs/planning/roadmap.md` (Block 5),
  `docs/security/pentest-2026-11-22.md`

## Context

Block 5 of the roadmap plans a public security observatory: who probes the Hub, from where,
when, what is attempted and how each attempt is handled. Its first step, "observatory v0",
was meant to need no database: a page built from the Vercel and Cloudflare analytics APIs,
aggregated at build or revalidation time. The longer-term plan moves collection and storage
to `felpsxp-platform`, with the Hub as an event emitter that never stores visitor data.

The go-live of 2026-11-20 settled the hosting facts this decision depends on:

- The Hub runs on the Vercel **Hobby** plan. `felpsxp.com` and `www` point at Vercel with
  Cloudflare records set to **DNS only**, as Vercel recommends.
- In DNS-only mode Cloudflare answers DNS and nothing else: it never sees an HTTP request, so
  it has no security events for this site.
- The light pentest of 2026-11-22 showed Vercel's own protection at work: after about twenty
  scanner-style paths, Vercel answered with its Security Checkpoint challenge.

What each platform offers on the plans in use, from the vendors' documentation in November
2026:

| | Vercel Hobby | Cloudflare Free, proxied |
| --- | --- | --- |
| Security events | Firewall view in the dashboard only | Security Events, with action, rule, path, country, ASN |
| API for events | None: log drains (which carry firewall events) need Pro | GraphQL Analytics API, `firewallEventsAdaptive` and HTTP request datasets |
| Retention | Runtime logs about 1 hour | At least 31 days of adaptive data on every plan, up to 30 days per query |
| Rate limiting | One rule, fixed window 10 s to 10 min, keyed by IP | One rule, 10 s period |
| Bot defence | Platform challenge; Bot Protection managed ruleset | Bot Fight Mode, free managed ruleset |

Two consequences follow. On Hobby, Vercel offers **no programmatic source** for an
observatory, so v0 as written cannot be built from it. And putting Cloudflare's proxy in
front of Vercel is the configuration Vercel advises against: Vercel then sees Cloudflare's
addresses instead of the visitor's, its firewall loses visibility, its Bot Protection ruleset
stops working, and passing the real client IP and location through needs Verified Proxy
Advanced, an Enterprise feature.

## Decision drivers

- The observatory must show real data, not a mock-up: it is AppSec proof for recruiters.
- No visitor data stored by the Hub (ADR-0003); only aggregates are public (roadmap data
  tiers).
- Defence first: the observatory must not weaken the protections the site has today.
- No new paid plan for the Hub at this stage.
- Least privilege for any credential; LGPD transparency in `/privacy` for any new processor
  or data flow.
- Reversible: the choice must be undoable from the dashboards in minutes.

## Options considered

### A. Vercel only, DNS only (today's setup)

Keep the setup and read whatever Vercel exposes.

- Good: no change to the edge; Vercel's challenge, Bot Protection and IP-keyed rate limiting
  keep working.
- Bad: on Hobby there is no API and no drain for firewall events, and runtime logs live about
  an hour. There is nothing to aggregate, so the observatory cannot exist until the plan
  changes (Pro, with drains) or another source appears.

### B. Cloudflare in proxy mode in front of Vercel

Turn on the orange cloud for the apex and `www`. The Hub reads Cloudflare's GraphQL
Analytics API at build or revalidation time with a read-only token and publishes aggregates.

- Good: rich, free data with 31 days of history: blocked and challenged requests, probed
  paths, countries, ASNs, bot signals. The Free managed ruleset and Bot Fight Mode add a WAF
  in front of the app.
- Bad: the configuration Vercel advises against. Vercel would key rate limiting on
  Cloudflare's addresses, so the ADR-0007 rule must move to Cloudflare, where the Free plan
  only counts over 10 seconds. Vercel's Bot Protection ruleset stops working. The visitor's
  country in the anonymous contact events (`x-vercel-ip-country`) becomes the Cloudflare
  edge's country unless it is read from `CF-IPCountry`. The origin stays reachable directly
  (the `vercel.app` host, or Vercel's addresses with a forged `Host`), which bypasses the
  Cloudflare WAF unless Vercel can be told to accept only Cloudflare's ranges. Two CDNs in a
  row make cache and certificate problems harder to diagnose. Cloudflare becomes a processor
  of every request, which `/privacy` and the threat model must say.

### C. DNS only, with first-party events from the Hub

Keep the edge as it is. The Hub emits its own anonymous, versioned events for what it can see
itself: canary routes for common scanner targets (`/wp-admin`, `/.env`, `/.git/config` and
similar, answered with a plain 404), contact outcomes (`hub.contact.v1`, already emitted) and
CSP reports (`hub.csp.v1`, already emitted). The events go to the Platform's ingestion API
once it exists; the public page reads tier C aggregates from there.

- Good: no change to the edge, no conflict with Vercel's guidance, and the data model is
  the one the ecosystem plan already describes. Every field is under the Hub's control and
  already designed to be anonymous.
- Bad: nothing to show until the Platform's ingestion and storage exist; the Hub sees only
  what reaches the app, not what Vercel blocks before it. Until then the events live in
  runtime logs for about an hour.

## Decision

**Option C as the direction, with the canary routes shipped now, and Option B
rejected for this site while it runs on Vercel Hobby.**

Reasons:

1. **Defence first.** Option B trades working protections (Vercel's challenge, Bot
   Protection, a 60-second rate-limit window keyed on the real IP) for visibility, and opens
   an origin bypass that the Hobby plan may not be able to close. An observatory that makes
   the site it watches weaker is the wrong proof for an AppSec portfolio.
2. **It matches the ecosystem plan.** The roadmap already moves collection and storage to
   the Platform and makes the Hub an emitter. Option C builds the Hub's half of that now, with
   nothing thrown away later.
3. **It is honest about the plan.** Without a paid plan there is no programmatic Vercel source
   (Option A), so the v0 page "from the Vercel and Cloudflare APIs" is dropped instead of
   faked.

What ships under this decision, each in its own pull request:

- Canary routes in the Hub, with a `hub.probe.v1` event (path category, client class, country,
  minute; no IP, no raw User-Agent, no query string), `/privacy` updated in the same PR.
- The event emitter to the Platform, once the ecosystem ADR in `felpsxp-architecture` defines
  the ingestion API, its scoped key and the HMAC signature.
- The public `/security/observatory` page once there are tier C aggregates to read.

**Revisit** if the Hub moves to Vercel Pro (log drains carry firewall events) or off Vercel,
or if Vercel's guidance on proxies changes. Option B can then be reconsidered with a spike
that proves the origin can be locked to Cloudflare.

## Consequences

- The roadmap's "observatory v0, no database" item is replaced by the canary routes and the
  events above; the public page moves after the Platform's ingestion.
- The Cloudflare records stay DNS only, and the contact form keeps its Vercel rate-limit rule
  (ADR-0007), which still has to be published.
- No new secret now. The emitter's key comes with the ecosystem ADR and goes in
  `.env.example` without a value in that pull request.
- The threat model gains the canary routes and the emitter as new data flows in the pull
  requests that add them.

## Sources

- Vercel, [Reverse proxy servers and Vercel](https://vercel.com/docs/security/reverse-proxy)
  and [Cloudflare with Vercel](https://vercel.com/kb/guide/cloudflare-with-vercel).
- Vercel, [Drains](https://vercel.com/docs/drains) (Pro and Enterprise) and
  [WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
- Cloudflare, [30 days of analytics on every plan](https://developers.cloudflare.com/changelog/post/2026-10-02-30-days-analytics-on-every-plan/),
  [Querying firewall events](https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-firewall-events/)
  and [Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/).
