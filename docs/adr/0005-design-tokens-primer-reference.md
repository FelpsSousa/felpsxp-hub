# ADR-0005: Design tokens, GitHub Primer as reference, purple as brand accent

- **Status:** Accepted
- **Date:** 2026-11-10
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Scope:** felpsxp-hub only

## Context

Felipe wants the Hub to read as professional and clean for anyone
reviewing it, close to GitHub's own interface: thin borders, a calm dark
(and eventually light) surface, predictable type and spacing. At the same
time, the Hub is also a skills demonstration and should carry the FelpsXP
identity rather than look like an unbranded GitHub clone. He wants both
light and dark palettes, the semantic colors (success/danger/attention)
following GitHub's own convention closely, and the one deliberate
departure: GitHub's blue accent replaced by a purple/lilac accent as the
FelpsXP brand color.

GitHub's own design system, Primer, is MIT-licensed and publicly
published (`github.com/primer/primitives`, `github.com/primer/css`,
`github.com/primer/react`). Its color primitives, typography, and spacing
values are safe to use as a direct reference: that is exactly what GitHub
open-sourced them for. What isn't reused is GitHub's branding (name, logo,
Octocat) or its React components, which would imply affiliation this repo
doesn't have.

A first visual pass (PR #11) already introduced a single `--color-accent`
token (amber) applied to XP-flavored badges and stat values. This ADR
replaces that placeholder with a full token set and the final accent
color, so the amber was always provisional, not a prior decision being
reversed.

## Decision drivers

- Match GitHub's actual values closely enough that the interface feels
  familiar and professional on sight, without importing GitHub's own
  packages (keeps full control over the frontend, which Felipe asked for
  from the start of this project).
- Light and dark both need real values now, even if only dark ships first
  in the UI; deriving both at once avoids re-deriving the scale later.
- One brand accent (purple/lilac) stands in for GitHub's blue everywhere
  blue would normally appear (links, the current "active" state, the
  highlighted stat values), while success/danger/attention stay close to
  GitHub's own hues, since there's no reason to depart from those.

## Decision

Hand-port a small, named set of color tokens as plain CSS custom
properties (no `@primer/primitives` npm dependency), sourced from
`github.com/primer/primitives` (`src/tokens/base/color/{light,dark}/*.json5`,
MIT licensed), with GitHub's blue swapped for the purple step from the
same base scale:

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--color-canvas` | Page background | `#ffffff` | `#0d1117` |
| `--color-surface` | Card / raised background | `#f6f8fa` | `#151b23` |
| `--color-border` | Default border | `#d1d9e0` | `#3d444d` |
| `--color-fg` | Primary text | `#1f2328` | `#f0f6fc` |
| `--color-fg-muted` | Secondary text | `#59636e` | `#9198a1` |
| `--color-success` | Positive status | `#1a7f37` | `#3fb950` |
| `--color-danger` | Negative status | `#cf222e` | `#f85149` |
| `--color-attention` | Warning status | `#9a6700` | `#d29922` |
| `--color-accent` | FelpsXP brand accent | `#8250df` | `#ab7df8` |

The accent values are Primer's own purple scale (the hue GitHub itself
uses for "done"/merged state), promoted to the primary accent role instead
of GitHub's blue. Typography and spacing are not re-derived: Tailwind's
default system-font stack, monospace stack, type scale, and 4px-based
spacing scale already land close enough to Primer's own values that
hand-porting them would add ceremony without a visible difference.

Both palettes are defined from the start, switched by
`prefers-color-scheme`. Wiring an actual manual light/dark toggle in the
UI is separate, smaller follow-up work; not needed for the tokens
themselves to be correct in both modes.

## Considered options

1. Add `@primer/primitives` as a dependency and consume its tokens
   directly.
2. Hand-port only the specific values needed into this repo's own
   `globals.css`, cited to the source.

Option 2 chosen. Option 1 pulls in a package whose scope (hundreds of
tokens, component-level values, multiple theme variants) is far larger
than what this Hub needs, and ties future design changes to upstream
updates instead of to Felipe's own choices, going against the full
control he asked for in ADR-0003's decision drivers.

## Consequences

**Positive**

- The palette is sourced from real, current, licensed values instead of
  guessed hex codes, and the source is citable if anyone asks.
- Replacing one token (`--color-accent`) is enough to carry the brand
  decision through every place it's used; PR #11's existing `accent`
  utility usages update automatically without touching those files again.
- Both modes exist from day one, so a future light/dark toggle is UI work
  only, not a color-deriving exercise.

**Negative**

- No automatic updates if Primer's own palette changes; acceptable, since
  the goal is a fixed reference point, not a live dependency.

**Neutral**

- Applying these tokens to the pages that currently use ad hoc Tailwind
  color utilities (`slate-*`, `white/10`, `amber-*`) is its own follow-up
  PR, per "one thing at a time."

## References

- `github.com/primer/primitives`, `src/tokens/base/color/light/light.json5`
  and `.../dark/dark.json5` (MIT license)
- PR #11: the provisional amber accent token this ADR replaces
