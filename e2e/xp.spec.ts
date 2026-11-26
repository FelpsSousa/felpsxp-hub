import { expect, test } from '@playwright/test';

/** ADR-0013: the badge, the breakdown and the legend tell the same story. */
test('a project shows its XP part by part, linking to the proof and to the legend', async ({ page }) => {
  await page.goto('/en/projects/felpsxp-hub');
  const breakdown = page.getByText('How this XP was computed').locator('..').locator('..');
  await expect(breakdown).toContainText('50 XP in total');
  await expect(breakdown).toContainText('Applied 35');
  await expect(breakdown.getByRole('link', { name: 'Public code 5' })).toHaveAttribute(
    'href',
    'https://github.com/FelpsSousa/felpsxp-hub',
  );

  await breakdown.getByRole('link', { name: 'How XP works' }).click();
  await expect(page).toHaveURL(/\/en\/projects#xp$/);
  await expect(page.getByRole('heading', { name: 'How XP works' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '35 to 55 XP' })).toBeVisible();
});

test('the card shows the same total as the project page', async ({ page }) => {
  await page.goto('/en/projects');
  const card = page.getByRole('link', { name: /FelpsXP Hub/ }).first();
  await expect(card).toContainText('50 XP');
  await expect(card).not.toContainText('~');
});
