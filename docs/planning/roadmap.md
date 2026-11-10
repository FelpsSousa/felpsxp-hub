# felpsxp-hub roadmap

Living plan for this repository. It replaces the bootstrap handoff
(`session-handoff-2026-11-10.md`) as the place where work is planned and
tracked. Each item becomes one small PR; Felipe validates it on the Vercel
preview before it is merged and ticked here.

Legend: **GL** marks what is required for the go-live of `felpsxp.com`;
everything else ships afterwards, one PR at a time, with the site already
online.

## Goal

Bring `felpsxp.com` back online quickly as a public, verifiable proof of
work for pleno/senior fullstack roles with an AppSec focus. The repository
itself is part of the proof: clean history, ADRs, tests, CI and visible
security controls.

## Decisions confirmed on 2026-11-10

- Go-live happens before the writing section; posts ship afterwards.
- A new Vercel project is created for this repository. The old `hub-web`
  project stays paused as a rollback path until the domain moves.
- Public contact goes through `contato@felpsxp.com` (and variations) via
  Cloudflare Email Routing; no personal address in code or content.
- The contact form is protected by Cloudflare Turnstile (ADR pending).
- Only projects whose functionality can be proven are listed. Mock
  `example-*` projects are hidden. Private repositories are described as
  case studies, with shareable detail living in the public
  `felpsxp-architecture` repository.
- `/studio`, sign-in, contact persistence and Watchtower are not carried
  over (ADR pending to record the retirement).
- The light/dark toggle is hand-written; no new dependency.
- Analytics is deferred until after the go-live.
- AppSec and ethical hacking become a visible track of the Hub itself (see
  Block 5), always limited to passive observation of Felipe's own
  infrastructure.

## Block 0: Housekeeping

- [x] Plan and scope recorded in this file.
- [ ] Ignore generated `AGENTS.md` and `next-env.d.ts`; run `next typegen`
      before `tsc` so CI keeps type-checking routes.
- [ ] `pre-commit run --all-files` passes on a clean clone.

## Block 1: Foundation

- [ ] Zod schemas for `profile` and `projects`, parsed at build time
      (ADR-0004 follow-up).
- [ ] Test harness: Vitest for content schemas and server logic (ADR for
      the test stack first).
- [ ] Site shell: header, navigation, mobile menu, footer, 404 page.
- [ ] Locale switcher (`pt`/`en`).
- [ ] Manual light/dark toggle on top of the ADR-0005 tokens.
- [ ] SEO base: `metadataBase`, per-page metadata, `sitemap.ts`, Person and
      WebSite JSON-LD, default OG image with `next/og`.
- [ ] New Vercel project wired to this repository, preview per PR.
- [ ] Project content review: hide `example-*`, confirm every remaining
      claim, link or screenshot is verifiable.

## Block 2: Pages recruiters read (GL)

- [ ] `/about`: bio, current focus (fullstack with AppSec/IAM), how Felipe
      works.
- [ ] `/experience`: career timeline and skill tree derived from the CV
      data.
- [ ] `/cv`: full CV in `pt` and `en`, print stylesheet with correct
      pagination, PDF download.
- [ ] ADR: contact form security model (Turnstile, Resend, no
      persistence, rate limiting at the edge).
- [ ] `/contact`: server-side Zod validation, honeypot, timing check,
      Turnstile, delivery through Resend; new env vars in `.env.example`.
- [ ] `/privacy`: what is collected, why, for how long (LGPD).
- [ ] Home: highlight stats, featured projects, closing call to action.

## Block 3: Go-live hardening (GL)

- [ ] `Strict-Transport-Security` header.
- [ ] CodeQL workflow (SAST) in CI.
- [ ] Playwright smoke tests with axe accessibility checks on the main
      pages, running in CI.
- [ ] Lighthouse pass (performance, accessibility, SEO, best practices).
- [ ] `docs/security/threat-model.md`: STRIDE threat model of the Hub.
- [ ] `/security` page and `/.well-known/security.txt`.
- [ ] Cloudflare Email Routing for the `felpsxp.com` addresses.
- [ ] Domain moved to the new Vercel project; DNS cutover in Cloudflare.
- [ ] Post-launch light pentest (STRIDE, black-box, own site only),
      written up as the first new post.

## Block 4: Writing

- [ ] MDX pipeline per ADR-0004: Zod-validated frontmatter, Shiki, one
      file per locale, OG image per post.
- [ ] `/writing` list and `/writing/[slug]` pages.
- [ ] Port the 15 `hub-web` entries with a conversion script, reviewing
      each one (see the porting checklist below). Entries about features
      that no longer exist get a note saying they describe the previous
      version of the Hub.
- [ ] New AppSec posts about this Hub (threat model, contact hardening,
      observatory findings).

## Block 5: Security observatory

The AppSec and ethical hacking track: measure who probes the Hub, from
where, when, and what is attempted, then show how each attempt is handled.
Each item below needs its ADR before code, because it introduces data
collection and, most likely, persistence.

- [ ] ADR: telemetry source. Cloudflare in proxy mode (WAF events, bot
      score, country, ASN) versus Vercel Firewall and logs; Vercel
      recommends DNS-only records in front of its domains, so the trade-off
      has to be weighed explicitly.
- [ ] ADR: storage and privacy. Persistence (Supabase, the ecosystem
      default) with IPs hashed under a rotating salt, a fixed retention
      window, and only aggregates exposed publicly; `/privacy` updated in
      the same PR.
- [ ] Canary routes for common scanner targets (`/wp-admin`, `/.env`,
      `/.git/config`, `/phpmyadmin`, and similar): respond with a plain 404
      and record the hit.
- [ ] CSP violation reporting endpoint (`report-to`), with the policy first
      shipped in report-only mode for any tightening.
- [ ] Public `/security/observatory` page with aggregated charts
      (Recharts): attempts per hour, most probed paths, top countries and
      networks, blocked versus allowed.
- [ ] Spike alerts by e-mail through Resend.
- [ ] Scheduled OWASP ZAP baseline scan (passive DAST) against production
      in GitHub Actions, with results kept as workflow artifacts.

Guardrails: passive observation of Felipe's own infrastructure only; no
active response against any source; nothing published that identifies an
individual.

## Block 6: Polish

- [ ] Domain and difficulty filters on `/projects`.
- [ ] Featured projects and posts driven by site settings.
- [ ] Site search (Ctrl+K) over a static index built at build time.
- [ ] `/ecosystem`: decide whether it ships, given most modules are
      private; if it does, link to `felpsxp-architecture` for detail.
- [ ] `/accessibility` statement.
- [ ] Self-hosted Umami, with the CSP `connect-src` updated.
- [ ] OpenSSF Scorecard workflow and README badge; GitHub Actions pinned by
      commit SHA.
- [ ] README as a showcase: screenshots, stack, decisions, production link.
- [ ] GitHub profile cleanup (outside this repository): archive bootcamp
      and test repositories, pin the strongest public ones.

## Block 7: Closure

- [ ] ADR retiring `/studio` in favour of PR-versioned content.
- [ ] Decommission `hub-web` inside `felpsxp-platform`.
- [ ] Delete the old Vercel project once the new one has been stable.

## Proof matrix

What pleno/senior fullstack and AppSec-leaning job postings commonly ask
for, and where this repository proves it.

| Expectation | Proof in this repository |
| --- | --- |
| Modern TypeScript, React and Next.js | App Router, Server Components, strict TypeScript |
| Automated testing | Vitest unit tests, Playwright end-to-end smoke tests |
| CI/CD | GitHub Actions, preview deploys per PR, protected `main` |
| Code quality and review culture | ESLint, Conventional Commits, small squash-merged PRs |
| Architecture and written communication | ADRs, planning docs, PR descriptions in English |
| Secure coding (OWASP Top 10, ASVS) | CSP and security headers, Zod at boundaries, Turnstile |
| Security tooling (SAST, SCA, secrets) | CodeQL, Dependabot, gitleaks |
| Threat modeling | STRIDE threat model, pentest write-ups |
| Supply chain security | Pinned actions, OpenSSF Scorecard |
| Detection and monitoring | Security observatory, spike alerts, ZAP baseline |
| Accessibility | WCAG 2.2 AA target, axe checks in CI |
| Performance | Lighthouse pass, static rendering where possible |
| Privacy | LGPD-aware data handling, `/privacy`, IP hashing |
| Internationalization | `pt`/`en` routing and content |

## Porting checklist

Applies to anything brought over from `hub-web` in `felpsxp-platform`:

1. No LAN IPs or other network detail; grep for
   `([0-9]{1,3}\.){3}[0-9]{1,3}` before committing.
2. No em or en dashes; rewrite the sentence.
3. No references to private `felpsxp-platform` paths; rewrite them
   self-contained.
4. No personal e-mail, phone number or address.
5. Every claim is verifiable from a public source or clearly framed as a
   case study.
