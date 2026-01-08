import { test, expect } from '@playwright/test';

test('gallery animates in when scrolled into view', async ({ page }) => {
  await page.goto('/chef');

  const gallerySection = page.getByTestId('gallery');
  await gallerySection.scrollIntoViewIfNeeded();

  const firstItem = page.getByTestId('gallery-item-0');
  await expect(firstItem).toHaveAttribute('data-visible', 'true', { timeout: 5000 });

  await test.info().attach('gallery', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});
