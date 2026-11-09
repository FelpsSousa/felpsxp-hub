# ADR-0003: v1 frontend stack and scope

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Scope:** felpsxp-hub only

## Context

ADR-0002 decided to start felpsxp-hub from scratch instead of extracting
hub-web's history. This ADR fixes what that fresh start actually builds for
v1, since CLAUDE.md requires an architecture decision before code for
anything costly to reverse: framework and major dependencies, and how much
data layer v1 needs.

Two points were open when Block 2 started:

1. The current hub-web uses hand-rolled CSS with design tokens, not Tailwind
   or shadcn/ui, even though the ecosystem's default frontend stack
   (felpsxp-hub's own CLAUDE.md, "Default stack") already names Tailwind.
2. hub-web depends on `@felpsxp/platform-auth` and `@felpsxp/platform-db` at
   build time. felpsxp-hub needs its own answer, and the fastest path to a
   live site does not require a database at all: every v1 page
   (home, about, experience, projects, security, writing, ecosystem, contact,
   cv) is static, typed content; nothing in that list requires persistence.

## Decision drivers

- Felipe wants full control and fast iteration on the frontend when editing
  or testing a change, with low friction to find "what is what" in the
  codebase.
- felpsxp-hub is also a skills demonstration; the stack should show current,
  market-relevant practice, not just whatever ships fastest.
- Getting felpsxp.com live again is the near-term priority; nothing that
  isn't required for the public pages should block that.

## Decision

**Frontend:** Next.js (App Router), latest patched release (>= 16.4.1, the
version that fixes the Server Actions DoS advisory currently open on
`platform`'s `hub-web`), TypeScript strict, Tailwind CSS, shadcn/ui for
primitives. The current hub-web design system (hand-rolled CSS tokens) is
**not ported**; the UI is rebuilt in Tailwind from the start. `next-intl` for
`pt`/`en` routing, matching hub-web's locale-segment pattern. Content as
typed TypeScript/MDX validated with Zod, matching hub-web's content layer.
Shiki for code highlighting in MDX, `next/og` for OG images, consistent with
the blueprint.

**Data layer, v1 scope:** no database and no auth in v1. The contact form
sends through Resend directly, with no persistence. `/studio` (the admin
panel) is out of v1 scope entirely, pending the separate decision already
tracked in felpsxp-platform's `docs/planning/hub-extraction-roteiro.md`
(Block 4). A dedicated Supabase project, matching the ecosystem's default
data stack, is deferred to its own future ADR once a real feature needs
persistence (contact history, page views, reactions, newsletter).

## Considered options

For the data layer:

1. Stand up Supabase and a replacement for `platform-auth`/`platform-db`
   before shipping any page.
2. Ship v1 with no database at all, since no public page actually needs one.

Option 2 chosen: it removes the biggest remaining blocker to going live,
without closing off option 1 later.

## Consequences

**Positive**

- No infrastructure (Supabase project, auth, schema) blocks getting
  felpsxp.com live.
- The stack matches current market practice (Next.js, TypeScript, Tailwind,
  shadcn/ui) and is a direct, current skills demonstration.
- Content and i18n patterns that already work in hub-web carry over as
  design precedent, even though the markup and styling are rebuilt.

**Negative**

- The hub-web UI is rebuilt rather than ported, which is more upfront work
  than copying working CSS.
- Contact form has no record of past submissions until the data layer ADR
  lands.

**Neutral**

- `/studio` staying out of v1 means no admin UI exists yet; content changes
  happen through the same typed files and PRs as everything else in this
  repository.

## References

- ADR-0002: start felpsxp-hub from scratch
- `felpsxp-platform` roteiro: `docs/planning/hub-extraction-roteiro.md`
  (Blocks 2 and 4)
- `felpsxp-platform` blueprint: `docs/planning/hub-blueprint-v1.4-2026-11-07.md`
