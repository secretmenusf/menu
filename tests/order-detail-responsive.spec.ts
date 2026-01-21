import { test, expect } from '@playwright/test';

test.describe('Order Detail View - Responsive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    // Wait for menu items to load with longer timeout
    await page.waitForSelector('[class*="rounded-2xl"][class*="cursor-pointer"]', { timeout: 15000 });
    // Additional wait for any animations
    await page.waitForTimeout(500);
  });

  test('should open order detail modal when clicking a food item', async ({ page }) => {
    // Click the first menu card with force to bypass any potential overlays
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await expect(menuCard).toBeVisible();
    await menuCard.click({ force: true });

    // Wait for modal to appear with longer timeout
    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Modal should be visible
    const modal = page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]');
    await expect(modal).toBeVisible();
  });

  test('should have Add to Order button always visible at bottom', async ({ page }) => {
    // Click menu item to open modal
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await expect(menuCard).toBeVisible();
    await menuCard.click({ force: true });

    // Wait for modal with longer timeout
    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Find the fixed CTA section at bottom (z-[100])
    const ctaSection = page.locator('[class*="fixed"][class*="bottom-0"]').filter({ hasText: 'Total' });
    await expect(ctaSection).toBeVisible();

    // Check for "Add to Order" button
    const addToOrderButton = page.getByRole('button', { name: /add to order/i });
    await expect(addToOrderButton).toBeVisible();

    // Check for Total text
    const totalLabel = page.getByText('Total', { exact: false });
    await expect(totalLabel).toBeVisible();
  });

  test('should keep Add to Order button visible after scrolling', async ({ page }) => {
    // Click menu item to open modal
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    // Wait for modal
    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Scroll down in the modal content
    const scrollableContent = page.locator('[class*="overflow-y-auto"]').first();
    await scrollableContent.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Wait a moment for any animations
    await page.waitForTimeout(300);

    // Add to Order button should still be visible
    const addToOrderButton = page.getByRole('button', { name: /add to order/i });
    await expect(addToOrderButton).toBeVisible();

    // Verify it's in the viewport (not scrolled away)
    const buttonBox = await addToOrderButton.boundingBox();
    const viewportSize = page.viewportSize();

    expect(buttonBox).toBeTruthy();
    if (buttonBox && viewportSize) {
      // Button should be within viewport height
      expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(viewportSize.height + 10);
      expect(buttonBox.y).toBeGreaterThanOrEqual(-10);
    }
  });

  test('should display back arrow and close button', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Back arrow button (left side)
    const backButton = page.locator('button[class*="fixed"][class*="left-4"]').first();
    await expect(backButton).toBeVisible();

    // Close button (right side)
    const closeButton = page.locator('button[class*="fixed"][class*="right-4"]').first();
    await expect(closeButton).toBeVisible();
  });

  test('should display food image', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Food image should be visible
    const foodImage = page.locator('img[class*="object-cover"]').first();
    await expect(foodImage).toBeVisible();
  });

  test('should display nutrition facts', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Nutrition Facts section
    const nutritionTitle = page.getByText('Nutrition Facts');
    await expect(nutritionTitle).toBeVisible();
  });

  test('should display quantity selector', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Quantity label
    const quantityLabel = page.getByText('Quantity', { exact: true });
    await expect(quantityLabel).toBeVisible();
  });

  test('should close modal when clicking back arrow', async ({ page }) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Click back button
    const backButton = page.locator('button[class*="fixed"][class*="left-4"]').first();
    await backButton.click();

    // Modal should be closed
    await expect(page.locator('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]')).not.toBeVisible();
  });

  test('should take screenshot of order detail view', async ({ page }, testInfo) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Wait for images to load
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({
      path: `test-results/order-detail-${testInfo.project.name}.png`,
      fullPage: false,
    });
  });

  test('should take screenshot after scrolling to show fixed CTA', async ({ page }, testInfo) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    // Scroll down in the modal
    const scrollableContent = page.locator('[class*="overflow-y-auto"]').first();
    await scrollableContent.evaluate((el) => {
      el.scrollTop = el.scrollHeight / 2;
    });

    await page.waitForTimeout(500);

    // Take screenshot showing the fixed CTA is still visible
    await page.screenshot({
      path: `test-results/order-detail-scrolled-${testInfo.project.name}.png`,
      fullPage: false,
    });
  });
});

test.describe('Order Detail View - Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    await page.waitForSelector('[class*="rounded-2xl"][class*="cursor-pointer"]', { timeout: 15000 });
    await page.waitForTimeout(500);
  });

  test('should have proper layout based on viewport', async ({ page }, testInfo) => {
    const menuCard = page.locator('[class*="rounded-2xl"][class*="cursor-pointer"]').first();
    await menuCard.click({ force: true });

    await page.waitForSelector('[class*="fixed"][class*="inset-0"][class*="z-50"][class*="bg-background"]', { timeout: 10000 });

    const viewportSize = page.viewportSize();
    const projectName = testInfo.project.name;

    if (projectName === 'Desktop' || projectName === 'Laptop') {
      // On desktop/laptop, should have 2-column grid layout
      const gridContainer = page.locator('[class*="lg:grid"][class*="lg:grid-cols-2"]');
      await expect(gridContainer).toBeVisible();
    }

    // On all viewports, the CTA should be fixed at bottom
    const ctaSection = page.locator('[class*="fixed"][class*="bottom-0"]').last();
    await expect(ctaSection).toBeVisible();

    // Verify CTA is near the bottom of the viewport
    const ctaBox = await ctaSection.boundingBox();
    if (ctaBox && viewportSize) {
      // CTA should be within 150px of the bottom
      expect(viewportSize.height - (ctaBox.y + ctaBox.height)).toBeLessThan(150);
    }
  });
});
