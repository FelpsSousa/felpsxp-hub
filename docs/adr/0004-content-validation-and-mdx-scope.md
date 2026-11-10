# ADR-0004: Content validation with Zod, MDX scoped to /writing

- **Status:** Accepted
- **Date:** 2026-11-10
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Scope:** felpsxp-hub only

## Context

ADR-0003 states that content is "typed TypeScript/MDX validated with Zod,
matching hub-web's content layer." While porting `profile` (#7) and
`projects` (#8) from hub-web, that line turned out to be inaccurate:
hub-web's real content layer is plain typed TypeScript, with no Zod
validation and no MDX anywhere in `profile` or `projects`. Both PRs were
shipped following the real pattern, so no code is wrong, only that one
ADR-0003 sentence.

Per this repo's own rule, an accepted ADR is not edited after the fact; a
correction is recorded in a new ADR instead. This is that correction, and
it also settles a question ADR-0003 left implicit: what Zod and MDX are
each actually for in this codebase, since they answer different problems
and treating them as one bundled choice ("content as typed
TypeScript/MDX validated with Zod") was itself part of the inaccuracy.

## Decision drivers

- `profile` and `projects` are structured records (fixed shape, many
  fields, several of which drive UI logic like badges and filters).
  Catching a malformed record at build time, instead of rendering
  `undefined` in production, is worth a small amount of ceremony.
- The upcoming writing section (Block 3, including the AppSec posts) is
  long-form prose with code blocks, not structured records. Validating its
  shape isn't the problem there; authoring rich text with embedded
  components is.
- Getting felpsxp.com live stays the priority; this ADR should not block
  Block 3, only make the next content PRs in that block consistent.

## Decision

**Structured content (`profile`, `projects`, and future structured content
such as `siteSettings` or `experience`) stays plain typed TypeScript, the
real hub-web pattern already shipped in #7 and #8.** A Zod schema is added
per content type, matching `src/content/types.ts`, and each record is
parsed through it at build time (in `src/lib/content.ts`, alongside the
existing accessors). This is a validation layer only: authors still write
plain TypeScript objects; a shape mismatch fails the build with a clear
error instead of surfacing at runtime.

**MDX is reserved for `/writing` only**, once that content type is built in
Block 3. It is not used for `profile` or `projects`. Shiki (code
highlighting) and `next/og` (OG images) become relevant at that point, not
before.

## Considered options

1. Keep ADR-0003's wording as the target and retrofit Zod and MDX onto
   `profile`/`projects` to match it.
2. Correct the record: plain typed TypeScript stays for structured content,
   Zod is added there as validation only, MDX is scoped to `/writing`.

Option 2 chosen. Option 1 would mean reworking two already-shipped,
working content slices to match a line that was wrong in the first place,
for no benefit to the public pages.

## Consequences

**Positive**

- This ADR now matches what is actually implemented in `main` (#7, #8).
- Zod gives early, clear failures on malformed structured content at near
  zero authoring cost.
- MDX's scope is decided before the first writing content PR, instead of
  being discovered mid-slice the way the ADR-0003 inaccuracy was.

**Negative**

- The codebase ends up with two content mechanisms (typed TS + Zod for
  structured content, MDX for prose) instead of one. Accepted as a
  deliberate split by use case, not an accident.

**Neutral**

- Adding the Zod schemas to `profile`/`projects` is its own follow-up PR,
  per "one thing at a time"; this ADR only records the decision.

## References

- ADR-0003: v1 frontend stack and scope (the corrected line)
- PR #7: port the profile content
- PR #8: port the projects content
