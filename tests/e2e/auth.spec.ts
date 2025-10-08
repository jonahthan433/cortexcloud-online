import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to login page', async ({ page }) => {
    // Click on login link in header
    await page.click('text=Sign In');
    
    // Should be on login page
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should navigate to register page', async ({ page }) => {
    // Click on register link in header
    await page.click('text=Get Started');
    
    // Should be on register page
    await expect(page).toHaveURL('/auth/register');
    await expect(page.locator('h1')).toContainText('Create Your Account');
  });

  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation errors on invalid email', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should show validation errors on empty register form', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill form with mismatched passwords
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show password mismatch error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show weak password error', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill form with weak password
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show weak password error
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label="Toggle password visibility"]');
    
    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await toggleButton.click();
    
    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    await toggleButton.click();
    
    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click "Create account" link
    await page.click('text=Create account');
    
    // Should be on register page
    await expect(page).toHaveURL('/auth/register');
    
    // Click "Sign in" link
    await page.click('text=Sign in');
    
    // Should be back on login page
    await expect(page).toHaveURL('/auth/login');
  });

  test('should handle Google OAuth button', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Google OAuth button should be present
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();
    
    // Button should be disabled if Google OAuth is not configured
    // (This would depend on your actual implementation)
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // This test would require mocking the authentication service
    // or using test credentials in a test environment
    
    await page.goto('/auth/login');
    
    // Fill valid credentials (these would need to be test credentials)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show loading state during authentication', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show loading state
    await expect(page.locator('text=Signing in...')).toBeVisible();
    
    // Button should be disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
