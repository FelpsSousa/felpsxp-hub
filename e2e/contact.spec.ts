import { expect, test, type Page } from '@playwright/test';

/**
 * The contact form end to end (ADR-0007). Turnstile runs for real in the
 * browser with Cloudflare's test site key, and the server is configured by
 * playwright.config.ts so that delivery can never succeed: no real e-mail is
 * ever sent by these tests.
 */

async function openForm(page: Page) {
  await page.goto('/en/contact');
  // Turnstile writes its token into this field once the check passes.
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(/.+/, {
    timeout: 20_000,
  });
}

async function fillValid(page: Page) {
  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByLabel('Subject').selectOption('hiring');
  await page.getByLabel('Message').fill('I would like to talk about a senior role.');
}

test('shows field errors and keeps what was typed', async ({ page }) => {
  await openForm(page);
  await page.getByLabel('Name').fill('Ada Lovelace');
  await page.getByLabel('E-mail').fill('not-an-address');
  await page.getByLabel('Message').fill('short');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.locator('form').getByRole('alert')).toHaveText(
    'Please review the highlighted fields.',
  );
  await expect(page.getByLabel('E-mail')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Message')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Subject')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Name')).toHaveValue('Ada Lovelace');
});

test('answers a filled honeypot with a fake success', async ({ page }) => {
  await openForm(page);
  await fillValid(page);
  await page.locator('input[name="website"]').evaluate((input: HTMLInputElement) => {
    input.value = 'https://spam.example';
  });
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByRole('status')).toContainText('Message sent.');
});

test('shows a generic error when delivery fails', async ({ page }) => {
  await openForm(page);
  await fillValid(page);
  await page.getByRole('button', { name: 'Send message' }).click();

  // Scoped to the form: Next.js adds its own route announcer with role="alert".
  const alert = page.locator('form').getByRole('alert');
  await expect(alert).toContainText('could not be sent right now');
  await expect(alert).not.toContainText(/resend|api|401|key/i);
});

test('explains a bot check that did not load instead of submitting', async ({ page }) => {
  // Simulates Cloudflare being unreachable, or a site key the host is not allowed to use.
  await page.route('https://challenges.cloudflare.com/**', (route) => route.abort());
  let submitted = false;
  page.on('request', (request) => {
    if (request.method() === 'POST') submitted = true;
  });

  await page.goto('/en/contact');
  await fillValid(page);
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.locator('form').getByRole('alert')).toContainText(
    'The bot check did not load.',
  );
  expect(submitted).toBe(false);
});
