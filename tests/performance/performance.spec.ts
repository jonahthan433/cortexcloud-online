import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should load page within performance budget', async ({ page }) => {
    // Measure page load time
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test('should have good First Input Delay (FID)', async ({ page }) => {
    // Measure First Input Delay
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.processingStart - firstEntry.startTime);
        }).observe({ entryTypes: ['first-input'] });
      });
    });

    // FID should be under 100ms
    expect(fid).toBeLessThan(100);
  });

  test('should have good Cumulative Layout Shift (CLS)', async ({ page }) => {
    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });

    // CLS should be under 0.1
    expect(cls).toBeLessThan(0.1);
  });

  test('should have good First Contentful Paint (FCP)', async ({ page }) => {
    // Measure First Contentful Paint
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          resolve(firstEntry.startTime);
        }).observe({ entryTypes: ['paint'] });
      });
    });

    // FCP should be under 1.8 seconds
    expect(fcp).toBeLessThan(1800);
  });

  test('should have good Time to Interactive (TTI)', async ({ page }) => {
    // Measure Time to Interactive
    const tti = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['longtask'] });
      });
    });

    // TTI should be under 3.8 seconds
    expect(tti).toBeLessThan(3800);
  });

  test('should have good Speed Index', async ({ page }) => {
    // Measure Speed Index (approximation)
    const speedIndex = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.domContentLoadedEventEnd - navigation.navigationStart;
    });

    // Speed Index should be under 3.4 seconds
    expect(speedIndex).toBeLessThan(3400);
  });

  test('should have good Total Blocking Time (TBT)', async ({ page }) => {
    // Measure Total Blocking Time
    const tbt = await page.evaluate(() => {
      return new Promise((resolve) => {
        let tbtValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              tbtValue += entry.duration - 50;
            }
          }
          resolve(tbtValue);
        }).observe({ entryTypes: ['longtask'] });
      });
    });

    // TBT should be under 200ms
    expect(tbt).toBeLessThan(200);
  });

  test('should have good resource loading performance', async ({ page }) => {
    // Measure resource loading times
    const resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0
      }));
    });

    // Check if any resources are taking too long
    const slowResources = resources.filter(resource => resource.duration > 1000);
    expect(slowResources).toHaveLength(0);

    // Check if any resources are too large
    const largeResources = resources.filter(resource => resource.size > 1024 * 1024); // 1MB
    expect(largeResources).toHaveLength(0);
  });

  test('should have good memory usage', async ({ page }) => {
    // Measure memory usage
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryInfo) {
      // Memory usage should be reasonable
      const memoryUsageMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
      expect(memoryUsageMB).toBeLessThan(100); // Less than 100MB
    }
  });

  test('should have good network performance', async ({ page }) => {
    // Measure network performance
    const networkInfo = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        load: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    // DNS lookup should be fast
    expect(networkInfo.dns).toBeLessThan(100);

    // TCP connection should be fast
    expect(networkInfo.tcp).toBeLessThan(200);

    // Request should be fast
    expect(networkInfo.request).toBeLessThan(500);

    // Response should be fast
    expect(networkInfo.response).toBeLessThan(1000);

    // DOM processing should be fast
    expect(networkInfo.dom).toBeLessThan(1000);

    // Load event should be fast
    expect(networkInfo.load).toBeLessThan(500);
  });

  test('should have good rendering performance', async ({ page }) => {
    // Measure rendering performance
    const renderingInfo = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
      
      return {
        fcp: fcp?.startTime || 0,
        lcp: lcp?.startTime || 0
      };
    });

    // First Contentful Paint should be fast
    expect(renderingInfo.fcp).toBeLessThan(1800);

    // Largest Contentful Paint should be fast
    expect(renderingInfo.lcp).toBeLessThan(2500);
  });

  test('should have good JavaScript performance', async ({ page }) => {
    // Measure JavaScript execution time
    const jsInfo = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    // DOM content loaded should be fast
    expect(jsInfo.domContentLoaded).toBeLessThan(500);

    // Load complete should be fast
    expect(jsInfo.loadComplete).toBeLessThan(500);
  });

  test('should have good image loading performance', async ({ page }) => {
    // Measure image loading performance
    const imageInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const images = resources.filter(resource => 
        resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
      );
      
      return images.map(image => ({
        name: image.name,
        duration: image.duration,
        size: image.transferSize || 0
      }));
    });

    // Images should load quickly
    const slowImages = imageInfo.filter(image => image.duration > 1000);
    expect(slowImages).toHaveLength(0);

    // Images should be optimized
    const largeImages = imageInfo.filter(image => image.size > 500 * 1024); // 500KB
    expect(largeImages).toHaveLength(0);
  });

  test('should have good CSS loading performance', async ({ page }) => {
    // Measure CSS loading performance
    const cssInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const cssFiles = resources.filter(resource => 
        resource.name.match(/\.css$/i)
      );
      
      return cssFiles.map(css => ({
        name: css.name,
        duration: css.duration,
        size: css.transferSize || 0
      }));
    });

    // CSS files should load quickly
    const slowCss = cssInfo.filter(css => css.duration > 500);
    expect(slowCss).toHaveLength(0);

    // CSS files should be reasonable size
    const largeCss = cssInfo.filter(css => css.size > 200 * 1024); // 200KB
    expect(largeCss).toHaveLength(0);
  });

  test('should have good JavaScript loading performance', async ({ page }) => {
    // Measure JavaScript loading performance
    const jsInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const jsFiles = resources.filter(resource => 
        resource.name.match(/\.js$/i)
      );
      
      return jsFiles.map(js => ({
        name: js.name,
        duration: js.duration,
        size: js.transferSize || 0
      }));
    });

    // JavaScript files should load quickly
    const slowJs = jsInfo.filter(js => js.duration > 1000);
    expect(slowJs).toHaveLength(0);

    // JavaScript files should be reasonable size
    const largeJs = jsInfo.filter(js => js.size > 500 * 1024); // 500KB
    expect(largeJs).toHaveLength(0);
  });

  test('should have good caching performance', async ({ page }) => {
    // Test caching performance
    await page.goto('/');
    
    // Reload the page to test caching
    await page.reload({ waitUntil: 'networkidle' });
    
    // Measure second load time
    const secondLoadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    // Second load should be faster due to caching
    expect(secondLoadTime).toBeLessThan(2000);
  });

  test('should have good mobile performance', async ({ page }) => {
    // Test mobile performance
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Measure mobile load time
    const mobileLoadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    // Mobile should load within 3 seconds
    expect(mobileLoadTime).toBeLessThan(3000);
  });

  test('should have good slow network performance', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });

    await page.goto('/');

    // Measure slow network load time
    const slowLoadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });

    // Should still load within reasonable time
    expect(slowLoadTime).toBeLessThan(10000);
  });

  test('should have good CPU performance', async ({ page }) => {
    // Measure CPU usage
    const cpuInfo = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domProcessing: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadProcessing: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    // DOM processing should be efficient
    expect(cpuInfo.domProcessing).toBeLessThan(500);

    // Load processing should be efficient
    expect(cpuInfo.loadProcessing).toBeLessThan(500);
  });
});
