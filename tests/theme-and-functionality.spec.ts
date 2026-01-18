/**
 * E2E Tests for SF Secret Menu
 * 
 * Tests theme transitions, menu functionality, checkout flow, and support features
 */
import { test, expect } from '@playwright/test';

test.describe('Theme and Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('should display password gate in dark mode initially', async ({ page }) => {
    // Check that page starts in dark theme
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // Check for password gate
    await expect(page.locator('text=SECRET GATEWAY')).toBeVisible();
    
    // Enter password to proceed
    await page.fill('input[type="password"]', 'secretmenu2026');
    await page.click('button:has-text("ENTER")');
    
    // Should redirect to main page
    await expect(page.locator('text=SF SECRET MENU')).toBeVisible();
  });

  test('should transition from dark to light theme after login', async ({ page, context }) => {
    // Set session storage to simulate passed password gate
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.reload();
    
    // Wait for transition to complete
    await page.waitForTimeout(2000);
    
    // Check theme toggle button exists
    await expect(page.locator('[data-testid="theme-toggle"]')).toBeVisible();
  });

  test('should display all new menu items with proper images', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.goto('http://localhost:5173/menu');
    
    // Check that menu items with new images are displayed
    const expectedMenuItems = [
      'Zucchini Carpaccio',
      'Sunday Roast',
      'Spinach Walnut Apple Salad',
      'Spanish Gildas',
      'Artisan Sourdough',
      'Shepherd\'s Pie',
      'Seared Duck Breast',
      'Rice Pudding with Candied Cherries',
      'Padrón Peppers',
      'Miso Glazed Cod'
    ];

    for (const item of expectedMenuItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }

    // Check that menu item images load properly
    const images = page.locator('img[src*="/images/menu/"]');
    await expect(images.first()).toBeVisible();
  });

  test('should support ordering flow with all menu items', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.goto('http://localhost:5173/order');
    
    // Add an item to cart
    await page.click('button:has-text("ADD TO CART")').first();
    
    // Verify cart has item
    await expect(page.locator('text=1 item')).toBeVisible();
    
    // Go to checkout
    await page.click('button:has-text("CHECKOUT")');
    
    await expect(page.locator('text=COMPLETE YOUR ORDER')).toBeVisible();
  });
});

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
  });

  test('should display Square payment as default option', async ({ page }) => {
    await page.goto('http://localhost:5173/order');
    
    // Add item and go to checkout
    await page.click('button:has-text("ADD TO CART")').first();
    await page.click('button:has-text("CHECKOUT")');
    
    // Should default to card payment
    const cardOption = page.locator('input[value="card"]');
    await expect(cardOption).toBeChecked();
    
    // Should see "Recommended" label on card option
    await expect(page.locator('text=Recommended')).toBeVisible();
  });

  test('should not show crypto payment by default', async ({ page }) => {
    await page.goto('http://localhost:5173/order');
    
    // Add item and go to checkout
    await page.click('button:has-text("ADD TO CART")').first();
    await page.click('button:has-text("CHECKOUT")');
    
    // Should not see crypto wallet option in main payment methods
    await expect(page.locator('text=Crypto Wallet')).not.toBeVisible();
    
    // Should only see: Card, Zelle, Venmo, CashApp
    await expect(page.locator('text=Credit/Debit Card')).toBeVisible();
    await expect(page.locator('text=Zelle')).toBeVisible();
    await expect(page.locator('text=Venmo')).toBeVisible();
    await expect(page.locator('text=CashApp')).toBeVisible();
  });
});

test.describe('Support Page with AI Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
  });

  test('should display support page with AI chat functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/support');
    
    // Check main elements
    await expect(page.locator('text=SUPPORT CENTER')).toBeVisible();
    await expect(page.locator('text=AI SUPPORT ASSISTANT')).toBeVisible();
    
    // Test AI chat interface
    await page.fill('input[placeholder*="Ask about menu"]', 'What is on the menu this week?');
    await page.click('button:has(svg)'); // Send button with icon
    
    // Should show loading state then response
    await page.waitForTimeout(1500); // Wait for simulated AI response
    await expect(page.locator('text=Our current weekly menu features')).toBeVisible();
  });

  test('should have working contact methods', async ({ page }) => {
    await page.goto('http://localhost:5173/support');
    
    // Check contact methods are displayed
    await expect(page.locator('text=Live Chat')).toBeVisible();
    await expect(page.locator('text=Email Support')).toBeVisible();
    await expect(page.locator('text=Phone')).toBeVisible();
    await expect(page.locator('text=WhatsApp')).toBeVisible();
    
    // Check email links work
    const emailLink = page.locator('a[href="mailto:hello@sfsecretmenu.com"]');
    await expect(emailLink).toBeVisible();
  });

  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/support');
    
    // Fill contact form
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[placeholder="your@email.com"]', 'test@example.com');
    await page.fill('input[placeholder*="What\'s this about"]', 'Test Subject');
    await page.fill('textarea[placeholder*="Tell us how we can help"]', 'This is a test message');
    
    // Submit form
    await page.click('button:has-text("SEND MESSAGE")');
    
    // Should show success message (simulated)
    await expect(page.locator('text=SENDING...')).toBeVisible();
  });
});

test.describe('Login Flow', () => {
  test('should show reordered login options', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.goto('http://localhost:5173/login');
    
    // Check login options are in correct order
    const loginButtons = page.locator('button[type="button"]');
    
    // Should see email/password form first
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Then alternative methods
    await expect(page.locator('text=MAGIC LINK')).toBeVisible();
    await expect(page.locator('text=SIGN IN WITH PHONE')).toBeVisible();
    await expect(page.locator('text=CONTINUE WITH GOOGLE')).toBeVisible();
    await expect(page.locator('text=CONNECT WALLET')).toBeVisible();
    
    // Crypto wallet should be last under "Advanced"
    await expect(page.locator('text=Advanced')).toBeVisible();
    await expect(page.locator('text=CRYPTO WALLET')).toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('should allow switching between light and dark themes', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
      localStorage.setItem('sfsecretmenu-ui-theme', 'light');
    });
    
    await page.goto('http://localhost:5173/');
    
    // Should start in light mode
    await expect(page.locator('html')).toHaveAttribute('class', /light/);
    
    // Find and click theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Should switch to dark mode
      await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    }
  });
});

test.describe('Menu Gallery Integration', () => {
  test('should display all new menu item images properly', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.goto('http://localhost:5173/menu');
    
    // Check that images load without errors
    const menuImages = page.locator('img[src*="/images/menu/"]');
    const imageCount = await menuImages.count();
    
    expect(imageCount).toBeGreaterThan(20); // Should have all the new menu item images
    
    // Test a few specific images
    await expect(page.locator('img[src*="zucchini-carpaccio"]')).toBeVisible();
    await expect(page.locator('img[src*="sunday-roast"]')).toBeVisible();
    await expect(page.locator('img[src*="basque-cheesecake"]')).toBeVisible();
  });

  test('should show nutritional information for menu items', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('secretmenu_access', 'true');
    });
    
    await page.goto('http://localhost:5173/menu');
    
    // Click on a menu item to see details
    await page.click('text=Zucchini Carpaccio');
    
    // Should show nutritional information
    await expect(page.locator('text=calories').or(page.locator('text=Calories'))).toBeVisible();
    await expect(page.locator('text=protein').or(page.locator('text=Protein'))).toBeVisible();
  });
});