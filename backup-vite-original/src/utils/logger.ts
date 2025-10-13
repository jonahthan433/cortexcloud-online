export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;
  private sessionId: string;

  constructor() {
    this.logLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;
    this.isDevelopment = import.meta.env.DEV;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` Error: ${entry.error.message}` : '';
    
    return `[${timestamp}] ${levelName}: ${entry.message}${contextStr}${errorStr}`;
  }

  private async sendToMonitoringService(entry: LogEntry): Promise<void> {
    if (this.isDevelopment) return;

    try {
      // In production, send to your monitoring service (Sentry, LogRocket, etc.)
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);

    // Console logging
    if (this.isDevelopment) {
      const formattedMessage = this.formatLogEntry(entry);
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage);
          break;
      }
    }

    // Send to monitoring service in production
    this.sendToMonitoringService(entry).catch(err => {
      console.error('Failed to send log entry:', err);
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // Specialized logging methods
  logUserAction(action: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      type: 'user_action',
      action,
      ...context
    });
  }

  logApiCall(method: string, url: string, status?: number, duration?: number, error?: Error): void {
    const context = {
      type: 'api_call',
      method,
      url,
      status,
      duration,
      success: !error && status && status >= 200 && status < 300
    };

    if (error || (status && status >= 400)) {
      this.error(`API call failed: ${method} ${url}`, error, context);
    } else {
      this.info(`API call: ${method} ${url}`, context);
    }
  }

  logPerformance(metric: string, value: number, context?: Record<string, any>): void {
    this.info(`Performance metric: ${metric}`, {
      type: 'performance',
      metric,
      value,
      ...context
    });
  }

  logErrorBoundary(error: Error, errorInfo: any): void {
    this.fatal('React Error Boundary caught error', error, {
      type: 'error_boundary',
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
  }

  logAuthentication(action: string, success: boolean, context?: Record<string, any>): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    this.log(level, `Authentication: ${action}`, {
      type: 'authentication',
      action,
      success,
      ...context
    });
  }

  logBusinessEvent(event: string, context?: Record<string, any>): void {
    this.info(`Business event: ${event}`, {
      type: 'business_event',
      event,
      ...context
    });
  }

  // Set user context for all subsequent logs
  setUserContext(userId: string, userEmail?: string): void {
    this.sessionId = `${this.sessionId}_user_${userId}`;
    // Store user context for future logs
    (this as any).userId = userId;
    (this as any).userEmail = userEmail;
  }

  // Clear user context
  clearUserContext(): void {
    delete (this as any).userId;
    delete (this as any).userEmail;
  }
}

export const logger = new Logger();

// React error boundary integration
export const logErrorBoundary = (error: Error, errorInfo: any) => {
  logger.logErrorBoundary(error, errorInfo);
};

// Performance monitoring
export const logPerformance = (metric: string, value: number, context?: Record<string, any>) => {
  logger.logPerformance(metric, value, context);
};

// API call monitoring
export const logApiCall = (method: string, url: string, status?: number, duration?: number, error?: Error) => {
  logger.logApiCall(method, url, status, duration, error);
};

// User action tracking
export const logUserAction = (action: string, context?: Record<string, any>) => {
  logger.logUserAction(action, context);
};

// Business event tracking
export const logBusinessEvent = (event: string, context?: Record<string, any>) => {
  logger.logBusinessEvent(event, context);
};
