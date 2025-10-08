import { test, expect } from '@playwright/test';

test.describe('Core User Flows', () => {
  test('should allow user to sign up and start trial', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to pricing
    await page.click('text=Pricing');
    
    // Start trial for Initiate plan
    await page.click('text="Start Free Trial"');
    
    // Fill out trial form
    await page.fill('input[id="fullName"]', 'Test User');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.fill('input[id="company"]', 'Test Company');
    await page.fill('input[id="phone"]', '1234567890');
    
    // Submit form
    await page.click('button:has-text("Start Free Trial")');
    
    // Verify success
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('should allow user to navigate dashboard', async ({ page }) => {
    // TODO: Add authentication
    await page.goto('/dashboard');
    
    // Verify main sections
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=CRM')).toBeVisible();
    await expect(page.locator('text=Automation')).toBeVisible();
    await expect(page.locator('text=Communications')).toBeVisible();
    await expect(page.locator('text=Calendar')).toBeVisible();
    
    // Test tab navigation
    await page.click('text=CRM');
    await expect(page.locator('text="CRM & Pipeline Management"')).toBeVisible();
    
    await page.click('text=Automation');
    await expect(page.locator('text="Automation Builder"')).toBeVisible();
  });
});