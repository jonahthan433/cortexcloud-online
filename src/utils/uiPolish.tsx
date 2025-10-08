import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { logger } from './logger';

// Consistent copy and messaging
export const UI_COPY = {
  // Common actions
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    submit: 'Submit',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    retry: 'Try Again',
    refresh: 'Refresh',
    loading: 'Loading...',
    processing: 'Processing...',
    success: 'Success!',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  },

  // Form labels and placeholders
  forms: {
    email: {
      label: 'Email Address',
      placeholder: 'Enter your email address',
      error: 'Please enter a valid email address'
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      error: 'Password must be at least 8 characters long',
      confirm: 'Confirm Password',
      confirmPlaceholder: 'Confirm your password',
      confirmError: 'Passwords do not match'
    },
    name: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      error: 'Please enter your full name'
    },
    company: {
      label: 'Company Name',
      placeholder: 'Enter your company name',
      error: 'Please enter your company name'
    },
    phone: {
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      error: 'Please enter a valid phone number'
    },
    message: {
      label: 'Message',
      placeholder: 'Enter your message',
      error: 'Please enter a message'
    }
  },

  // Navigation
  navigation: {
    home: 'Home',
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Sign In',
    register: 'Get Started'
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back!',
    overview: 'Overview',
    analytics: 'Analytics',
    reports: 'Reports',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    noData: 'No data available',
    loading: 'Loading dashboard...',
    error: 'Failed to load dashboard'
  },

  // Error messages
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'You do not have permission to access this resource.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
    timeout: 'Request timed out. Please try again.',
    rateLimit: 'Too many requests. Please wait a moment.'
  },

  // Success messages
  success: {
    saved: 'Changes saved successfully!',
    created: 'Created successfully!',
    updated: 'Updated successfully!',
    deleted: 'Deleted successfully!',
    sent: 'Message sent successfully!',
    uploaded: 'File uploaded successfully!',
    copied: 'Copied to clipboard!',
    exported: 'Export completed!'
  },

  // Loading states
  loading: {
    page: 'Loading page...',
    data: 'Loading data...',
    saving: 'Saving...',
    processing: 'Processing...',
    uploading: 'Uploading...',
    downloading: 'Downloading...',
    searching: 'Searching...',
    filtering: 'Filtering...'
  },

  // Empty states
  empty: {
    noResults: 'No results found',
    noData: 'No data available',
    noItems: 'No items to display',
    noNotifications: 'No notifications',
    noMessages: 'No messages',
    noFiles: 'No files uploaded'
  }
};

// Toast notification system
export const showToast = {
  success: (message: string, description?: string) => {
    toast({
      title: UI_COPY.actions.success,
      description: message,
      variant: 'default'
    });
    logger.info('Toast shown: success', { message, description });
  },

  error: (message: string, description?: string) => {
    toast({
      title: UI_COPY.actions.error,
      description: message,
      variant: 'destructive'
    });
    logger.error('Toast shown: error', new Error(message), { description });
  },

  warning: (message: string, description?: string) => {
    toast({
      title: UI_COPY.actions.warning,
      description: message,
      variant: 'default'
    });
    logger.warn('Toast shown: warning', { message, description });
  },

  info: (message: string, description?: string) => {
    toast({
      title: UI_COPY.actions.info,
      description: message,
      variant: 'default'
    });
    logger.info('Toast shown: info', { message, description });
  }
};

// Form validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Formatting helpers
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Accessibility helpers
export const getAriaLabel = (action: string, context?: string): string => {
  const baseLabel = UI_COPY.actions[action as keyof typeof UI_COPY.actions] || action;
  return context ? `${baseLabel} ${context}` : baseLabel;
};

export const getAriaDescribedBy = (elementId: string): string => {
  return `${elementId}-description`;
};

// Keyboard navigation helpers
export const handleKeyDown = (event: React.KeyboardEvent, handlers: {
  Enter?: () => void;
  Escape?: () => void;
  ArrowUp?: () => void;
  ArrowDown?: () => void;
  ArrowLeft?: () => void;
  ArrowRight?: () => void;
  Tab?: () => void;
  Space?: () => void;
}) => {
  switch (event.key) {
    case 'Enter':
      handlers.Enter?.();
      break;
    case 'Escape':
      handlers.Escape?.();
      break;
    case 'ArrowUp':
      handlers.ArrowUp?.();
      break;
    case 'ArrowDown':
      handlers.ArrowDown?.();
      break;
    case 'ArrowLeft':
      handlers.ArrowLeft?.();
      break;
    case 'ArrowRight':
      handlers.ArrowRight?.();
      break;
    case 'Tab':
      handlers.Tab?.();
      break;
    case ' ':
      handlers.Space?.();
      break;
  }
};

// Focus management helpers
export const focusFirstElement = (container: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

// Animation helpers
export const getAnimationClass = (type: 'fade' | 'slide' | 'scale' | 'bounce'): string => {
  const animations = {
    fade: 'animate-fade-in',
    slide: 'animate-slide-in',
    scale: 'animate-scale-in',
    bounce: 'animate-bounce-in'
  };
  return animations[type];
};

// Color helpers
export const getStatusColor = (status: 'success' | 'error' | 'warning' | 'info'): string => {
  const colors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return colors[status];
};

// Responsive helpers
export const getResponsiveClass = (breakpoint: 'sm' | 'md' | 'lg' | 'xl', className: string): string => {
  const breakpoints = {
    sm: 'sm:',
    md: 'md:',
    lg: 'lg:',
    xl: 'xl:'
  };
  return `${breakpoints[breakpoint]}${className}`;
};

// Theme helpers
export const getThemeClass = (theme: 'light' | 'dark' | 'auto'): string => {
  const themes = {
    light: 'light',
    dark: 'dark',
    auto: 'auto'
  };
  return themes[theme];
};

// Utility functions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Component helpers
export const getComponentProps = <T extends Record<string, any>>(
  props: T,
  exclude: (keyof T)[]
): Omit<T, keyof typeof exclude> => {
  const result = { ...props };
  exclude.forEach(key => delete result[key]);
  return result;
};

// Error boundary helpers
export const getErrorBoundaryFallback = (error: Error, retry: () => void) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-muted-foreground mb-4">{error.message}</p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      {UI_COPY.actions.retry}
    </button>
  </div>
);
