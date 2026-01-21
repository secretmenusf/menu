import { test, expect } from '@playwright/test';

// Define viewport sizes
const VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'Mobile' },
  tablet: { width: 768, height: 1024, name: 'Tablet' },
  desktop: { width: 1440, height: 900, name: 'Desktop' },
};

// Pages to test
const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/menu', name: 'Menu' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/signup', name: 'Signup' },
  { path: '/login', name: 'Login' },
  { path: '/faq', name: 'FAQ' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/gift-cards', name: 'Gift Cards' },
  { path: '/gift-meal-plan', name: 'Gift Meal Plan' },
  { path: '/referrals', name: 'Referrals' },
];

// Test each page at each viewport
PAGES.forEach((pageDef) => {
  Object.entries(VIEWPORTS).forEach(([viewportKey, viewport]) => {
    test(`${pageDef.name} - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to page
      await page.goto(pageDef.path, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});

      // Take screenshot
      const screenshot = await page.screenshot({ fullPage: true });

      // Attach screenshot to test report
      await test.info().attach(`${pageDef.name}-${viewport.name}`, {
        body: screenshot,
        contentType: 'image/png',
      });

      // Basic check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        const scrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        );
        const clientWidth = window.innerWidth;
        return scrollWidth > clientWidth + 10; // 10px tolerance
      });

      if (hasOverflow) {
        console.warn(`Layout warning on ${pageDef.name} (${viewport.name}): Horizontal overflow detected`);
      }

      // Verify page loaded
      const bodyContent = await page.locator('body').evaluate(el => el.children.length);
      expect(bodyContent).toBeGreaterThan(0);
    });
  });
});

