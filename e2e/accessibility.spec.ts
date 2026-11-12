import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { locales, pages, urlFor } from './pages';

/** WCAG 2.2 level AA, the target recorded in the threat model and the roadmap. */
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const { code, prefix } of locales) {
    for (const path of pages) {
      const url = urlFor(prefix, path);

      test(`${url} has no WCAG 2.2 AA violations (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto(url);
        await expect(page.locator('html')).toHaveAttribute('lang', code);

        const results = await new AxeBuilder({ page })
          .withTags(wcagTags)
          // The Turnstile widget is Cloudflare's own cross-origin iframe.
          .exclude('[data-testid="turnstile"]')
          .analyze();

        expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length }))).toEqual(
          [],
        );
      });
    }
  }
}
