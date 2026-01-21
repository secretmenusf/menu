import { test, expect } from '@playwright/test';

test.describe('Menu Item Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    // Wait for the menu grid to load
    await page.waitForSelector('[class*="rounded-2xl"]');
  });

  test('should open full-page modal when clicking a food item', async ({ page }) => {
    // Click the first menu card
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Check modal is visible and full-page
    const modal = page.locator('[class*="fixed inset-0"]');
    await expect(modal).toBeVisible();

    // Check back arrow is visible
    const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(backButton).toBeVisible();

    // Check close button is visible
    const closeButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1);
    await expect(closeButton).toBeVisible();
  });

  test('should display food image', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Check image is present
    const image = page.locator('img[class*="object-cover"]').first();
    await expect(image).toBeVisible();
  });

  test('should display nutrition facts', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Check nutrition section
    const nutritionTitle = page.getByText('Nutrition Facts', { exact: false });
    await expect(nutritionTitle).toBeVisible();
  });

  test('should close modal when clicking back arrow', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Click back button
    const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await backButton.click();

    // Modal should be closed
    const modal = page.locator('[class*="fixed inset-0"][class*="bg-background"]');
    await expect(modal).not.toBeVisible();
  });

  test('should have 2-column layout on desktop', async ({ page, viewport }) => {
    // Skip if not desktop
    if (viewport && viewport.width < 1024) {
      test.skip();
      return;
    }

    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Check for grid layout
    const gridContainer = page.locator('[class*="lg:grid"][class*="lg:grid-cols-2"]');
    await expect(gridContainer).toBeVisible();
  });

  test('should have single column layout on mobile', async ({ page, viewport }) => {
    // Skip if not mobile
    if (viewport && viewport.width >= 1024) {
      test.skip();
      return;
    }

    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Image should be visible at top
    const image = page.locator('img[class*="object-cover"]').first();
    await expect(image).toBeVisible();

    // Content should be below image (scroll to see it)
    const contentSection = page.getByText('Nutrition Facts', { exact: false });
    await expect(contentSection).toBeVisible();
  });

  test('should take screenshot of modal on each viewport', async ({ page }, testInfo) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click();

    // Wait for modal to fully render
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: `test-results/menu-modal-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
