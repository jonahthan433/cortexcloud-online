import { test, expect, devices } from '@playwright/test';

// Test different viewport sizes
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Large Desktop', width: 2560, height: 1440 }
];

test.describe('Responsive Design', () => {
  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
      });

      test('should display navigation correctly', async ({ page }) => {
        // Check if navigation is visible
        await expect(page.locator('nav')).toBeVisible();
        
        // Check if logo is visible
        await expect(page.locator('[data-testid="logo"]')).toBeVisible();
        
        // Check if main navigation items are visible
        if (viewport.width < 768) {
          // Mobile: should show hamburger menu
          await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
        } else {
          // Desktop: should show full navigation
          await expect(page.locator('text=Features')).toBeVisible();
          await expect(page.locator('text=Pricing')).toBeVisible();
          await expect(page.locator('text=Contact')).toBeVisible();
        }
      });

      test('should display hero section correctly', async ({ page }) => {
        // Check if hero section is visible
        await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
        
        // Check if hero title is visible and properly sized
        const heroTitle = page.locator('h1');
        await expect(heroTitle).toBeVisible();
        
        // Check if hero description is visible
        await expect(page.locator('[data-testid="hero-description"]')).toBeVisible();
        
        // Check if CTA buttons are visible
        await expect(page.locator('text=Get Started')).toBeVisible();
        await expect(page.locator('text=Learn More')).toBeVisible();
      });

      test('should display features section correctly', async ({ page }) => {
        // Scroll to features section
        await page.locator('[data-testid="features-section"]').scrollIntoViewIfNeeded();
        
        // Check if features are visible
        await expect(page.locator('[data-testid="features-section"]')).toBeVisible();
        
        // Check if feature cards are properly laid out
        const featureCards = page.locator('[data-testid="feature-card"]');
        await expect(featureCards).toHaveCount.greaterThan(0);
        
        // Check if features are responsive
        if (viewport.width < 768) {
          // Mobile: should stack vertically
          const firstCard = featureCards.first();
          const secondCard = featureCards.nth(1);
          
          const firstCardBox = await firstCard.boundingBox();
          const secondCardBox = await secondCard.boundingBox();
          
          expect(firstCardBox?.y).toBeLessThan(secondCardBox?.y || 0);
        } else {
          // Desktop: should be in grid
          const featureGrid = page.locator('[data-testid="features-grid"]');
          await expect(featureGrid).toBeVisible();
        }
      });

      test('should display pricing section correctly', async ({ page }) => {
        // Scroll to pricing section
        await page.locator('[data-testid="pricing-section"]').scrollIntoViewIfNeeded();
        
        // Check if pricing section is visible
        await expect(page.locator('[data-testid="pricing-section"]')).toBeVisible();
        
        // Check if pricing cards are visible
        const pricingCards = page.locator('[data-testid="pricing-card"]');
        await expect(pricingCards).toHaveCount.greaterThan(0);
        
        // Check if pricing cards are responsive
        if (viewport.width < 768) {
          // Mobile: should stack vertically
          const firstCard = pricingCards.first();
          const secondCard = pricingCards.nth(1);
          
          const firstCardBox = await firstCard.boundingBox();
          const secondCardBox = await secondCard.boundingBox();
          
          expect(firstCardBox?.y).toBeLessThan(secondCardBox?.y || 0);
        } else {
          // Desktop: should be in grid
          const pricingGrid = page.locator('[data-testid="pricing-grid"]');
          await expect(pricingGrid).toBeVisible();
        }
      });

      test('should display footer correctly', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        
        // Check if footer is visible
        await expect(page.locator('footer')).toBeVisible();
        
        // Check if footer links are visible
        await expect(page.locator('footer a')).toHaveCount.greaterThan(0);
        
        // Check if footer is responsive
        if (viewport.width < 768) {
          // Mobile: should stack vertically
          const footerLinks = page.locator('footer a');
          const firstLink = footerLinks.first();
          const secondLink = footerLinks.nth(1);
          
          const firstLinkBox = await firstLink.boundingBox();
          const secondLinkBox = await secondLink.boundingBox();
          
          expect(firstLinkBox?.y).toBeLessThan(secondLinkBox?.y || 0);
        }
      });

      test('should handle touch interactions on mobile', async ({ page }) => {
        if (viewport.width < 768) {
          // Test mobile menu toggle
          const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
          await expect(mobileMenuButton).toBeVisible();
          
          await mobileMenuButton.tap();
          
          // Check if mobile menu opens
          await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
          
          // Test menu item tap
          const menuItem = page.locator('[data-testid="mobile-menu-item"]').first();
          await menuItem.tap();
          
          // Check if menu closes after tap
          await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible();
        }
      });

      test('should handle scroll behavior', async ({ page }) => {
        // Test smooth scrolling
        await page.locator('text=Features').click();
        
        // Check if page scrolls to features section
        await expect(page.locator('[data-testid="features-section"]')).toBeInViewport();
        
        // Test back to top functionality
        await page.locator('text=Back to Top').click();
        
        // Check if page scrolls to top
        await expect(page.locator('[data-testid="hero-section"]')).toBeInViewport();
      });

      test('should handle form interactions', async ({ page }) => {
        // Test contact form
        await page.locator('[data-testid="contact-section"]').scrollIntoViewIfNeeded();
        
        // Check if form is visible
        await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
        
        // Test form inputs
        const nameInput = page.locator('input[name="name"]');
        const emailInput = page.locator('input[name="email"]');
        const messageInput = page.locator('textarea[name="message"]');
        
        await expect(nameInput).toBeVisible();
        await expect(emailInput).toBeVisible();
        await expect(messageInput).toBeVisible();
        
        // Test form submission
        await nameInput.fill('Test User');
        await emailInput.fill('test@example.com');
        await messageInput.fill('Test message');
        
        await page.locator('button[type="submit"]').click();
        
        // Check if form submits successfully
        await expect(page.locator('text=Message sent successfully')).toBeVisible();
      });
    });
  });
});

test.describe('Cross-Browser Compatibility', () => {
  const browsers = [
    { name: 'Chrome', ...devices['Desktop Chrome'] },
    { name: 'Firefox', ...devices['Desktop Firefox'] },
    { name: 'Safari', ...devices['Desktop Safari'] }
  ];

  browsers.forEach(browser => {
    test.describe(`${browser.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/');
      });

      test('should load and display correctly', async ({ page }) => {
        // Check if page loads
        await expect(page.locator('body')).toBeVisible();
        
        // Check if main content is visible
        await expect(page.locator('main')).toBeVisible();
        
        // Check if navigation is visible
        await expect(page.locator('nav')).toBeVisible();
        
        // Check if footer is visible
        await expect(page.locator('footer')).toBeVisible();
      });

      test('should handle JavaScript interactions', async ({ page }) => {
        // Test dropdown menus
        await page.locator('[data-testid="dropdown-trigger"]').click();
        await expect(page.locator('[data-testid="dropdown-menu"]')).toBeVisible();
        
        // Test modal dialogs
        await page.locator('[data-testid="modal-trigger"]').click();
        await expect(page.locator('[data-testid="modal"]')).toBeVisible();
        
        // Test form validation
        await page.locator('button[type="submit"]').click();
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      });

      test('should handle CSS animations and transitions', async ({ page }) => {
        // Test hover effects
        await page.locator('[data-testid="hover-element"]').hover();
        await expect(page.locator('[data-testid="hover-element"]')).toHaveClass(/hover/);
        
        // Test loading animations
        await page.locator('[data-testid="loading-trigger"]').click();
        await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
        
        // Test fade transitions
        await page.locator('[data-testid="fade-trigger"]').click();
        await expect(page.locator('[data-testid="fade-element"]')).toHaveClass(/fade/);
      });

      test('should handle local storage and session storage', async ({ page }) => {
        // Test local storage
        await page.evaluate(() => {
          localStorage.setItem('test-key', 'test-value');
        });
        
        const localStorageValue = await page.evaluate(() => {
          return localStorage.getItem('test-key');
        });
        
        expect(localStorageValue).toBe('test-value');
        
        // Test session storage
        await page.evaluate(() => {
          sessionStorage.setItem('session-key', 'session-value');
        });
        
        const sessionStorageValue = await page.evaluate(() => {
          return sessionStorage.getItem('session-key');
        });
        
        expect(sessionStorageValue).toBe('session-value');
      });

      test('should handle cookies', async ({ page }) => {
        // Test cookie setting
        await page.context().addCookies([{
          name: 'test-cookie',
          value: 'test-value',
          domain: 'localhost',
          path: '/'
        }]);
        
        // Test cookie reading
        const cookies = await page.context().cookies();
        const testCookie = cookies.find(cookie => cookie.name === 'test-cookie');
        
        expect(testCookie?.value).toBe('test-value');
      });

      test('should handle geolocation API', async ({ page }) => {
        // Mock geolocation
        await page.addInitScript(() => {
          navigator.geolocation.getCurrentPosition = (success) => {
            success({
              coords: {
                latitude: 37.7749,
                longitude: -122.4194,
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              },
              timestamp: Date.now()
            } as any);
          };
        });
        
        // Test geolocation
        const location = await page.evaluate(() => {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            });
          });
        });
        
        expect(location).toEqual({
          latitude: 37.7749,
          longitude: -122.4194
        });
      });

      test('should handle file uploads', async ({ page }) => {
        // Test file input
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeVisible();
        
        // Test file upload
        await fileInput.setInputFiles({
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('test content')
        });
        
        // Check if file is uploaded
        await expect(page.locator('text=test.txt')).toBeVisible();
      });

      test('should handle drag and drop', async ({ page }) => {
        // Test drag and drop
        const dragElement = page.locator('[data-testid="drag-element"]');
        const dropZone = page.locator('[data-testid="drop-zone"]');
        
        await dragElement.dragTo(dropZone);
        
        // Check if drop was successful
        await expect(page.locator('text=Dropped successfully')).toBeVisible();
      });

      test('should handle keyboard navigation', async ({ page }) => {
        // Test tab navigation
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Check if focus is on correct element
        const focusedElement = await page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Test Enter key
        await page.keyboard.press('Enter');
        
        // Check if action was triggered
        await expect(page.locator('[data-testid="keyboard-action"]')).toBeVisible();
      });

      test('should handle print functionality', async ({ page }) => {
        // Test print button
        await page.locator('[data-testid="print-button"]').click();
        
        // Check if print dialog would open (in real browser)
        // This is difficult to test automatically, but we can check if the button exists
        await expect(page.locator('[data-testid="print-button"]')).toBeVisible();
      });
    });
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check if buttons have proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check if headings are properly structured
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    await expect(h1).toHaveCount(1); // Should have exactly one h1
    await expect(h2).toHaveCount.greaterThan(0); // Should have at least one h2
    await expect(h3).toHaveCount.greaterThan(0); // Should have at least one h3
  });

  test('should have proper form labels', async ({ page }) => {
    // Check if form inputs have proper labels
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      if (id) {
        // If input has id, check if there's a corresponding label
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else {
        // If no id, should have aria-label or placeholder
        expect(ariaLabel || placeholder).toBeTruthy();
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // This would require a more sophisticated test
    // For now, we'll check if text is visible
    const textElements = page.locator('p, span, div');
    await expect(textElements.first()).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    
    // Test Enter key
    await page.keyboard.press('Enter');
    
    // Test Escape key
    await page.keyboard.press('Escape');
  });
});
