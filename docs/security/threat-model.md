# Threat model: felpsxp-hub

- **Method:** STRIDE, per component and data flow
- **Version:** 1.1, 2026-11-12 (contact form implemented)
- **Owner:** Felipe Sousa (@FelpsSousa)
- **Review:** whenever a new data flow, third party or secret is introduced; next planned
  review at the go-live of `felpsxp.com` and again when the observatory (roadmap Block 5)
  starts emitting events.

This document describes what could go wrong with the Hub, what already prevents it, what is
planned and what is accepted as residual risk. Every mitigation points to the code, pull
request or ADR that implements it, so each claim can be checked.

## Scope

The Hub is a personal portfolio served at `felpsxp.com`: static pages in Portuguese and
English, one contact form, no database and no authentication (ADR-0003). The contact form
(ADR-0007, #32) is the only place where the Hub accepts input from strangers.

Out of scope: the private repositories of the FelpsXP ecosystem, the Platform's observatory
(it gets its own threat model), and the security of third parties themselves (GitHub,
Vercel, Cloudflare, Resend), whose responsibility is limited here to how the Hub uses them.

## System overview

```text
                           ┌─────────────────────── Trust boundary: the internet ──────────────────────┐
  Visitor's browser ──HTTPS──▶ Cloudflare DNS ──▶ Vercel edge (proxy.ts: locale, headers)
        │                                             │
        │                                             ├──▶ CDN: prerendered pages, share images,
        │                                             │        sitemap, robots
        │                                             │
        └──(contact form)─────────POST──────────────┴──▶ Vercel Function (Server Action)
                                                               │  1. Turnstile siteverify ──▶ Cloudflare
                                                               │  2. honeypot, Zod validation
                                                               │  3. plain-text e-mail ─────▶ Resend ──▶ Felipe's mailbox
                                                               └─ security event (no personal data)
                           └──────────────────────────────────────────────────────────────────────────┘

  Build and deploy:  Felipe ──▶ GitHub (protected main, PRs, CI: gitleaks, lint, types,
                     tests, build, CodeQL) ──▶ Vercel build ──▶ CDN
```

## Assets

| Asset | Why it matters |
| --- | --- |
| Integrity of the site and its content | It is Felipe's professional reputation; a defaced or altered portfolio costs job opportunities |
| Domain, DNS and e-mail authentication | Whoever controls them can impersonate Felipe, on the web and by e-mail |
| Build and deploy pipeline | Code that reaches `main` reaches production |
| Secrets (Resend API key, Turnstile secret) | Abuse sends e-mail as `felpsxp.com` or bypasses the bot check |
| Contact messages in transit | Personal data of the sender (name, e-mail, text) under LGPD |
| Felipe's private mailbox address | Kept out of the repository and the page |
| Availability and the Resend quota | An unusable form or an exhausted quota loses real messages |

## Threats and mitigations

Status: **Implemented** (with a reference), **Planned** (with the roadmap block or ADR), or
**Owner** (an action outside the repository, listed at the end).

### Spoofing

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| S1 | Domain or DNS hijack sends visitors to a fake site | HSTS for two years with subdomains (#28); Cloudflare account with two-factor authentication and registrar lock | Implemented (HSTS) · Owner |
| S2 | E-mail sent as `@felpsxp.com` by someone else | SPF and DKIM for Resend, DMARC moving from `quarantine` to `reject` | Planned (contact setup) · Owner |
| S3 | Bots submit the contact form as if they were people | Turnstile verified server-side with the expected hostname; honeypot (#32) | Implemented |

### Tampering

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| T1 | A malicious or careless change reaches production | `main` protected: pull requests only, linear history, required checks (gitleaks, pre-commit, Conventional Commits) | Implemented |
| T2 | A compromised npm package enters the build | Lockfile with `--frozen-lockfile` in CI; Dependabot; new dependencies only at a release a few weeks old (#19); CodeQL (#30) | Implemented |
| T3 | A compromised or abused GitHub Action | Actions pinned by commit SHA; least-privilege `permissions`; `pull_request_target` never checks out PR code; CodeQL analyses the workflows (#30); a weekly OpenSSF Scorecard run grades these practices and publishes only public repository metadata to the Scorecard API, with no secret involved | Implemented |
| T4 | Content files carry a dangerous link or markup | Zod rejects any link that is not HTTPS or same-origin, including `javascript:` and `data:` (#19); JSON-LD escapes `<` (#24) | Implemented |
| T5 | Commits impersonate Felipe in the history | Signed commits and vigilant mode on GitHub | Owner |

### Repudiation

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| R1 | A change cannot be traced to a decision | Squash-merged PRs with descriptions, ADRs for decisions, Vercel deployment history | Implemented |
| R2 | Abuse of the contact form leaves no trace | An anonymous `hub.contact.v1` event per submission: outcome, reason, country, client class, minute (#32) | Implemented |

### Information disclosure

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| I1 | A secret is committed | gitleaks as a pre-commit hook and over the full history in CI; secrets only in Vercel environment variables; `.env*` ignored | Implemented |
| I2 | Private details (LAN addresses, private repository paths, family or financial data) reach public content | Porting checklist with an IP grep (`docs/planning/roadmap.md`); content published from FelpsXP Logs only after a manual gate | Implemented (process) |
| I3 | Felipe's private mailbox becomes public | Delivered to a server-only `CONTACT_TO_EMAIL`; the page shows `contact@felpsxp.com` (#32) | Implemented |
| I4 | The stack is fingerprinted, or source code is exposed | `poweredByHeader: false`; production source maps off (Next.js default) | Implemented |
| I5 | Visitor data leaks | Nothing is stored: static pages, no database; the only cookie holds the language (`Secure`, `SameSite=Lax`, session, #22); the theme and the choice to turn off single-key shortcuts live in `localStorage` (#23) and never reach the server; contact messages are not stored and events carry no personal data, which a test asserts (#32) | Implemented |
| I6 | Full URLs leak to other sites through the referrer | `Referrer-Policy: strict-origin-when-cross-origin` | Implemented |

### Denial of service

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| D1 | Traffic floods take the site down | Prerendered pages served from Vercel's CDN; no per-request computation for pages | Implemented |
| D2 | The contact form is abused to burn the Resend quota or the domain's reputation | Turnstile, honeypot and a 64 KB body limit (#32); edge rate-limit rule; Resend's quota caps the worst case | Implemented · Planned (rate limit, go-live) |
| D3 | The Server Actions denial-of-service advisory | Next.js pinned at 16.4.5, above the patched 16.4.1 (ADR-0003) | Implemented |

### Elevation of privilege

| ID | Threat | Mitigation | Status |
| --- | --- | --- | --- |
| E1 | Cross-site scripting | React escapes by default; only two raw HTML insertions, both controlled (a constant theme script and escaped JSON-LD); CSP with `default-src 'self'`, `object-src 'none'`, `base-uri 'self'` | Implemented |
| E2 | Clickjacking | `frame-ancestors 'none'` and `X-Frame-Options: DENY` | Implemented |
| E3 | Cross-site request forgery on the contact form | Server Actions accept only `POST` and reject a mismatched `Origin` (#32) | Implemented |
| E4 | Takeover of an account that controls the Hub (GitHub, Vercel, Cloudflare, Resend, registrar) | Two-factor authentication with a hardware key or passkey on every one; API keys with minimal scope (Resend: sending only, one domain) | Owner |
| E5 | Abuse of powerful browser features from the page or an embed | `Permissions-Policy` switching off camera, microphone, geolocation, payment, USB and others; `Cross-Origin-Opener-Policy: same-origin` (#28) | Implemented |

## Residual risks, accepted for now

| Risk | Why it is accepted | Plan |
| --- | --- | --- |
| `'unsafe-inline'` in `script-src` | Required by Next.js's inline hydration payload and the theme script | Allow the theme script by SHA-256 hash, test in report-only mode first (roadmap Block 5) |
| No required review before merge | Solo maintainer; GitHub does not allow approving one's own pull request | Required checks, small PRs and CodeQL compensate; enable reviews when there is a second maintainer |
| Turnstile loads a third-party script | The cost of abuse without a bot check is higher | Limited to `https://challenges.cloudflare.com` in the CSP |
| The 404 page renders on the client | A Next.js limitation with a root layout under `[locale]`; no security impact, the status is a real 404 with `noindex` | Revisit when `global-not-found` is stable |

## Owner checklist (outside the repository)

- [ ] Two-factor authentication with a hardware key or passkey on GitHub, Vercel,
      Cloudflare, Resend and the domain registrar.
- [ ] Registrar lock on `felpsxp.com`.
- [ ] SPF and DKIM from Resend, then DMARC (`p=quarantine`, later `p=reject`).
- [ ] Resend API key restricted to sending, for `felpsxp.com` only.
- [ ] Signed commits and vigilant mode on GitHub.
- [ ] Review who has access to the Vercel and Cloudflare accounts.

## How this model is verified

- **Continuously:** CI (gitleaks, tests that assert every security header and CSP
  directive, CodeQL) on every pull request, and a weekly OpenSSF Scorecard report of the
  repository's supply chain practices.
- **Before go-live:** an external header check of the production domain.
- **After go-live:** a light black-box pentest of the production site, following this
  document, published as a write-up (roadmap Block 3).
