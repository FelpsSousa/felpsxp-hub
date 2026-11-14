import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'Keyboard shortcuts are for physical keyboards');

test('single-key shortcuts open the search and navigate, but never while typing', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Atalhos de teclado' })).toBeVisible();

  await page.keyboard.press('/');
  const search = page.getByRole('dialog', { name: 'Buscar no site' });
  await expect(search).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).toBeHidden();

  await page.keyboard.press('g');
  await page.keyboard.press('p');
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto('/contact');
  const name = page.getByRole('textbox', { name: /Nome/ });
  await name.click();
  await page.keyboard.type('gp/');
  await expect(name).toHaveValue('gp/');
  await expect(page).toHaveURL(/\/contact$/);
});

test('single-key shortcuts can be turned off, and Ctrl+K still works', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Shift+?');
  const help = page.getByRole('dialog', { name: 'Atalhos de teclado' });
  await expect(help).toBeVisible();

  const toggle = help.getByRole('checkbox', { name: 'Atalhos de uma tecla ativos' });
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  await help.getByRole('button', { name: 'Fechar' }).click();
  await expect(help).toBeHidden();

  await page.reload();
  await page.keyboard.press('/');
  await page.keyboard.press('g');
  await page.keyboard.press('p');
  await expect(page.getByRole('dialog', { name: 'Buscar no site' })).toBeHidden();
  await expect(page).toHaveURL(/\/$/);

  await page.keyboard.press('Control+K');
  await expect(page.getByRole('dialog', { name: 'Buscar no site' })).toBeVisible();
});
