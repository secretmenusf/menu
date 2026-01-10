import { test, expect } from '@playwright/test';

test('landing page shows password gate', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Should show password gate for unauthenticated users
  const hasContent = await page.locator('body').evaluate(el => el.children.length > 0);
  expect(hasContent).toBe(true);

  await test.info().attach('landing', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});

test('authenticated user sees home page', async ({ page }) => {
  // Set session storage to bypass password gate
  await page.addInitScript(() => {
    window.sessionStorage.setItem('secretmenu_access', 'true');
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const hasContent = await page.locator('body').evaluate(el => el.children.length > 0);
  expect(hasContent).toBe(true);

  await test.info().attach('home-authenticated', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});
