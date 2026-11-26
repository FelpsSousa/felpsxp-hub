# ADR-0013: Project XP as a public rubric, with a legend

- **Status:** Accepted (agreed by Felipe on 2026-11-26, in chat, with the bands chosen after
  the simulation below)
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
adds a fixed bonus.** The domain multiplier and the tilde go away. The bases sit in **bands
that do not overlap**, so evidence ranks projects within a level but never lifts one past the
next level.

| Level | Base | Band | Written criterion |
| --- | --- | --- | --- |
| Foundational | 10 | 10 to 30 | Study or practice with a guided scope, one concept at a time |
| Applied | 35 | 35 to 55 | A complete tool or product, used for real, built on known patterns |
| Advanced | 60 | 60 to 80 | A system in production with real users or data, and at least one hard decision in architecture, security or scale |
| Frontier | 100 | 100 to 120 | A foundation other systems consume, or a problem with no ready recipe, that sets the patterns others follow |

| Evidence | Bonus | What proves it |
| --- | --- | --- |
| In production or used for real | +5 | A link to the live product, or a section of the page that describes the real use |
| Public source code | +5 | A link to a public GitHub repository |
| Written decisions | +5 | A link to a public ADR folder on GitHub |
| Screens | +5 | At least one app screen in the gallery |

Production, public code and written decisions are declared in each project's content
(`xpEvidence`), each with the link that proves it, and the content schema rejects a claim
without a matching proof: public code must link to a GitHub repository, decisions to an ADR
folder, and a section of the page counts only for production and only when it has content.
Screens are not declared: the gallery is their proof, so they are derived from `media`. The
total is computed at build time from the same constants the legend prints, so the two cannot
disagree.

**Where it shows:**

- **Card:** the total, such as "50 XP", next to the level badge.
- **Project page:** the breakdown, for example "Applied 35 + In production 5 + Public code 5 +
  Written decisions 5", each piece of evidence linking to its proof, and a link to the legend.
- **Projects page:** a "How XP works" section with the two tables above.
- **`/design`:** the badge and the legend, as part of the standard.
- The legend says plainly that it is a self-assessment with public criteria, not an external
  certification.

### Simulation that chose the bands

The first proposal used bases of 10, 25, 50 and 80 with bonuses of +10, +10, +5 and +5. Run on
the real projects and on edge cases, its bands overlapped: an Applied project with every piece
of evidence (55) outscored an Advanced one with none (50), and the Hub tied with a bare
Advanced project. The chosen rubric keeps the bands apart, and a unit test asserts that it
stays that way.

| Project or case | First proposal | Chosen |
| --- | --- | --- |
| FelpsXP Platform (Frontier, nothing public) | 80 | 100 |
| FelpsXP Finance (Advanced, production, screens) | 65 | 70 |
| Candidattus (Advanced, production) | 60 | 65 |
| FelpsXP Hub (Applied, production, public code, ADRs) | 50 | 50 |
| Connexicco (Applied, production) | 35 | 40 |
| Home network observability (Applied) | 25 | 35 |
| Beecrowd problem solving (Foundational, public code) | 20 | 15 |
| Edge: Applied with every piece of evidence | 55 | 55 |
| Edge: Advanced with no evidence | 50 | 60 |
| Overlapping bands | three | none |

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
