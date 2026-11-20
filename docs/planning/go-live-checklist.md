# Go-live checklist: `felpsxp.com` on this repository

The exact steps to move `felpsxp.com` from the paused project of the previous Hub to the
Vercel project of this repository. Felipe runs the dashboard steps; a Claude Code session
runs the verification at the end and reports what it saw. Written on 2026-11-19 (task H3.3 of
[`session-handoff-2026-11-17.md`](session-handoff-2026-11-17.md)).

State before the cutover, checked on 2026-11-19:

- `felpsxp.com` answers 503 from the paused project of the previous Hub; `www.felpsxp.com`
  does not answer.
- This repository is in production at `felpsxp-hub-two.vercel.app`, with the contact form
  rendering its Turnstile widget, so the contact environment variables are already set in
  the Production environment.
- The only other subdomain that answers today serves HTTPS and redirects HTTP to it, so the
  `includeSubDomains` in this site's HSTS header breaks nothing.

There is no rollback to the old project: it is paused and answers 503. If a deployment of
this project misbehaves, use Instant Rollback to its previous production deployment.

## 1. Before touching DNS

1. Every pull request meant for the launch is merged, and the production deployment of
   `main` is green in Vercel.
2. **Cloudflare, Turnstile:** open the widget used by the contact form and add
   `felpsxp.com` and `www.felpsxp.com` to its hostnames. Keep the `vercel.app` host for now.
   Without this the widget refuses to load on the real domain and the form cannot be sent.
3. **Vercel, this project, Settings, Environment Variables:** confirm that the five
   variables of [`.env.example`](../../.env.example) exist for Production. Nothing to change
   if the form works on `felpsxp-hub-two.vercel.app`.

## 2. Move the domain

1. **Vercel, old project, Settings, Domains:** remove `felpsxp.com` and `www.felpsxp.com`.
2. **Vercel, this project, Settings, Domains:** add `felpsxp.com` as the production domain,
   then add `www.felpsxp.com` set to **redirect (308) to `felpsxp.com`**. The apex is the
   canonical host: `metadataBase`, the sitemap, `security.txt` and every canonical link use
   it.
3. **Cloudflare, DNS:** set the apex and `www` records to the values Vercel shows for this
   project, with the proxy status **DNS only** (grey cloud), as Vercel recommends.
   Leave every other record untouched: the MX and TXT records of Email Routing (SPF, DKIM,
   DMARC) and the records of other subdomains.
4. Wait until Vercel shows both domains with a valid configuration and an issued
   certificate. With Cloudflare's automatic TTL this usually takes a few minutes.

## 3. Rate limit the contact form (ADR-0007)

**Vercel, this project, Firewall:** check whether the plan offers rate-limit rules. If it
does, add one:

- **If** the request path equals `/contact` **or** `/en/contact`, **and** the method is
  `POST` (the Server Action posts to the page path).
- **Then** rate limit with a fixed window of 60 seconds and 5 requests, keyed by IP, and
  deny the rest (429).

If the plan does not offer it, the form still has Turnstile, the honeypot and server-side
validation. Tell the session, which records the fallback as an amendment to ADR-0007 before
anything else is chosen.

## 4. Verify

The session checks and reports each item:

- [ ] `https://felpsxp.com/` and `https://felpsxp.com/en` answer 200 from this project (the
      footer shows the current version and commit).
- [ ] `https://www.felpsxp.com/` and `http://felpsxp.com/` redirect to `https://felpsxp.com/`.
- [ ] Security headers present: HSTS, the enforced CSP and the strict report-only one
      (ADR-0009), `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
      `Referrer-Policy`, `Cross-Origin-Opener-Policy`.
- [ ] `/.well-known/security.txt`, `/robots.txt`, `/sitemap.xml` and the share images are
      served, with `felpsxp.com` URLs.
- [ ] An unknown path answers 404.

Felipe checks, because they need a browser and a real inbox:

- [ ] A message sent through `/contact` arrives.
- [ ] Mail sent to `contact@felpsxp.com` still arrives (Email Routing).

### Result, 2026-11-20

The cutover is done. `felpsxp.com` is the production domain of this project and
`www.felpsxp.com` redirects to it with a 308. Checked from outside:

- [x] `/` and `/en` answer 200 from this project, with the footer showing `v0.19.0` and
      commit `35702e5`, the head of `main`.
- [x] `http://felpsxp.com/` and `https://www.felpsxp.com/` redirect with a 308 to
      `https://felpsxp.com/`; the `www` record is a DNS-only CNAME to Vercel, resolved by
      Cloudflare's authoritative servers, `1.1.1.1` and `8.8.8.8`.
- [x] All the security headers listed above are present, HSTS with `includeSubDomains`.
- [x] `security.txt`, `robots.txt`, `sitemap.xml`, the share image and both CV PDFs are
      served, and the canonical and `hreflang` links use `https://felpsxp.com`.
- [x] `/cv`, `/experience`, `/about` and `/en/contact` answer 200; an unknown path answers
      404.
- [x] Turnstile lists both hostnames (Felipe).

Still open: the contact form and Email Routing checks in a browser, and the rate-limit rule
of section 3.

## 5. Right after

- Felipe points the LinkedIn and GitHub profile links, and the CV header, to
  `felpsxp.com` (Block H4 of the handoff).
- Remove the `vercel.app` host from the Turnstile widget once the domain has been stable for
  a day.
- Tick the domain item in the roadmap and say that the registry record `FXP-003` needs an
  update.
- Release `1.0.0` waits for `/cv`, `/experience` and `/about` (roadmap, Block 3).
