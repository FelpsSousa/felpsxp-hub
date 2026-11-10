# ADR-0006: Testing stack, Vitest for units and Playwright for end-to-end

- **Status:** Accepted
- **Date:** 2026-11-10
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (v1 stack), ADR-0004 (Zod validation), `docs/planning/roadmap.md` (Blocks 1 and 3)

## Context

The repository has no automated tests yet. CI already runs
`pnpm run --if-present test`, so the step exists but does nothing. Two
things in the roadmap need tests soon: the Zod schemas for structured
content (Block 1) and the contact form's server-side validation and
anti-abuse checks (Block 2). The Hub is also a public proof of work, and a
visible, meaningful test suite is one of the first things a technical
reviewer looks for.

The Next.js 16 testing guide (shipped in `node_modules/next/dist/docs`)
states that Vitest does not support `async` Server Components and
recommends end-to-end tests for them. Almost every page in this repository
is an `async` Server Component, so unit tests alone cannot cover what a
visitor actually sees.

## Decision drivers

- Cover what can break silently: content shape, input validation,
  anti-abuse logic, and the rendered pages in both locales.
- Fast feedback locally and in CI, with native TypeScript and ESM support
  and no Babel layer.
- Accessibility checked automatically, since WCAG 2.2 AA is a stated goal.
- Tools that are current market practice and documented by Next.js itself.
- Add each dependency only when the first test that needs it lands.

## Options considered

### Option A: Jest with React Testing Library, Cypress for end-to-end

- ✅ Long-established and widely known.
- ❌ Jest needs a transform layer for TypeScript and ESM, and is slower to
  start than Vitest.
- ❌ Cypress runs inside the browser, which makes multi-tab, multi-origin
  and network-level assertions (security headers, redirects) harder.

### Option B: Vitest for units and components, Playwright for end-to-end

- ✅ Vitest runs TypeScript and ESM natively, starts fast, and has a
  Jest-compatible API.
- ✅ Playwright drives real Chromium, Firefox and WebKit from Node, can
  assert on response headers directly, and has first-class axe
  integration through `@axe-core/playwright`.
- ✅ Both have dedicated guides in the Next.js 16 documentation.
- ❌ Two tools to configure instead of one.

## Decision

We will use **Option B**.

- **Vitest** for unit tests of pure logic: content schemas and accessors in
  `src/lib`, contact validation, anti-abuse checks, and later the security
  event parsing from Block 5. Tests are colocated with the code as
  `*.test.ts`. The default environment is `node`; `jsdom` and React
  Testing Library are added only when the first synchronous Client
  Component with real logic (the theme toggle or the locale switcher) needs
  a test.
- **Playwright** for end-to-end tests in `e2e/`, run against a production
  build (`next build` then `next start`), Chromium first. Each smoke test
  visits a page in both locales and runs **axe** on it. Security headers
  are asserted on real responses here as well. Introduced in Block 3, as a
  separate CI job so unit tests stay fast.
- **Coverage** uses Vitest's `v8` provider and is reported in CI from the
  start. A threshold is enforced on `src/lib` once the contact logic lands,
  so the number reflects code that actually has rules to test, rather than
  page markup.

## Consequences

**Positive**

- The existing CI step starts running real tests with no workflow change.
- Malformed content, broken validation and accessibility regressions fail
  the pull request instead of reaching production.
- The suite is readable proof of testing practice for anyone reviewing the
  repository.

**Negative**

- `async` Server Components are only covered end to end, which is slower
  than unit tests; kept manageable by testing a small set of smoke paths.
- Two configurations to maintain.

**Follow-ups**

- [ ] Add Vitest with the first Zod content schema tests (Block 1).
- [ ] Add jsdom and React Testing Library with the first Client Component
      test (Block 1).
- [ ] Add Playwright, axe and the end-to-end CI job (Block 3).
- [ ] Enforce the `src/lib` coverage threshold once the contact logic lands
      (Block 2).
