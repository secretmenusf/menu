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

      // Allow animations to complete
      await page.waitForTimeout(300);

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

// Comprehensive mobile responsiveness test
test('Mobile viewport responsiveness check', async ({ page }) => {
  const mobileViewport = VIEWPORTS.mobile;
  await page.setViewportSize({ width: mobileViewport.width, height: mobileViewport.height });

  // Test home page
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Check for visible content
  const hasVisibleContent = await page.evaluate(() => {
    return document.body.offsetHeight > 0;
  });
  expect(hasVisibleContent).toBe(true);

  // Take full page screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('mobile-home-fullpage', {
    body: screenshot,
    contentType: 'image/png',
  });
});

// Tablet responsiveness test
test('Tablet viewport responsiveness check', async ({ page }) => {
  const tabletViewport = VIEWPORTS.tablet;
  await page.setViewportSize({ width: tabletViewport.width, height: tabletViewport.height });

  // Test home page
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const hasVisibleContent = await page.evaluate(() => {
    return document.body.offsetHeight > 0;
  });
  expect(hasVisibleContent).toBe(true);

  // Take full page screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('tablet-home-fullpage', {
    body: screenshot,
    contentType: 'image/png',
  });
});

// Desktop responsiveness test
test('Desktop viewport responsiveness check', async ({ page }) => {
  const desktopViewport = VIEWPORTS.desktop;
  await page.setViewportSize({ width: desktopViewport.width, height: desktopViewport.height });

  // Test home page
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const hasVisibleContent = await page.evaluate(() => {
    return document.body.offsetHeight > 0;
  });
  expect(hasVisibleContent).toBe(true);

  // Take full page screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('desktop-home-fullpage', {
    body: screenshot,
    contentType: 'image/png',
  });
});

// Viewport transition test - check if layout adapts when resizing
test('Viewport transition - resize from mobile to desktop', async ({ page }) => {
  // Start with mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const mobileScreenshot = await page.screenshot();
  await test.info().attach('transition-mobile', {
    body: mobileScreenshot,
    contentType: 'image/png',
  });

  // Resize to tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);

  const tabletScreenshot = await page.screenshot();
  await test.info().attach('transition-tablet', {
    body: tabletScreenshot,
    contentType: 'image/png',
  });

  // Resize to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);

  const desktopScreenshot = await page.screenshot();
  await test.info().attach('transition-desktop', {
    body: desktopScreenshot,
    contentType: 'image/png',
  });

  // Verify page is still functional
  const isVisible = await page.locator('body').isVisible();
  expect(isVisible).toBe(true);
});
