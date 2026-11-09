# ADR-0002: Start felpsxp-hub from scratch, without extracting hub-web's history

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Scope:** felpsxp-hub only

## Context

The Hub currently exists as `apps/hub-web` inside the private `felpsxp-platform`
monorepo, coupled at build time to two workspace packages: `@felpsxp/platform-auth`
and `@felpsxp/platform-db`. The Hub blueprint calls for an isolated, dedicated
Supabase project for `felpsxp-hub`, which is incompatible with those shared
packages as they exist today.

`felpsxp-hub` is also meant to be public portfolio material: its own commit
history, from day one, is part of the evidence a reviewer sees (small reviewed
PRs, ADRs, CI), not just the resulting code.

## Decision drivers

- `platform-auth`/`platform-db` force a data-layer rewrite regardless of how the
  repository is created.
- A full git-history scan for leaked secrets (gitleaks) is required before any
  history extraction, per the blueprint's own governance rules.
- `felpsxp-template`'s conventions (pre-commit hooks, CI, `SECURITY.md`, ADRs)
  should apply from the first commit, not be retrofitted onto existing history.

## Considered options

1. Extract `hub-web`'s git history (`git filter-repo` / subtree split) and adapt
   the code on top of it.
2. Start `felpsxp-hub` from scratch on `felpsxp-template`, porting content (not
   history) from the current `hub-web`.

## Decision

Option 2. The coupling to `platform-auth`/`platform-db` already forces a
rewrite of the data layer, which removes the main advantage of extracting
history. Starting fresh also removes the need to scrub secrets from an old
history, and lets `felpsxp-template`'s conventions land native from the first
commit.

## Consequences

**Positive**

- No need to scrub or audit `hub-web`'s git history for secrets before
  publishing a public repository.
- `felpsxp-template`'s hygiene, CI and ADR conventions apply from commit one.
- The public history of `felpsxp-hub`, from today forward, becomes direct
  evidence of engineering practice (ADRs, small reviewed PRs, CI), which is
  what a reviewer actually checks.

**Negative**

- The `hub-web` commit log showing work over time is not carried over into
  this repository. It remains preserved, privately, in `felpsxp-platform`.

**Neutral**

- Content (profile, projects, writing, i18n, design system) is ported as new
  files, reviewed page by page before commit, rather than migrated as-is.

## References

- `felpsxp-platform` blueprint: `docs/planning/hub-blueprint-v1.4-2026-11-07.md`
  (sections 5, 6, 6.1-6.3, 13)
- `felpsxp-platform` roteiro: `docs/planning/hub-extraction-roteiro.md`
