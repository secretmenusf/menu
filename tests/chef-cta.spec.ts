import { test, expect } from '@playwright/test';

test('chef page CTA section has no floating logo', async ({ page }) => {
  await page.goto('/chef');
  await page.waitForLoadState('networkidle');

  // Find the CTA section heading
  const ctaHeading = page.locator('h2:has-text("Ready for a chef-crafted experience")');
  await expect(ctaHeading).toBeVisible();

  // Scroll to it
  await ctaHeading.scrollIntoViewIfNeeded();

  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/chef-cta.png' });

  // The CTA container should NOT have a canvas (SeedOfLife3D) as a direct child before the h2
  const ctaSection = page.locator('section:has(h2:has-text("Ready for a chef-crafted experience"))');
  const canvasInCta = ctaSection.locator('canvas');

  // Count canvases - should be 0 in the CTA section
  const canvasCount = await canvasInCta.count();
  console.log('Canvas count in CTA section:', canvasCount);

  // There should be no canvas/logo in this section
  expect(canvasCount).toBe(0);
});
