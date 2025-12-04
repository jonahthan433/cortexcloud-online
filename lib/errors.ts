/**
 * Standardized error handling utilities
 * Provides consistent error responses and logging
 */

import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

/**
 * Handle errors and return appropriate NextResponse
 */
export function handleError(error: unknown): NextResponse {
  // Log error in development or if it's a server error
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (error instanceof AppError) {
    if (error.statusCode >= 500 || isDevelopment) {
      console.error(`[${error.name}] ${error.message}`, {
        code: error.code,
        statusCode: error.statusCode,
      });
    }
    
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Unknown errors - don't expose details in production
  if (isDevelopment) {
    console.error('Unexpected error:', error);
  } else {
    console.error('Unexpected error:', error instanceof Error ? error.message : 'Unknown error');
  }

  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Wrap async route handlers with error handling
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleError(error);
    }
  };
}

