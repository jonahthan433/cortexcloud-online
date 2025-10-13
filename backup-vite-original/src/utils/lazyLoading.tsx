import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner, PageLoading, CardSkeleton, TableSkeleton, FormSkeleton } from '@/components/LoadingStates';

// Higher-order component for lazy loading with loading states
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Lazy loaded page components
export const LazyIndex = withLazyLoading(() => import('@/pages/Index'), () => <PageLoading />);
export const LazyDashboard = withLazyLoading(() => import('@/pages/Dashboard'), () => <PageLoading />);
export const LazyLogin = withLazyLoading(() => import('@/pages/Login'), () => <PageLoading />);
export const LazyRegister = withLazyLoading(() => import('@/pages/Register'), () => <PageLoading />);
export const LazyBooking = withLazyLoading(() => import('@/pages/Booking'), () => <PageLoading />);
export const LazyCheckout = withLazyLoading(() => import('@/pages/Checkout'), () => <PageLoading />);
export const LazyCheckoutSuccess = withLazyLoading(() => import('@/pages/CheckoutSuccess'), () => <PageLoading />);
export const LazyAIMentorship = withLazyLoading(() => import('@/pages/AIMentorship'), () => <PageLoading />);
export const LazyAdmin = withLazyLoading(() => import('@/pages/Admin'), () => <PageLoading />);
export const LazyAuthCallback = withLazyLoading(() => import('@/pages/AuthCallback'), () => <PageLoading />);
export const LazyNotFound = withLazyLoading(() => import('@/pages/NotFound'), () => <PageLoading />);

// Lazy loaded dashboard components
export const LazyInitiateDashboard = withLazyLoading(
  () => import('@/components/dashboard/InitiateDashboard'),
  () => <CardSkeleton />
);

export const LazyElevateDashboard = withLazyLoading(
  () => import('@/components/dashboard/ElevateDashboard'),
  () => <CardSkeleton />
);

export const LazyCustomDashboard = withLazyLoading(
  () => import('@/components/dashboard/CustomDashboard'),
  () => <CardSkeleton />
);

// Lazy loaded dashboard tabs
export const LazyOverviewTab = withLazyLoading(
  () => import('@/components/dashboard/OverviewTab'),
  () => <CardSkeleton />
);

export const LazyCRMTab = withLazyLoading(
  () => import('@/components/dashboard/CRMTab'),
  () => <TableSkeleton />
);

export const LazyAutomationTab = withLazyLoading(
  () => import('@/components/dashboard/AutomationTab'),
  () => <CardSkeleton />
);

export const LazyCommunicationsTab = withLazyLoading(
  () => import('@/components/dashboard/CommunicationsTab'),
  () => <CardSkeleton />
);

export const LazyCalendarTab = withLazyLoading(
  () => import('@/components/dashboard/CalendarTab'),
  () => <CardSkeleton />
);

export const LazySettingsTab = withLazyLoading(
  () => import('@/components/dashboard/SettingsTab'),
  () => <FormSkeleton />
);

// Lazy loaded tools
export const LazyLeadCaptureBuilder = withLazyLoading(
  () => import('@/components/dashboard/tools/LeadCaptureBuilder'),
  () => <FormSkeleton />
);

export const LazyWebsiteBuilder = withLazyLoading(
  () => import('@/components/dashboard/tools/WebsiteBuilder'),
  () => <CardSkeleton />
);

export const LazyBasicAutomationBuilder = withLazyLoading(
  () => import('@/components/dashboard/tools/BasicAutomationBuilder'),
  () => <FormSkeleton />
);

export const LazyAIAutomationBuilder = withLazyLoading(
  () => import('@/components/dashboard/tools/AIAutomationBuilder'),
  () => <FormSkeleton />
);

export const LazyWhatsAppConsole = withLazyLoading(
  () => import('@/components/dashboard/tools/WhatsAppConsole'),
  () => <CardSkeleton />
);

// Lazy loaded admin components
export const LazyBookingManager = withLazyLoading(
  () => import('@/components/admin/BookingManager'),
  () => <TableSkeleton />
);

export const LazyAvailabilityManager = withLazyLoading(
  () => import('@/components/admin/AvailabilityManager'),
  () => <FormSkeleton />
);

// Lazy loaded UI components (for heavy components)
export const LazyChart = withLazyLoading(
  () => import('@/components/ui/chart'),
  () => <div className="h-64 bg-muted animate-pulse rounded" />
);

export const LazyCalendar = withLazyLoading(
  () => import('@/components/ui/calendar'),
  () => <div className="h-64 bg-muted animate-pulse rounded" />
);

// Preload function for critical components
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc();
  };
};

// Preload critical components on user interaction
export const preloadCriticalComponents = () => {
  // Preload dashboard components when user hovers over dashboard link
  const preloadDashboard = preloadComponent(() => import('@/pages/Dashboard'));
  const preloadCRMTab = preloadComponent(() => import('@/components/dashboard/CRMTab'));
  const preloadAutomationTab = preloadComponent(() => import('@/components/dashboard/AutomationTab'));
  
  return {
    preloadDashboard,
    preloadCRMTab,
    preloadAutomationTab
  };
};

// Intersection Observer for lazy loading images
export const useLazyImage = (src: string, alt: string) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && src) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src]);

  return {
    imageRef: setImageRef,
    imageSrc,
    alt
  };
};

// Lazy image component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className, placeholder = '/placeholder.svg' }) => {
  const { imageRef, imageSrc } = useLazyImage(src, alt);

  return (
    <img
      ref={imageRef}
      src={imageSrc || placeholder}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Lazy list component with virtual scrolling
export const LazyList: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}> = ({ items, itemHeight, containerHeight, renderItem }) => {
  const { visibleItems, totalHeight, offsetY, setScrollTop } = useVirtualScrolling(
    items,
    itemHeight,
    containerHeight
  );

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Code splitting utilities
export const createAsyncComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return withLazyLoading(importFunc, fallback);
};

// Bundle analyzer helper (for development)
export const analyzeBundle = () => {
  if (import.meta.env.DEV) {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analyzer available');
    });
  }
};

// Performance monitoring for lazy loading
export const measureLazyLoadPerformance = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lazy_load', {
        component_name: componentName,
        load_time: loadTime
      });
    }
  };
};
