import { expect, test } from '@playwright/test';

test.describe('locale detection', () => {
  test.use({ locale: 'en-US' });

  test('sends an English-speaking browser to the English site', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveURL(/\/en\/projects$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test('the locale switcher keeps the current page', async ({ page }) => {
  await page.goto('/projects/felpsxp-hub');
  await page.getByRole('link', { name: 'English' }).click();

  await expect(page).toHaveURL(/\/en\/projects\/felpsxp-hub$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('a project page leads back to the list and on to the next project', async ({ page }) => {
  await page.goto('/projects/felpsxp-hub');
  const breadcrumb = page.getByRole('navigation', { name: 'Trilha de navegação' });

  await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText('FelpsXP Hub');
  await breadcrumb.getByRole('link', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto('/projects/felpsxp-hub');
  const more = page.getByRole('navigation', { name: 'Mais projetos' });
  // The first project in the list has no previous one.
  await expect(more.getByRole('link', { name: /Anterior/ })).toHaveCount(0);
  await more.getByRole('link', { name: /Próximo/ }).click();
  await expect(page).toHaveURL(/\/projects\/felpsxp-platform$/);
  await expect(
    page.getByRole('navigation', { name: 'Mais projetos' }).getByRole('link', { name: /Anterior/ }),
  ).toHaveAttribute('href', '/projects/felpsxp-hub');
});

test('the footer version leads to its entry in the changelog', async ({ page }) => {
  await page.goto('/');
  const version = page.getByRole('contentinfo').getByRole('link', { name: /^v\d+\.\d+\.\d+$/ });
  const label = (await version.textContent())!.trim();

  await version.click();
  await expect(page).toHaveURL(new RegExp(`/changelog#${label.replaceAll('.', '\\.')}$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Histórico de versões' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: label })).toBeVisible();
});

test('the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });

  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('the theme choice applies and survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: /^Tema:/ });

  await toggle.click(); // system -> light
  await expect(html).toHaveAttribute('data-theme', 'light');
  await toggle.click(); // light -> dark
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: /^Tema:/ }).click(); // dark -> system
  await expect(html).not.toHaveAttribute('data-theme', /.+/);
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The menu button only exists on small screens');

  test('opens, closes with Escape and returns focus', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Abrir menu' });

    await button.click();
    const menu = page.getByRole('navigation', { name: 'Navegação principal' }).last();
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
  });

  test('closes after navigating', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('navigation', { name: 'Navegação principal' }).last()
      .getByRole('link', { name: 'Projetos' })
      .click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
