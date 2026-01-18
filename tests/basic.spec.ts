import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=SECRET MENU')).toBeVisible();
});

test('Login has password gate', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('text=enter secret password')).toBeVisible();
});