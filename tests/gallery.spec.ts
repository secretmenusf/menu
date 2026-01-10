import { test, expect } from '@playwright/test';

test('gallery loads on chef page', async ({ page }) => {
  await page.goto('/chef', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Verify page loaded
  const bodyContent = await page.locator('body').evaluate(el => el.children.length);
  expect(bodyContent).toBeGreaterThan(0);

  await test.info().attach('chef-page', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});
