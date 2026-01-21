import { test, expect } from '@playwright/test';

test.describe('Order Page Buttons', () => {
  test('should be able to click Get Started buttons', async ({ page }) => {
    await page.goto('/order', { waitUntil: 'networkidle' });

    // Find all "Get Started" buttons
    const getStartedButtons = page.locator('button:has-text("Get Started")');

    // Should have at least 2 Get Started buttons (Everyday and House)
    await expect(getStartedButtons).toHaveCount(2);

    // Click the first Get Started button (Everyday Secret)
    await getStartedButtons.first().click();

    // Should navigate to checkout with plan parameter
    await expect(page).toHaveURL(/\/checkout\?plan=everyday/);
  });

  test('should be able to click Contact Us button', async ({ page }) => {
    await page.goto('/order', { waitUntil: 'networkidle' });

    // Find the "Contact Us" button (Luxe plan)
    const contactButton = page.locator('button:has-text("Contact Us")');
    await expect(contactButton).toBeVisible();

    // Click the Contact Us button
    await contactButton.click();

    // Should navigate to contact page
    await expect(page).toHaveURL(/\/contact/);
  });

  test('billing toggle should work', async ({ page }) => {
    await page.goto('/order', { waitUntil: 'networkidle' });

    // Check monthly is selected by default (should show $400)
    await expect(page.locator('text=$400')).toBeVisible();

    // Click weekly toggle
    await page.click('button:has-text("WEEKLY")');

    // Should now show weekly price ($100)
    await expect(page.locator('text=$100')).toBeVisible();
  });
});
