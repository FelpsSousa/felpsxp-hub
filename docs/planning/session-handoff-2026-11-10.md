# Session handoff — felpsxp-hub, 2026-11-10

Purpose: let a Claude Code session opened directly in this repo
(`C:/my codes/felpsxp-hub`) pick up work with full context, without needing
the `felpsxp-platform` chat or repo anymore for anything related to the hub
itself.

## Why this repo exists

`felpsxp.com` needs to come back online as fast as possible so Felipe can
resume job applications (pleno/senior fullstack, international). The old
`hub-web` app lived inside the private `felpsxp-platform` monorepo, coupled
to `platform-auth`/`platform-db`. Rather than extract that app with its git
history and couplings, `felpsxp-hub` was started fresh from
`FelpsSousa/felpsxp-template` (ADR-0002) and is being rebuilt as its own
public, standalone repo.

## Where things stand right now

- Repo: `github.com/FelpsSousa/felpsxp-hub`, local clone at
  `C:/my codes/felpsxp-hub`.
- `main` is branch-protected: no direct commits, PR + green CI required.
- Merged: ADR-0002 (#3), AI disclosure policy / no attribution footers (#4),
  ADR-0003 stack decision (#5), v1 scaffold (#6), profile content + home
  page in Tailwind (#7).
- Open: **PR #8** — ports all 11 project entries (8 real + 3 disclosed
  fictional examples) plus `lib/skill-taxonomy`, rebuilds `/projects` and
  `/projects/[slug]` in Tailwind. CI green. Merge this one next; nothing
  else is stacked under it anymore since #7 landed.
- Open, unrelated: Dependabot PR bumping GitHub Actions versions — routine,
  merge whenever convenient.
- Dev server: `pnpm dev` runs on `http://localhost:3000`, confirmed working
  on branch `feat/port-projects-content` (home + projects list + project
  detail pages all render).

## Stack (ADR-0003)

Next.js App Router (>=16.4.1, pinned 16.4.5), TypeScript strict, Tailwind
CSS v4, shadcn/ui (not yet initialized — add primitives incrementally per
real page need, not upfront), next-intl (`pt`/`en`, `localePrefix:
'as-needed'`, `pt` default). No database, no auth, no `/studio` in v1.
Contact form will go through Resend directly with no persistence. Supabase
is deferred to its own future ADR once a real feature needs it.

Content is plain typed TypeScript in `src/content/`, matching `hub-web`'s
real pattern — **not** Zod-validated, **not** MDX, despite what ADR-0003's
text says. This was found to be inaccurate after the ADR was already
merged. Per this repo's own rule (never edit an accepted ADR, supersede it
instead), the inaccuracy was left as a flagged, open observation rather
than silently fixed. **Felipe still needs to validate and, if he agrees,
write a short superseding ADR correcting that line.** Everything actually
built follows the real plain-TypeScript pattern, so no code is wrong, only
that one ADR sentence.

## Standing rules for this repo (from `CLAUDE.md`, already in the repo —
read it in full before doing anything else)

- Architecture before code: any costly-to-reverse decision needs an ADR in
  `docs/adr/` before implementation.
- One thing at a time: one PR per page or content type, not bundled.
- English for everything that lands in the repo: code, commits, ADRs, PR
  titles/bodies, docs. Chat with Felipe is in Portuguese.
- No AI attribution anywhere: no `Co-Authored-By: Claude`, no "Generated
  with Claude Code" footers, in commits or PRs.
- No em dashes (–/—) in anything written to the repo — rewrite with a
  comma, colon, semicolon, parentheses, or a new sentence.
- **No real LAN IP or other personal network detail may ever reach this
  public repo.** Grep for IP patterns (`([0-9]{1,3}\.){3}[0-9]{1,3}`) on
  anything ported from `platform` runbooks, tests, or content before
  committing, in addition to the `gitleaks` pre-commit hook.
- When porting any content from `hub-web` in `felpsxp-platform`: check for
  (1) LAN IPs, (2) em dashes, (3) source comments referencing
  `platform`-only private doc paths (rewrite those self-contained instead
  of linking to something unreachable in a public repo).

## Remaining roadmap

**Block 3 (in progress)** — write the actual content: bio/experience copy,
the AppSec posts, remaining i18n messages. One PR per page or content
type. Once there's real content and `siteSettings`, revisit the deferred
items below.

**Deferred from the projects-content slice (not urgent):**
- Domain/difficulty filters on `/projects`.
- The XP-derived "related decisions" count.
- `getFeaturedProjects`.

**Block 4** — decide whether to keep `/studio` (admin panel) or retire it
in favor of PR-versioned content. Does not block going live.

**Block 5** — confirm `init-template.sh` already wired pre-commit, local
`gitleaks`, conventional-pre-commit, CI workflow; run
`pre-commit run --all-files` once before the first content PR if not
already done.

**Block 6** — deploy: Vercel + Cloudflare, new environment variables, own
Umami instance, DNS cutover for `felpsxp.com`.

**Deferred, not forgotten:**
- Full data layer (own Supabase) as a fast-follow once a real feature
  needs persistence — v1 ships with no database.
- Decommissioning `hub-web` inside `felpsxp-platform` — no urgency, do
  this last.

## Cross-repo note (informational only, does not block this repo)

A separate, parallel Claude Code session has been running a security
remediation directly on `felpsxp-platform` (`pnpm audit` findings, Next.js
upgrade in `apps/hub-web` and `apps/sentinel-web`). `felpsxp-hub` already
pins its own independently-patched Next.js version from Block 2, so that
work does not block anything here. No further tracking of that effort is
needed from inside this repo.

## Full history and reasoning

The complete decision trail (why fresh start over extraction, why
Tailwind/shadcn over porting the old CSS, every fix applied while porting
content, every CI issue hit and resolved) lives in
`felpsxp-platform`'s `docs/planning/hub-extraction-roteiro.md`. That file
stays in `platform` as the historical record of the bootstrap phase; it
does not need to be kept in sync going forward once this handoff doc is in
place. From here on, planning for this repo's own work should live in
`felpsxp-hub`'s own `docs/planning/` instead.
