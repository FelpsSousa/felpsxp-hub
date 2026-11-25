# ADR-0013: Project XP as a public rubric, with a legend

- **Status:** Proposed
- **Date:** 2026-11-25
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0004 (content validation), ADR-0012 (visual standard),
  `src/lib/skill-taxonomy.ts`

## Context

Every project card shows a badge such as "~15 XP", a nod to the FelpsXP name. Nothing on the
site says what it means. Today it is computed as `level weight × number of domains`, with
weights 1, 2, 3 and 5 for Foundational, Applied, Advanced and Frontier. Felipe asked for a
legend and for the value to make sense. Looking at it as a recruiter would, the current
badge has these gaps:

1. **No legend.** A reader cannot tell what 15 XP is worth or why one project has more.
2. **It rewards tagging.** Each extra domain multiplies the value, so listing more domains
   raises the score without any change in the work.
3. **The levels have no written criteria.** "Advanced" or "Frontier" is a claim with nothing
   to check it against.
4. **It ignores what a reader can verify:** whether the work runs in production, whether the
   code is public, whether the decisions are written down, whether there are screens.
5. **The tilde reads as a guess**, and a self-assigned score with no rules can look inflated,
   which works against the site's purpose.

## Decision drivers

- A recruiter understands it in ten seconds and can check every point on the page itself.
- Nothing is scored that the page cannot prove.
- Playful in form (the badge, the pixel face), sober in substance.
- Computed from content at build time; no per-visitor state, as today.

## Decision

XP becomes a **public rubric: the level gives the base, and each piece of verifiable evidence
adds a fixed bonus.** The domain multiplier and the tilde go away.

| Level | Base | Written criterion |
| --- | --- | --- |
| Foundational | 10 | Study or practice with a guided scope, one concept at a time |
| Applied | 25 | A complete tool or product, used for real, built on known patterns |
| Advanced | 50 | A system in production with real users or data, and at least one hard decision in architecture, security or scale |
| Frontier | 80 | A foundation other systems consume, or a problem with no ready recipe, that sets the patterns others follow |

| Evidence | Bonus | What proves it on the page |
| --- | --- | --- |
| In production or used for real | +10 | A link to the live product, or a dated statement of use in the project text |
| Public source code | +10 | A link to the public repository |
| Written decisions | +5 | A link to public ADRs |
| Screens or a demo | +5 | At least one app screen in the gallery |

The evidence is declared in each project's content (`xpEvidence`), and the content schema
rejects a claim without its proof: `public-code` needs a repository link, `screens` needs an
image with `presentation: 'screen'`, and so on. The total is computed at build time.

**Where it shows:**

- **Card:** "50 XP" in the pixel face, next to the level badge.
- **Project page:** the breakdown, for example "Advanced 50 + in production 10 + screens 5 =
  65 XP", each part linking to its proof.
- **Projects page:** a short "How XP works" section with the two tables above, and a link to
  it from every badge.
- **`/design`:** the badge and the legend live, as part of the standard.
- The legend says plainly that it is a self-assessment with public criteria, not an external
  certification.

With today's content the values would be:

| Project | Today | Proposed |
| --- | --- | --- |
| FelpsXP Platform | 15 | 80 (Frontier) |
| FelpsXP Finance | 12 | 65 (Advanced, production, screens) |
| Candidattus | 9 | 60 (Advanced, production) |
| FelpsXP Hub | 6 | 50 (Applied, production, public code, ADRs) |
| Connexicco | 4 | 35 (Applied, production) |
| Home network observability | 6 | 25 (Applied) |
| Beecrowd problem solving | 1 | 20 (Foundational, public code) |

## Consequences

**Positive**

- The badge explains itself and can be checked; it stops being decoration.
- Adding evidence (a public repository, screens, ADRs) visibly raises a project, which is an
  honest incentive to publish proof.
- Tagging more domains no longer changes the value.

**Negative**

- The level is still Felipe's own judgement; the written criteria make it arguable, not
  objective.
- One more field in the content schema to keep true.

## Alternatives considered

- **Drop XP entirely.** Simplest and safest; rejected for now because the badge is part of
  the FelpsXP identity and becomes useful once it explains itself.
- **A player level for the whole site (sum of all XP).** Rejected: it adds a game layer a
  recruiter has no use for, and it would grow with the number of projects rather than their
  quality.
- **Keep the formula and only add a legend.** Rejected: the legend would have to explain why
  more domains mean more points, which is the weakest part of the formula.
