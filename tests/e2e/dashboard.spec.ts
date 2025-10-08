import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real test, you'd set up test user session
    await page.goto('/dashboard');
  });

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should show quick stats
    await expect(page.locator('text=Total Leads')).toBeVisible();
    await expect(page.locator('text=Active Campaigns')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Conversion Rate')).toBeVisible();
  });

  test('should navigate between dashboard tabs', async ({ page }) => {
    // Test Overview tab
    await page.click('text=Overview');
    await expect(page.locator('[data-testid="overview-content"]')).toBeVisible();
    
    // Test CRM tab
    await page.click('text=CRM');
    await expect(page.locator('[data-testid="crm-content"]')).toBeVisible();
    
    // Test Automation tab
    await page.click('text=Automation');
    await expect(page.locator('[data-testid="automation-content"]')).toBeVisible();
    
    // Test Communications tab
    await page.click('text=Messages');
    await expect(page.locator('[data-testid="communications-content"]')).toBeVisible();
    
    // Test Calendar tab
    await page.click('text=Calendar');
    await expect(page.locator('[data-testid="calendar-content"]')).toBeVisible();
    
    // Test Settings tab
    await page.click('text=Settings');
    await expect(page.locator('[data-testid="settings-content"]')).toBeVisible();
  });

  test('should display plan selector', async ({ page }) => {
    await expect(page.locator('text=Current Plan')).toBeVisible();
    await expect(page.locator('text=Initiate')).toBeVisible();
  });

  test('should show plan-specific dashboard content', async ({ page }) => {
    // Should show Initiate plan dashboard by default
    await expect(page.locator('text=Lead Capture')).toBeVisible();
    await expect(page.locator('text=Website Builder')).toBeVisible();
    await expect(page.locator('text=Basic Automation')).toBeVisible();
  });

  test('should handle plan upgrade', async ({ page }) => {
    // Click upgrade button
    await page.click('text=Upgrade Plan');
    
    // Should show upgrade options
    await expect(page.locator('text=Elevate')).toBeVisible();
    await expect(page.locator('text=Custom')).toBeVisible();
    
    // Select Elevate plan
    await page.click('text=Upgrade to Elevate');
    
    // Should show upgrade prompt or redirect to checkout
    await expect(page.locator('text=Upgrade to Elevate')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    
    // Should show activity items
    await expect(page.locator('[data-testid="activity-item"]')).toHaveCount.greaterThan(0);
  });

  test('should display quick actions', async ({ page }) => {
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    
    // Should show action buttons
    await expect(page.locator('text=Create Lead Form')).toBeVisible();
    await expect(page.locator('text=New Campaign')).toBeVisible();
    await expect(page.locator('text=Schedule Meeting')).toBeVisible();
  });

  test('should handle lead capture builder', async ({ page }) => {
    // Navigate to lead capture tool
    await page.click('text=Lead Capture');
    
    // Should show form builder
    await expect(page.locator('text=Lead Capture Form Builder')).toBeVisible();
    await expect(page.locator('text=Form Preview')).toBeVisible();
    await expect(page.locator('text=Form Code')).toBeVisible();
    
    // Test adding a field
    await page.click('text=Add Field');
    await page.click('text=Text Input');
    
    // Should add new field
    await expect(page.locator('text=Text Field')).toBeVisible();
  });

  test('should handle website builder', async ({ page }) => {
    // Navigate to website builder
    await page.click('text=Website');
    
    // Should show website builder
    await expect(page.locator('text=Website Builder')).toBeVisible();
    await expect(page.locator('text=Page Preview')).toBeVisible();
    
    // Test adding a section
    await page.click('text=Add Section');
    await page.click('text=Hero Section');
    
    // Should add new section
    await expect(page.locator('text=Hero Section')).toBeVisible();
  });

  test('should handle basic automation builder', async ({ page }) => {
    // Navigate to automation builder
    await page.click('text=Automation');
    
    // Should show automation builder
    await expect(page.locator('text=Basic Automation Builder')).toBeVisible();
    await expect(page.locator('text=Workflow Preview')).toBeVisible();
    
    // Test creating automation
    await page.fill('input[placeholder="Enter automation name"]', 'Test Automation');
    await page.click('text=Add Trigger');
    await page.click('text=Form Submission');
    
    // Should add trigger
    await expect(page.locator('text=Form Submission')).toBeVisible();
  });

  test('should display feature gates for premium features', async ({ page }) => {
    // Navigate to automation tab
    await page.click('text=Automation');
    
    // Should show upgrade prompt for AI features
    await expect(page.locator('text=Upgrade to Elevate')).toBeVisible();
    
    // Navigate to communications tab
    await page.click('text=Messages');
    
    // Should show upgrade prompt for WhatsApp
    await expect(page.locator('text=Upgrade to Elevate')).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should show mobile navigation
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should show tablet layout
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Should show desktop layout
    await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
  });

  test('should handle error states', async ({ page }) => {
    // Mock network error
    await page.route('**/api/**', route => route.abort());
    
    // Should show error state
    await expect(page.locator('text=Something went wrong')).toBeVisible();
    
    // Should show retry button
    await expect(page.locator('text=Try Again')).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow network
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    // Should show loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('should persist user preferences', async ({ page }) => {
    // Change theme
    await page.click('[data-testid="theme-toggle"]');
    
    // Reload page
    await page.reload();
    
    // Theme should be persisted
    await expect(page.locator('[data-theme="dark"]')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should focus on different elements
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key on focused element
    await page.keyboard.press('Enter');
  });

  test('should handle search functionality', async ({ page }) => {
    // Navigate to CRM tab
    await page.click('text=CRM');
    
    // Use search
    await page.fill('input[placeholder="Search contacts..."]', 'John');
    
    // Should filter results
    await expect(page.locator('[data-testid="contact-item"]')).toHaveCount.greaterThan(0);
  });

  test('should handle data export', async ({ page }) => {
    // Navigate to CRM tab
    await page.click('text=CRM');
    
    // Click export button
    await page.click('text=Export');
    
    // Should trigger download
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });
});
