import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the search index is a static file with both locales', async ({ request }) => {
  const response = await request.get('/search-index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json();
  expect(Object.keys(index).sort()).toEqual(['en', 'pt']);
  expect(index.pt.length).toBeGreaterThan(10);
});

test('Ctrl+K opens the search, the keyboard picks a result and Enter opens it', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Buscar no site' });

  if (isMobile) {
    await page.getByRole('button', { name: 'Buscar no site' }).click();
  } else {
    await page.keyboard.press('Control+K');
  }
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();

  // Accents are ignored: "seguranca" finds "Segurança".
  await input.fill('seguranca');
  await expect(dialog.getByRole('option').first()).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .include('dialog')
    .analyze();
  expect(results.violations.map(({ id }) => id)).toEqual([]);

  await input.fill('platform');
  const option = dialog.getByRole('option', { name: /FelpsXP Platform/ });
  await expect(option).toHaveAttribute('aria-selected', 'true');
  await input.press('Enter');

  await expect(page).toHaveURL(/\/projects\/felpsxp-platform$/);
  await expect(dialog).toBeHidden();
});

test('Escape closes the search and returns focus to its button', async ({ page }) => {
  await page.goto('/en');
  const button = page.getByRole('button', { name: 'Search the site' });
  await button.click();

  const dialog = page.getByRole('dialog', { name: 'Search the site' });
  await dialog.getByRole('combobox').fill('zzzz');
  await expect(dialog.getByRole('status')).toHaveText('Nothing found for “zzzz”.');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
});
