# ADR-0010: The CV page: typed content as the single source, PDF rendered from the page

- **Status:** Proposed
- **Date:** 2026-11-19
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (v1 stack and scope), ADR-0004 (content validation and MDX scope),
  ADR-0006 (testing stack), ADR-0009 (CSP nonces), `docs/planning/roadmap.md` (Block 2)

## Context

Recruiters open `felpsxp.com` from a CV or a LinkedIn profile, and the Hub needs a `/cv` page
in `pt` and `en`, a print stylesheet that gives a clean one or two page document, and a PDF to
download. The `/experience` timeline and the `/about` page are planned on top of the same
data, so nothing is typed twice.

The CV text already exists in a private repository: LaTeX variants (a long master and
one-page variants per role), each line annotated with the verified fact behind it. Those
files also carry a personal e-mail address and a phone number, and the variants are tailored
per application. The content review of November 2026 showed what drift costs: dates and
team descriptions that disagreed between the site, the CVs and the public profile, each one
a question a recruiter could ask.

## Decision drivers

- One public version of the CV, so the site, the PDF and the profile cannot disagree.
- No personal contact data in this public repository (CLAUDE.md, LGPD).
- No automation that reads the private repository (it holds private data; nothing in CI may
  touch it).
- The content is validated at build time like the rest of the site (ADR-0004).
- Accessible and indexable HTML first; the PDF is a convenience, not the source.
- No new runtime dependency and no inline script (ADR-0009).

## Options considered

### Content A: typed content in `src/content/cv/`, curated by hand

The CV as TypeScript records per locale, parsed with Zod at build time: roles, projects,
earlier experience, education, skills and languages. `/cv`, `/experience` and `/about` read
it. Each record is written from the master variant and its facts; the claim-to-fact mapping
stays private, as for the rest of the content.

- ✅ One source for three pages; the build fails on a malformed record.
- ✅ Contact data limited to what is already public: `contact@felpsxp.com`, the site, GitHub,
  LinkedIn and the city.
- ❌ The master LaTeX variant and this content must be kept in step by hand.

### Content B: generate the content from the private repository

A script that reads the LaTeX or the facts and writes the typed content.

- ✅ No hand copying.
- ❌ Automation reading private data, which both repositories forbid; a parsing layer for
  LaTeX that would break on every formatting change.

### Content C: publish only a PDF

- ✅ Least work.
- ❌ Not accessible, not indexable, and `/experience` and `/about` would have nothing to read.

### PDF 1: browser print only

The print stylesheet, and a "print or save as PDF" button that calls `window.print()` from a
client component.

- ✅ Zero drift: the PDF is the page.
- ❌ No file to download or attach; the result depends on the visitor's browser.

### PDF 2: copy the PDF compiled from the LaTeX master into `public/`

- ✅ The typographic quality of LaTeX.
- ❌ A second source that drifts from the page; the compiled file carries the personal
  e-mail and phone number unless a separate variant is maintained for the site.

### PDF 3: render the PDF from the `/cv` page with Playwright

A `pnpm cv:pdf` script builds the site, opens `/cv` and `/en/cv` in Chromium (already a dev
dependency for the end-to-end suite) and writes `public/cv/felipe-sousa-cv-pt.pdf` and
`-en.pdf` with the print stylesheet. The PDF metadata carries a hash of the CV content, and a
unit test fails when the committed PDF does not match the current content, so a stale file
cannot ship.

- ✅ A real download, generated from the single source.
- ✅ No new dependency; the print stylesheet is the same one the browser uses.
- ❌ A generated binary in the repository, refreshed by a script when the CV changes.

## Decision

Proposed: **Content A with PDF 3**, and the print button of PDF 1 kept as well, since the
print stylesheet exists anyway.

Typed content is the only option that serves the three pages without reading private data.
Rendering the PDF from the page keeps one source, and the freshness test turns drift into a
failing build instead of a question in an interview. The LaTeX variants stay in the private
repository as tailored copies for applications; when the public CV changes, the master
variant follows it, and the private claim map records the facts behind both.

## Consequences

**Positive**

- The site, the PDF and the planned timeline and about page say the same thing by
  construction.
- The public CV carries no personal contact data.

**Negative**

- Two CV texts remain (public typed content and the private LaTeX variants), kept in step by
  hand; the claim map is the check.
- The PDF is regenerated with a command whenever the CV content changes.

**Follow-ups**

- [ ] Zod schema and `pt`/`en` content in `src/content/cv/`, from the master variant.
- [ ] `/cv` page with print stylesheet, print button, metadata, sitemap entry and JSON-LD
      where it helps; axe-clean in both themes.
- [ ] `pnpm cv:pdf` and the freshness test.
- [ ] `/experience` and `/about` read the same content.

## Amendments
