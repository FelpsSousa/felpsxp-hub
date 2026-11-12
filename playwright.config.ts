import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end and accessibility tests (ADR-0006), always against a production
 * build, because the subtlest bugs of this site only showed up there. Build
 * first (`pnpm build`), or use `pnpm test:e2e`, which does both.
 */
const port = 3100;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    // The browser speaks the default locale. Otherwise locale detection, a
    // feature of the site, sends unprefixed URLs to their English version.
    { name: 'desktop', use: { ...devices['Desktop Chrome'], locale: 'pt-BR' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], locale: 'pt-BR' } },
  ],
  webServer: {
    command: `pnpm exec next start --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Runtime configuration for the contact form's Server Action. Turnstile uses
    // Cloudflare's public test secret (always passes) and Resend gets a key it
    // will reject, so no test can ever send a real e-mail.
    env: {
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      RESEND_API_KEY: 're_e2e_invalid_key',
      CONTACT_FROM_EMAIL: 'E2E <e2e@example.com>',
      CONTACT_TO_EMAIL: 'e2e@example.com',
    },
  },
});
