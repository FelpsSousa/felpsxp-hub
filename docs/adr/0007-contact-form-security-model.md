# ADR-0007: Contact form security model

- **Status:** Accepted
- **Date:** 2026-11-11
- **Deciders:** Felipe Sousa (@FelpsSousa)
- **Related:** ADR-0003 (no database in v1), `docs/planning/roadmap.md` (Block 2)

## Context

The contact form is the only place where the Hub accepts input from strangers and the only
server-side code path of v1. ADR-0003 already decided that it sends through Resend with no
persistence. What remains open is everything that makes it safe to expose: how the request
reaches the server, how abuse is stopped without a database, what is validated, what the
e-mail looks like, and what is logged.

Constraints that shape the answer:

- Pages are prerendered at build time, so the server cannot embed per-request values (a
  signed timestamp or a CSRF token) in the form.
- There is no database, so rate limiting cannot count submissions in the app itself.
- Every message contains personal data (name, e-mail, free text), so LGPD applies.
- An abused form costs money and reputation: it can burn the Resend quota and turn the
  domain into a spam source.

## Decision drivers

- No new dependency where a few lines of `fetch` will do.
- Abuse stopped before it reaches Resend, by controls that work on a static page.
- Nothing stored, nothing personal written to logs.
- Each control testable on its own.

## Options considered

### Option A: Route handler (`POST /api/contact`)

- ✅ An explicit, documented endpoint, easy to probe with curl or a DAST scanner.
- ❌ CSRF protection (origin checking) has to be written and maintained by hand.

### Option B: Server Action

- ✅ Next.js accepts only `POST` for Server Actions and compares the `Origin` header with the
  `Host` header, rejecting cross-site calls without extra code.
- ✅ Works with a plain `<form>` and `useActionState`; the page stays static.
- ❌ The endpoint is less visible, which matters little once the logic is a tested function.

### Option C: Third-party form service

- ✅ No server code.
- ❌ Visitors' personal data goes to another processor, and the Hub loses its only
  demonstration of server-side input handling.

## Decision

We will use **Option B**, a Server Action, with the request handled in this order:

1. **Transport.** Server Action (`POST` only, origin checked by Next.js), with
   `serverActions.bodySizeLimit` lowered to `64kb`, far above any legitimate message.
2. **Bot check.** Cloudflare Turnstile. The server verifies the token with Cloudflare's
   `siteverify` endpoint, including the expected hostname, before anything else runs. A
   missing or invalid token is rejected.
3. **Honeypot.** A hidden field that people never fill. When it is filled, the action
   returns the normal success response and sends nothing, so bots learn nothing.
4. **Validation.** One Zod schema, the same on client and server, with the server as the
   authority:

   | Field | Rule |
   | --- | --- |
   | `name` | 1 to 100 characters, trimmed, no line breaks |
   | `email` | Valid address, at most 254 characters |
   | `company` | Optional, at most 100 characters, no line breaks |
   | `intent` | One of `hiring`, `partnership`, `collaboration`, `other` |
   | `message` | 10 to 5,000 characters |

5. **Delivery.** A direct `fetch` to the Resend API, no SDK. The e-mail is **plain text
   only**, so visitor input is never rendered as HTML. It is sent from an address on the
   verified `felpsxp.com` domain to Felipe's inbox, with the visitor's address as
   `Reply-To`. Line breaks are rejected in every field that reaches a header.
6. **Edge rate limiting.** A rate-limit rule at the edge (Vercel Firewall, or Cloudflare if
   the domain is later proxied), configured at go-live. Resend's own daily quota caps the
   worst case.

**Responses** are generic: success, a validation error naming only the fields to fix, or a
"try again later" message. Internal errors and third-party responses are never shown.

**Logging** records which step failed (`turnstile`, `validation`, `delivery`) and nothing
else: no names, addresses, message text or IPs.

**Data.** Nothing is stored by the Hub. The message exists only in Felipe's mailbox, and the
`/privacy` page says so, together with Cloudflare's role in the bot check.

**Configuration** lives in environment variables, documented without values in
`.env.example`:

| Variable | Scope |
| --- | --- |
| `RESEND_API_KEY` | Server only |
| `CONTACT_FROM_EMAIL` | Server only |
| `CONTACT_TO_EMAIL` | Server only, so Felipe's inbox never appears in the repository |
| `TURNSTILE_SECRET_KEY` | Server only |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public by design |

**CSP.** `script-src` and `frame-src` gain `https://challenges.cloudflare.com`, the only
third-party origin the Hub loads.

## Consequences

**Positive**

- Cross-site submission, bots, oversized payloads, header injection and HTML injection are
  each handled by a named, testable control.
- No database, no new dependency, no personal data at rest in the Hub.
- The flow is a compact demonstration of input handling for a public portfolio.

**Negative**

- Turnstile requires JavaScript and loads a Cloudflare script; visitors without JavaScript
  must use the e-mail address or LinkedIn instead.
- Without persistence there is no history of messages beyond the mailbox.
- Rate limiting depends on the edge configuration, outside the repository.

**Follow-ups**

- [ ] Felipe: Cloudflare Email Routing for `contato@felpsxp.com`, Resend domain
      verification, Turnstile site and secret keys.
- [ ] Implement the action, the schema and the page, with unit tests for every step.
- [ ] Update `.env.example` (and drop the unused Supabase entries from the template).
- [ ] Add Turnstile to the CSP.
- [ ] `/privacy` page describing the contact flow.
- [ ] Edge rate-limit rule at go-live.
