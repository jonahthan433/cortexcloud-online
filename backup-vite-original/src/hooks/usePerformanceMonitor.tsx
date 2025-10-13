import { useEffect, useRef, useCallback } from 'react';
import { logPerformance } from '@/utils/logger';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  userInteractionTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>(Date.now());
  const renderCountRef = useRef<number>(0);
  const lastRenderTimeRef = useRef<number>(Date.now());

  // Measure render time
  useEffect(() => {
    const renderTime = Date.now() - lastRenderTimeRef.current;
    renderCountRef.current += 1;
    
    if (renderCountRef.current > 1) {
      logPerformance(`${componentName}_render_time`, renderTime, {
        component: componentName,
        renderCount: renderCountRef.current
      });
    }
    
    lastRenderTimeRef.current = Date.now();
  });

  // Measure component mount time
  useEffect(() => {
    const mountTime = Date.now() - mountTimeRef.current;
    
    logPerformance(`${componentName}_mount_time`, mountTime, {
      component: componentName
    });
  }, []);

  // Measure memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      logPerformance(`${componentName}_memory_usage`, memoryUsage, {
        component: componentName,
        totalJSHeapSize: memory.totalJSHeapSize / 1024 / 1024,
        jsHeapSizeLimit: memory.jsHeapSizeLimit / 1024 / 1024
      });
    }
  }, []);

  // Measure user interaction time
  const measureInteraction = useCallback((interactionName: string, fn: () => void) => {
    const startTime = performance.now();
    
    try {
      fn();
    } finally {
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      
      logPerformance(`${componentName}_${interactionName}_time`, interactionTime, {
        component: componentName,
        interaction: interactionName
      });
    }
  }, [componentName]);

  return {
    measureInteraction
  };
};

// Hook for measuring API call performance
export const useApiPerformanceMonitor = () => {
  const measureApiCall = useCallback(async <T>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      logPerformance(`api_${apiName}_duration`, duration, {
        api: apiName,
        success: true
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      logPerformance(`api_${apiName}_duration`, duration, {
        api: apiName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }, []);

  return { measureApiCall };
};

// Hook for measuring page load performance
export const usePageLoadMonitor = (pageName: string) => {
  useEffect(() => {
    const measurePageLoad = () => {
      // Measure various performance metrics
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.navigationStart
        };

        Object.entries(metrics).forEach(([metric, value]) => {
          logPerformance(`page_${pageName}_${metric}`, value, {
            page: pageName,
            metric
          });
        });
      }

      // Measure Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library
        // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
      }
    };

    // Measure after page is fully loaded
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => window.removeEventListener('load', measurePageLoad);
    }
  }, [pageName]);
};

// Hook for measuring user interaction performance
export const useInteractionMonitor = (componentName: string) => {
  const measureClick = useCallback((elementName: string, fn: () => void) => {
    const startTime = performance.now();
    
    try {
      fn();
    } finally {
      const endTime = performance.now();
      const clickTime = endTime - startTime;
      
      logPerformance(`${componentName}_click_${elementName}`, clickTime, {
        component: componentName,
        element: elementName,
        interaction: 'click'
      });
    }
  }, [componentName]);

  const measureHover = useCallback((elementName: string, fn: () => void) => {
    const startTime = performance.now();
    
    try {
      fn();
    } finally {
      const endTime = performance.now();
      const hoverTime = endTime - startTime;
      
      logPerformance(`${componentName}_hover_${elementName}`, hoverTime, {
        component: componentName,
        element: elementName,
        interaction: 'hover'
      });
    }
  }, [componentName]);

  return {
    measureClick,
    measureHover
  };
};
