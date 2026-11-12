import { expect, test } from '@playwright/test';
import { locales, pages, urlFor } from './pages';

for (const { code, prefix } of locales) {
  for (const path of pages) {
    const url = urlFor(prefix, path);

    test(`${url} renders inside the site shell`, async ({ page }) => {
      const response = await page.goto(url);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', code);
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/Felipe Sousa/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`^https://felpsxp\\.com${url === '/' ? '/?' : url}$`),
      );
    });
  }
}

test('an unknown address returns a localized 404', async ({ page }) => {
  const response = await page.goto('/en/does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('robots.txt, sitemap.xml, security.txt and the share images are served', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://felpsxp.com/sitemap.xml');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<loc>https://felpsxp.com/privacy</loc>');

  const securityTxt = await request.get('/.well-known/security.txt');
  expect(securityTxt.ok()).toBe(true);
  expect(securityTxt.headers()['content-type']).toContain('text/plain');
  expect(await securityTxt.text()).toContain('Contact: mailto:security@felpsxp.com');

  for (const image of ['/opengraph-image', '/en/opengraph-image']) {
    const response = await request.get(image, { maxRedirects: 0 });
    expect(response.status(), image).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
  }
});
