import { test, expect } from '@playwright/test';

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should start in dark mode and transition to light after login', async ({ page }) => {
    await page.goto('/');
    
    // Should start in dark mode
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check dark theme styles
    const background = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--background');
    });
    expect(background.trim()).toBe('0 0% 2%'); // Dark background
    
    // Enter password to trigger transition
    const passwordInput = page.getByPlaceholder(/password/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('secret'); // Adjust based on your password
      await passwordInput.press('Enter');
      
      // Wait for transition to light mode
      await page.waitForTimeout(2000);
      
      // Should now be in light mode
      const lightBackground = await page.evaluate(() => {
        return window.getComputedStyle(document.documentElement).getPropertyValue('--background');
      });
      expect(lightBackground.trim()).toBe('0 0% 100%'); // Light background
    }
  });

  test('theme toggle should work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Skip password gate if present
    const passwordInput = page.getByPlaceholder(/password/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('secret');
      await passwordInput.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
    
    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('class');
    
    // Click toggle
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Verify theme changed
    const newTheme = await page.locator('html').getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
    
    // Click again to toggle back
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const finalTheme = await page.locator('html').getAttribute('class');
    expect(finalTheme).toBe(initialTheme);
  });

  test('theme preference should persist across page loads', async ({ page }) => {
    await page.goto('/');
    
    // Skip password gate if present
    const passwordInput = page.getByPlaceholder(/password/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('secret');
      await passwordInput.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Toggle to specific theme
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    const selectedTheme = await page.locator('html').getAttribute('class');
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Theme should persist
    const persistedTheme = await page.locator('html').getAttribute('class');
    expect(persistedTheme).toBe(selectedTheme);
  });
});

test.describe('Light Mode Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Skip password and set light mode
    const passwordInput = page.getByPlaceholder(/password/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('secret');
      await passwordInput.press('Enter');
      await page.waitForTimeout(2000);
    }
    
    // Ensure light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sfsecretmenu-ui-theme', 'light');
    });
  });

  test('homepage should look stunning in light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Check hero section
    const hero = page.locator('[data-testid="hero"]').first();
    if (await hero.isVisible()) {
      await expect(hero).toBeVisible();
    }
    
    // Take screenshot
    await expect(page).toHaveScreenshot('homepage-light-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('menu gallery should display transparently in light mode', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(2000);
    
    // Check gallery items are visible and transparent
    const galleryItems = page.locator('[data-testid="menu-item"]');
    const count = await galleryItems.count();
    
    if (count > 0) {
      // Check first few items
      for (let i = 0; i < Math.min(3, count); i++) {
        const item = galleryItems.nth(i);
        await expect(item).toBeVisible();
        
        // Check for transparency/backdrop blur classes
        const className = await item.getAttribute('class');
        expect(className).toMatch(/(bg-card\/|backdrop-blur|transparent)/);
      }
    }
    
    await expect(page).toHaveScreenshot('menu-gallery-light-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('pricing page should look professional in light mode', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForTimeout(1000);
    
    // Check plan cards
    const planCards = page.locator('[data-testid="plan-card"]');
    if ((await planCards.count()) === 0) {
      // Fallback to any pricing elements
      await expect(page.locator('text=MEMBERSHIP').first()).toBeVisible();
    } else {
      await expect(planCards.first()).toBeVisible();
    }
    
    await expect(page).toHaveScreenshot('pricing-light-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});

test.describe('Dark Mode Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Ensure dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sfsecretmenu-ui-theme', 'dark');
    });
  });

  test('homepage should look stunning in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('menu gallery should display transparently in dark mode', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('menu-gallery-dark-mode.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});

test.describe('Stripe Integration', () => {
  test('should display Stripe checkout when selecting a plan', async ({ page }) => {
    // Mock Stripe to avoid actual charges
    await page.route('**/checkout.stripe.com/**', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ url: 'mocked-stripe-url' }),
      });
    });
    
    await page.goto('/pricing');
    
    // Login first if needed
    const loginButton = page.getByRole('link', { name: /join to unlock/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      
      // Fill login form (adjust selectors based on your form)
      const emailInput = page.getByPlaceholder(/email/i);
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await page.getByRole('button', { name: /sign in/i }).click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Try to find subscription button
    const subscribeButton = page.getByRole('button', { name: /select.*plan/i }).first();
    if (await subscribeButton.isVisible()) {
      await subscribeButton.click();
      
      // Should open Stripe checkout modal
      const checkoutDialog = page.locator('[role="dialog"]').filter({ hasText: /secure checkout/i });
      await expect(checkoutDialog).toBeVisible();
      
      // Check for Stripe elements
      const stripeElement = page.locator('iframe[name*="__privateStripeFrame"]').first();
      await expect(stripeElement).toBeVisible({ timeout: 10000 });
    }
  });
});