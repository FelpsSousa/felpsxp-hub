# felpsxp-hub

> The source of [felpsxp.com](https://felpsxp.com): Felipe Sousa's portfolio, built as a small,
> production-grade web application with security and accessibility checked on every pull request.

**English** · [Português (BR)](README.pt-BR.md)

[![CI](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/ci.yml)
[![CodeQL](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/codeql.yml/badge.svg)](https://github.com/FelpsSousa/felpsxp-hub/actions/workflows/codeql.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe5196.svg)](https://www.conventionalcommits.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Part of the **FelpsXP digital ecosystem** · Registry ID: `FXP-003`

---

## What this is

A bilingual (Portuguese and English) portfolio: profile, projects, a contact form, and the
privacy and security policies. It is deliberately small in features and strict in engineering:
the repository itself is meant to be read, so every decision is recorded, every security
control is tested, and the history is a sequence of small, reviewed pull requests.

## Highlights

**Architecture**

- **Static by default.** Every page is prerendered at build time in both locales and served
  from a CDN. No database and no authentication, because no public page needs them
  ([ADR-0003](docs/adr/0003-v1-stack-and-scope.md)).
- **Content as code.** Profile, projects and legal pages are typed TypeScript validated by Zod
  schemas at build time; the types are inferred from the schemas, and a malformed record fails
  the build naming the record and field ([ADR-0004](docs/adr/0004-content-validation-and-mdx-scope.md)).
- **Decisions before code.** Eight [Architecture Decision Records](docs/adr/README.md) so far,
  including the decision to rebuild from scratch instead of extracting the old app's history
  ([ADR-0002](docs/adr/0002-start-fresh-no-history-extraction.md)).

**Security**

- **Threat model.** A STRIDE model of the site, where every mitigation links to the pull
  request or ADR that implements it ([docs/security/threat-model.md](docs/security/threat-model.md)).
- **Headers, tested.** CSP without `unsafe-eval` in production, HSTS, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`, `frame-ancestors 'none'` and more, asserted by unit tests and
  again on a real production response.
- **A hardened contact form.** Server Action with Cloudflare Turnstile verified server-side,
  a silent honeypot, one Zod schema that blocks header injection, plain-text delivery, nothing
  stored, and anonymous security events with no personal data
  ([ADR-0007](docs/adr/0007-contact-form-security-model.md)).
- **Supply chain.** gitleaks in pre-commit and over the full history in CI, CodeQL on the code
  and on the workflows, GitHub Actions pinned by commit SHA, and new dependencies taken only at
  releases a few weeks old.
- **Disclosure.** A published [security policy](https://felpsxp.com/security) and an RFC 9116
  `security.txt` that CI refuses to let expire.

**Quality**

- **Unit tests** (Vitest) for schemas, content consistency across locales, SEO, security
  headers and every step of the contact flow, with coverage thresholds enforced in CI.
- **End-to-end tests** (Playwright) on a production build, desktop and mobile, including
  **WCAG 2.2 AA checks with axe on every page, in both languages and both colour themes**.
  They have already caught two real accessibility bugs.
- **Privacy by design.** One session cookie for the language, the theme in `localStorage`,
  no analytics or tracking, and a [privacy notice](https://felpsxp.com/privacy) that a test
  keeps in sync with the cookies and third parties the code actually uses (LGPD).

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4, design tokens referenced from GitHub Primer ([ADR-0005](docs/adr/0005-design-tokens-primer-reference.md)) |
| i18n | next-intl, `pt` (default) and `en` |
| Validation | Zod |
| Testing | Vitest, Playwright, axe-core ([ADR-0006](docs/adr/0006-testing-stack.md)) |
| Hosting | Vercel, with DNS on Cloudflare |
| E-mail and bot check | Resend, Cloudflare Turnstile |

## How a change reaches production

```text
branch ─▶ pull request ─▶ CI ──────────────────────────────────────▶ squash merge ─▶ Vercel ─▶ CDN
                          ├─ Hygiene & secrets (pre-commit, gitleaks over full history)
                          ├─ Node (lint · typecheck · unit tests with coverage · build)
                          ├─ End-to-end (Playwright · axe, desktop and mobile)
                          ├─ CodeQL (TypeScript and workflows)
                          └─ Conventional Commits title
```

`main` is protected: changes arrive only through pull requests with green checks.

**Releases** follow semantic versioning, derived from the Conventional Commits by
release-please: it keeps a release pull request open with the next version and a generated
changelog, and merging it publishes the tag and the GitHub release. The footer of every page
shows the running version and the exact commit deployed
([ADR-0008](docs/adr/0008-versioning-and-releases.md)).

## Getting started

Requirements: Node.js (LTS), pnpm, and [pre-commit](https://pre-commit.com).

```bash
git clone https://github.com/FelpsSousa/felpsxp-hub.git
cd felpsxp-hub
pnpm install
pre-commit install --hook-type pre-commit --hook-type commit-msg
cp .env.example .env.local    # the contact form needs these; see the comments inside
pnpm dev                      # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` / `pnpm typecheck` | ESLint and TypeScript |
| `pnpm test` | Unit tests (`pnpm test:coverage` for the report) |
| `pnpm test:e2e` | Build, then Playwright with axe |
| `pre-commit run --all-files` | Every hygiene and secret check |

## Project structure

```text
.
├── docs/
│   ├── adr/              # Architecture Decision Records
│   ├── planning/         # Roadmap
│   └── security/         # Threat model
├── e2e/                  # Playwright and axe tests
├── messages/             # Interface strings, pt and en
├── public/.well-known/   # security.txt
└── src/
    ├── app/[locale]/     # Pages, the contact Server Action
    ├── components/       # Site shell, contact form, legal pages, SEO
    ├── content/          # Typed content and its Zod schemas
    ├── i18n/             # Routing and locale configuration
    └── lib/              # Content access, SEO, security headers, contact flow
```

## Security

Please do **not** open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md) or
write to security@felpsxp.com.

## About AI assistance

How AI tools are used in this repository is described once, in [AI.md](AI.md).

## License

[MIT](LICENSE) © 2026 Felipe Sousa · FelpsXP
