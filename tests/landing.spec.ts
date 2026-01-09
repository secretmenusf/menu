import { test, expect } from '@playwright/test';

test('logged-out landing shows animated 3D logo and gate', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('SECRET MENU')).toBeVisible();
  await expect(page.getByText('enter secret password')).toBeVisible({ timeout: 7000 });
  await expect(page.locator('canvas')).toBeVisible();

  await test.info().attach('landing', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});

test('logged-in header shows 3D logo on menu', async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('secretmenu_access', 'true');
  });

  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('header canvas')).toBeVisible();
});
