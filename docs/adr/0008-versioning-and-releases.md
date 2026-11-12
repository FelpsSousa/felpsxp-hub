# ADR-0008: Semantic versioning, automated releases and a visible version

- **Status:** Accepted
- **Date:** 2026-11-12
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (v1 scope), `docs/planning/roadmap.md` (Block 3, go-live)

## Context

Felipe wants every FelpsXP app to show which version is running, and to apply the same
convention across the ecosystem through FelpsXP Logs. Today `package.json` says `0.0.0`, there
are no tags, no releases and no changelog, so neither a visitor nor Felipe can tell which code
is live. The repository already enforces Conventional Commits on every commit and pull request
title, which is exactly the input that release tooling needs.

## Decision drivers

- One number that means something: semantic versioning, derived from the commits rather than
  chosen by hand.
- Releasing stays a human decision, like every other change to `main`.
- A visitor can see the version and the exact commit that is running.
- The convention works the same way in every FelpsXP repository.

## Options considered

### Option A: Manual version bumps

- ✅ No tooling.
- ❌ Forgotten bumps, inconsistent numbers, a changelog nobody keeps.

### Option B: semantic-release

- ✅ Fully automatic from Conventional Commits.
- ❌ Releases on every merge with no review step; built around publishing packages.

### Option C: Changesets

- ✅ Precise control, strong in monorepos.
- ❌ An extra file per change, duplicating what the Conventional Commit already says.

### Option D: release-please

- ✅ Reads the Conventional Commits on `main` and keeps one **release pull request** open with
  the next version and a generated `CHANGELOG.md`; merging it creates the tag and the GitHub
  release.
- ✅ The release pull request is the human gate, reviewed like any other change.
- ❌ Pull requests opened with the default `GITHUB_TOKEN` do not trigger other workflows, so
  the release pull request would never get the required checks without a dedicated token.

## Decision

We will use **Option D, release-please**, with these rules:

1. **Semantic versioning** of the application in `package.json`. While below `1.0.0`, a `feat`
   bumps the minor version and a `fix` bumps the patch.
2. The current code becomes **0.9.0**. The go-live of `felpsxp.com` is released as **1.0.0**.
3. **release-please** runs on every push to `main` and maintains the release pull request.
   Merging it creates the tag `vX.Y.Z`, the GitHub release and the changelog entry.
4. The workflow authenticates with a **fine-grained token scoped to this repository only**
   (contents and pull requests: read and write), stored as the `RELEASE_PLEASE_TOKEN` secret,
   so the release pull request runs the required checks like any other. The action is pinned
   by commit SHA, and the workflow keeps `contents: read` as its default permission.
5. **The version is visible** in the site footer: `vX.Y.Z` linking to the GitHub releases, and
   the short commit hash of the deployment (from Vercel's build environment) linking to that
   commit.
6. The same convention is the default for every FelpsXP repository; FelpsXP Logs tracks its
   adoption, and its ecosystem-wide form is recorded in `felpsxp-architecture`.

## Consequences

**Positive**

- Every deployment can be traced from the page to a version, a commit and a changelog entry.
- Version numbers and the changelog cost nothing to maintain, because Conventional Commits are
  already enforced.
- Releases remain reviewed decisions.

**Negative**

- One more secret to manage (`RELEASE_PLEASE_TOKEN`), with a yearly expiry to renew.
- Until the token exists, the release pull request needs a manual close and reopen to run its
  checks.

**Follow-ups**

- [ ] Implement the workflow, the configuration, version `0.9.0` and the footer.
- [ ] Felipe: create the fine-grained token and the `RELEASE_PLEASE_TOKEN` secret.
- [ ] Release `1.0.0` at go-live.
- [ ] Record the convention for the whole ecosystem in `felpsxp-architecture`.
