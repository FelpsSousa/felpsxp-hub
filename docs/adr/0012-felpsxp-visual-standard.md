# ADR-0012: Adopt the FelpsXP visual standard, with credited third-party assets

- **Status:** Accepted (agreed by Felipe on 2026-11-25, in chat: blue links, a wider column,
  a public `/design` page)
- **Date:** 2026-11-25
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0005 (design tokens, Primer as reference), ADR-0013 (project XP),
  FelpsXP Logs ADR-0014 and `docs/design/visual-standard.md` there (the standard and its
  reference implementation)

## Context

The Hub already uses GitHub Primer's palette (ADR-0005), so it looks familiar, but the
recruiter's eye finds little to hold on to: every badge is grey, the only colour is the
purple accent, icons appear only in the header, section labels are plain uppercase text, and
long pages are a single narrow column. FelpsXP Logs adopted a fuller standard on 2026-11-24:
Primer's layers and state fills, Octicons, a GitHub-like type scale, bordered boxes with
header rows, and a few discreet retro faces as the FelpsXP signature. Felipe asked for the
same direction here, within the limits of a professional site read by recruiters.

Using another company's design language raises a second question that ADR-0005 did not
answer: which of its assets may be used, under which licence, and how the use is credited.

## Decision drivers

- Readability and accessibility first: WCAG 2.2 AA in both themes, checked by axe in CI.
- One look across the FelpsXP apps, so the Hub can point to the standard instead of
  re-deciding it.
- Retro faces mark, they never explain: a recruiter must never read a sentence in them.
- Every third-party asset is used under its licence, credited where people can see it, and
  never suggests an affiliation with GitHub.
- No request to another origin: fonts and icons ship from the Hub itself, so the CSP stays
  as it is (ADR-0009).

## Decision

The Hub adopts the FelpsXP visual standard, with these choices for a public portfolio:

| Area | Decision |
| --- | --- |
| Links | Primer blue (`#0969da` light, `#4493f8` dark) for links in running text. Purple stays the brand accent: the current navigation item, primary actions, the brand mark. This amends ADR-0005, where purple replaced blue everywhere. |
| State colours | Success, attention and danger each gain a muted fill (`*-muted`), used for status badges and highlighted cards. A tone is always a muted fill or a coloured border, never a saturated background behind text. |
| Layout | The main column widens from `max-w-2xl` to `max-w-5xl` on listing pages (project cards in a two-column grid on wide screens); long reading pages keep a line length of about 75 characters. |
| Icons | Octicons (`@primer/octicons-react`) replace Lucide, 16 px beside headings and navigation, 12 px in meta lines, always `aria-hidden` next to a text label. |
| Type | System sans and mono as today. **Special Elite** (typewriter) for small uppercase labels above sections. **Press Start 2P** (old video games) only for the XP badge (ADR-0013) and a small FelpsXP mark. Neither is used for Felipe's name, headings, body text, numbers people read, or the CV. |
| Components | `Box` (bordered card with a header row and divided rows), `ScoreCard` (icon, large sans value, detail line), `Badge` (pill with a tone), used where a list or a summary reads better than loose paragraphs. |
| `/design` | A public page that shows the standard live: tokens in both themes, type, icons, components, and the variations still being chosen side by side, so each choice is made by looking at the real thing. It is linked from the footer and lists the credits below. |

### Third-party assets: what is used, under which licence, and how it is credited

| Asset | Licence | Use |
| --- | --- | --- |
| Primer Primitives (colour values, hand-ported) | MIT, GitHub Inc. | Values copied into `globals.css`; no package |
| Octicons (`@primer/octicons-react` 19.42.0) | MIT, GitHub Inc. | Interface icons; replaces Lucide (ISC) |
| Special Elite (`@fontsource/special-elite` 5.3.0) | Apache 2.0, Astigmatic | Section labels |
| Press Start 2P (`@fontsource/press-start-2p` 5.3.0) | SIL Open Font License 1.1, CodeMan38 | XP badge and FelpsXP mark |

Rules that follow from the licences and from GitHub's trademarks:

1. **Credit where people can see it.** `/design` has a "Credits and licences" section naming
   each asset, its author, its licence and a link to the licence text. The README links to it.
2. **Keep the notices the licences require.** MIT and Apache 2.0 require the copyright and
   licence notice with copies; the OFL requires the copyright notice and licence with the
   font. The repository keeps `THIRD_PARTY_NOTICES.md` with each notice; the packages keep
   their own licence files, and the fonts are served unmodified.
3. **No GitHub logos.** The Octocat and the GitHub mark are trademarks and are not covered by
   the Octicons MIT licence, so the Hub does not use the `mark-github` icon or any GitHub
   logo. The link to Felipe's GitHub profile stays a text link.
4. **No implied affiliation.** The Hub says it is "based on GitHub's open-source Primer design
   system", never that it is a GitHub product or endorsed by GitHub.
5. **New assets follow the same path:** a licence that allows the use, a pinned version a few
   weeks old, a line in the table above and in the notices, in the same pull request.

## Consequences

**Positive**

- Status, level and evidence are visible at a glance; long pages gain structure.
- The Hub and Logs share one standard, written down once.
- Licences and credits are handled explicitly, which is itself part of the portfolio.

**Negative**

- Three new dependencies (one replaces Lucide) and two web fonts, about 20 to 40 KB each for
  the Latin subset; only the fonts in use on a page are downloaded.
- More components to keep accessible in both themes.

**Follow-ups**

- [x] Tokens, fonts, Octicons, credits and the `/design` page with the variations (#127).
- [ ] Apply the chosen variations to the header, home, projects, project pages and
      experience, with captures before and after. Header, home, projects and project pages
      done on 2026-11-26; experience and the three open items still to go.

## Alternatives considered

- **Keep ADR-0005 as it is.** Rejected: Felipe asked for more colour, icons and faces, and the
  narrow grey layout undersells the projects.
- **Import `@primer/css` or Primer React.** Rejected for the same reason as in ADR-0005: full
  control of the frontend, and far more CSS than the Hub uses.
- **Load the fonts from Google Fonts.** Rejected: a request to another origin for every
  visitor, and a CSP exception.

## Amendments

- **2026-11-26:** Felipe's choices on `/design`. Decided: the current navigation item keeps
  the purple underline (A); status badges on a muted fill in their tone, with an icon (C);
  project cards with a side stripe in the status tone and the badges on top (C), the XP badge
  smaller so it matches the other badges; project page sections as boxes with an icon in the
  header (B); the pixel XP mark next to the name in the header (B). Links in running text are
  blue, and listing pages use the wider column with project cards in two columns. Still open,
  with more options on `/design`: the section label face (the typewriter with an icon is in use
  for now; Courier Prime, Space Mono and IBM Plex Mono are candidates, loaded only on
  `/design`, credited, and removed once one is chosen), the headline numbers and the XP badge.
