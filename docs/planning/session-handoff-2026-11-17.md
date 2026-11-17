# Session handoff: felpsxp-hub, 2026-11-17

Context for a Claude Code session opened directly in this repository (`C:/my codes/felpsxp-hub`)
to take the Hub to go-live and beyond. It complements the living plan in
[`roadmap.md`](roadmap.md), which stays the place where items are ticked; this document says
**in which order** to work, **how to know each task is done**, and **which rules apply** to
the content. The bootstrap handoff of 2026-11-10 is kept only as history.

## 1. Start every session like this

1. Read `CLAUDE.md`, then `docs/planning/roadmap.md`, then this file.
2. Skim the accepted ADRs in `docs/adr/` (0003 stack and scope, 0004 content and MDX, 0005
   design tokens, 0006 testing, 0007 contact form, 0008 releases, 0009 CSP nonces).
3. `git pull`, `gh pr list`, and check that `main` is green. Merge nothing yourself: Felipe
   validates each pull request on its Vercel preview and merges it.
4. Pick the first open task of the current block below, one task per pull request.
5. At the end, tick the roadmap item in the same pull request, and say whether the registry
   record `FXP-003` needs an update (status, scope or stack), because Claude Code cannot
   update the registry.

## 2. Why the order matters

Felipe is applying for pleno fullstack roles (frontend focus, AppSec and IAM as the
differentiator) starting this week. Recruiters open the profile link, so `felpsxp.com`
must serve this repository, with pages that hold up to a careful read: a CV page, a
career timeline and an about page, all backed by facts. Until 22 November Felipe is also
preparing for an entrance exam, so sessions are short: prefer small, finished pull requests
over long branches.

## 3. Where things stand (2026-11-17)

- Version `0.18.4` (release-please, ADR-0008). Production runs at
  `felpsxp-hub-two.vercel.app`; `felpsxp.com` does **not** point here yet.
- Done: site shell, `pt` and `en`, light and dark, SEO base and JSON-LD, static rendering,
  `/projects` with filters, `/contact` (Turnstile, honeypot, Zod, Resend), `/privacy`,
  `/security` and `security.txt`, `/accessibility`, `/changelog`, site search, CodeQL,
  Scorecard, Playwright with axe, Lighthouse baseline, STRIDE threat model, strict CSP in
  report-only mode with a reporting endpoint.
- The old Vercel project that served the previous Hub from `felpsxp-platform` had its Git
  connection removed on 2026-11-17, so it no longer builds previews for that repository.
  It is kept, unchanged, as the rollback path until the domain moves (Block H3).
- Open roadmap items that block go-live: content review, `/about`, `/experience`, `/cv`,
  highlight stats, server-rendered 404, edge rate limit for the contact form, domain cutover,
  release `1.0.0`.

## 4. Content rules (read before touching any claim)

This repository is **public**. Felipe's facts live in the private repository `felpsxp-logs`
(local clone at `C:/my codes/felpsxp-logs`), in `career/facts/*.yaml`, each fact with an id, a
`status` and a `classification`.

- Use a fact only when its `status` is `verified`. Prefer `classification: public`; a fact
  marked `shareable-after-review` needs Felipe's explicit yes for that wording before it goes
  into a page; a `private` fact never goes into this repository, not even paraphrased.
- Every claim on a page should map to a fact id. Keep the mapping in the pull request
  description (claim, fact id), not in the code, because fact ids describe private material.
- Former employer: Felipe's contract has a confidentiality clause that is mainly about source
  code. Describe the products only with what their public sites show (product names, public
  module and solution names, the audience) and Felipe's role. No internal mechanics (how
  tenants are resolved, which headers or cookies, internal tools), no screenshots of logged-in
  areas, no metrics that are not public.
- Private repositories (Platform, Finance, Logs, Sentinel) are described as case studies;
  shareable detail goes to the public `felpsxp-architecture` repository. Screenshots of private
  apps use fictitious data only.
- Run the porting checklist at the end of `roadmap.md` on anything that comes from elsewhere
  (no LAN addresses, no personal contact data, no em or en dashes, no private paths).
- When a fact you need is missing or not verified, stop and ask Felipe; do not soften an
  unverified claim into a vaguer one.

Facts already verified that this work needs (look them up by id in `felpsxp-logs`):

| Need | Fact ids |
| --- | --- |
| The three home highlights, as they are today | `FXP-003.yaml#hub-home-stats` (public) |
| Period and role at the former employer | `algoricca.yaml#algoricca-period-and-contract`, `#algoricca-role-title` |
| Frontend ownership and technical reference | `algoricca.yaml#algoricca-frontend-ownership`, `#algoricca-team-reference` (shareable after review) |
| Public module and solution names of both products | `algoricca.yaml#algoricca-public-modules` (public) |
| Finance in production, multi-tenant with RLS | `FXP-030.yaml#finance-live` |
| Security review of the Platform | `FXP-020.yaml#security-review-findings` |
| Education, research and teaching | `unb.yaml`, `profile.yaml#clara-research`, `profile.yaml#access-control-interest-2017` |

The CV variants in `felpsxp-logs/career/cv/variants/` are written only with verified facts and
are the best summary of what can be said; the master variant is the long form.

## 5. Task blocks, in order

Each task is one pull request unless it says otherwise. "Done when" is the acceptance test.

### H1. Content review (GL)

1. **Claim inventory.** List every claim, number and link in `src/content/` (profile,
   projects, legal, site) and in `messages/*.json`, with the fact id that supports it or
   "none". Deliver as the description of a first pull request that fixes the easy ones.
   *Done when* every claim has a fact or a decision from Felipe (keep, rewrite, remove).
2. **Profile.** Remove or fix what is out of date (for instance the ADR count that points to a
   private repository). Align the summary with the CV master variant.
   *Done when* `profile.ts` matches the verified facts in both languages.
3. **Highlight stats.** The three current highlights are verified (`hub-home-stats`); tick the
   roadmap item. A fourth one is optional and Felipe's call.
4. **Former employer case pages** (`candidattus.ts`, `connexicco.ts`). Add the public module
   and solution names, the audience, and Felipe's role in public wording; review `status`
   (`archived`) and `featured`.
   *Done when* each page reads as a case study a recruiter can verify on the product site.
5. **Other projects.** Check each remaining entry (status, visibility, links, dates) against
   the facts; remove what cannot be proven.

### H2. Pages recruiters read (GL)

1. **ADR-0010, the CV page.** Decide the source and the PDF before building: typed content in
   `src/content/cv/` (Zod-validated, `pt` and `en`) rendered as `/cv`, with a print stylesheet;
   the downloadable PDF either printed from the page or the one compiled in `felpsxp-logs`
   copied into `public/` on each release. Propose, wait for Felipe, then implement.
2. **`/cv`.** One page per locale, the print stylesheet with correct page breaks, a download
   link, JSON-LD where it helps. *Done when* printing from the browser gives a clean one or two
   page document and axe passes.
3. **`/experience`.** Career timeline (work, research, teaching, own projects) and a skill tree
   grouped by area, from the same CV data, so nothing is typed twice.
4. **`/about`.** Short bio, current focus (fullstack with a frontend focus, AppSec and IAM), how
   Felipe works (ADRs, small reviewed pull requests, tests, AI-assisted with written rules, as
   `AI.md` states), and links.
5. Navigation, sitemap, search index and the home call to action include the new pages.

### H3. Go-live (GL)

1. **Server-rendered 404**, or a recorded decision to keep the client one (the roadmap item
   explains the Next.js limitation).
2. **Edge rate limit for the contact form** (ADR-0007): a Vercel Firewall rule on `POST`
   requests to the contact route of both locales (the Server Action posts to the page path),
   a small number per minute per IP, then deny. Check what the Vercel plan allows; if the
   rule is not available, write down the fallback (Cloudflare in front of the domain, or an
   in-app limiter) as an amendment to ADR-0007 before choosing.
3. **Domain cutover**, done by Felipe in the dashboards, with Claude writing the exact steps in
   the pull request that prepares it:
   - Vercel, old project: Settings, Domains, remove `felpsxp.com` and `www.felpsxp.com`.
   - Vercel, this project: Settings, Domains, add both; set `www` to redirect to the apex
     (or the reverse, as `metadataBase` expects).
   - Cloudflare DNS: point the apex and `www` at the values Vercel shows for this project,
     **DNS only** (grey cloud), as Vercel recommends; leave the MX and TXT records of Email
     Routing untouched.
   - Verify: both hosts serve this project over HTTPS, `security.txt` is reachable, the
     security headers are present, the contact form delivers, and the e-mail addresses still
     receive mail.
4. **Release `1.0.0`** through release-please once the domain serves this repository.
5. **Light pentest** of the live site (STRIDE, black box, own site only), written up later as
   the first post of Block 4.
6. After a week stable, Block 7: delete the old Vercel project and decommission `hub-web`.

### H4. Right after go-live

- Felipe points the LinkedIn and GitHub profile links back to `felpsxp.com` and features the
  Hub on LinkedIn.
- README screenshots of the recruiter pages (Block 6).
- Enforce the strict CSP once production shows a clean report period (ADR-0009).

### H5. Projects as proof (Block 3b)

One project per pull request, in this order: the shared building blocks (gallery with captions
and alt text, "what I did" list, stack chips), the two former employer products, Finance (demo
with fictitious seeded data), Platform (security review and observability), Logs (fictitious
data), then earlier work. Every screenshot is of a public page or of fictitious data.

### H6. Writing, observatory, polish and closure

Blocks 4 to 7 of the roadmap, as written there.

## 6. Working agreements

- Branch `<type>/<short-kebab>` from `main`; Conventional Commits; squash merge by Felipe.
- No AI attribution in commits or pull requests (`AI.md` is the single disclosure).
- No em or en dashes anywhere; a hook blocks them in Markdown.
- Every new page: both locales, metadata, sitemap entry, axe-clean in light and dark, desktop
  and mobile; the end-to-end suite fails on CSP violations, so no inline scripts.
- Any new data flow, third party or secret updates `docs/security/threat-model.md` and, when
  it touches visitors, `/privacy`, in the same pull request.
- When in doubt about a claim or a decision that is costly to reverse, ask Felipe.

## 7. Prompt to open the session

> Retomando o felpsxp-hub para o go-live. Leia `CLAUDE.md`, `docs/planning/roadmap.md` e
> `docs/planning/session-handoff-2026-11-17.md`, nessa ordem, e siga a ordem dos blocos H1 a H6.
> Comece pelo H1.1 (inventário de afirmações). Um PR por tarefa; eu valido no preview e faço o
> merge.
