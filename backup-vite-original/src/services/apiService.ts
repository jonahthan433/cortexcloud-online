import { logger, logApiCall } from '@/utils/logger';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private retryConfig: {
    maxRetries: number;
    retryDelay: number;
    retryCondition: (error: ApiError) => boolean;
  };

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryCondition: (error: ApiError) => {
        // Retry on network errors and 5xx server errors
        return error.status >= 500 || error.status === 0;
      }
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createApiError(response: Response, data?: any): ApiError {
    return {
      message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
      code: data?.code,
      details: data
    };
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    const startTime = performance.now();

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, requestOptions);
      const endTime = performance.now();
      const duration = endTime - startTime;

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      if (!response.ok) {
        const error = this.createApiError(response, responseData);
        logApiCall(method, fullUrl, response.status, duration, new Error(error.message));
        throw error;
      }

      logApiCall(method, fullUrl, response.status, duration);
      
      return {
        data: responseData,
        success: true,
        message: responseData.message
      };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        const networkError: ApiError = {
          message: 'Network error: Unable to connect to server',
          status: 0
        };
        logApiCall(method, fullUrl, 0, duration, error);
        throw networkError;
      }

      logApiCall(method, fullUrl, undefined, duration, error);
      throw error;
    }
  }

  private async makeRequestWithRetry<T>(
    method: string,
    url: string,
    data?: any,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    try {
      return await this.makeRequest<T>(method, url, data, options);
    } catch (error) {
      const apiError = error as ApiError;
      
      if (
        retryCount < this.retryConfig.maxRetries &&
        this.retryConfig.retryCondition(apiError)
      ) {
        logger.warn(`API request failed, retrying (${retryCount + 1}/${this.retryConfig.maxRetries})`, {
          method,
          url,
          error: apiError.message,
          retryCount: retryCount + 1
        });

        await this.delay(this.retryConfig.retryDelay * Math.pow(2, retryCount));
        return this.makeRequestWithRetry<T>(method, url, data, options, retryCount + 1);
      }

      throw error;
    }
  }

  async get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequestWithRetry<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequestWithRetry<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequestWithRetry<T>('PUT', url, data, options);
  }

  async patch<T>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequestWithRetry<T>('PATCH', url, data, options);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequestWithRetry<T>('DELETE', url, undefined, options);
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  updateRetryConfig(config: Partial<typeof this.retryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }
}

// Create default API service instance
export const apiService = new ApiService();

// Specialized API services
export class SupabaseApiService extends ApiService {
  constructor() {
    super();
    this.setHeader('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '');
  }

  async query<T>(table: string, options: {
    select?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<T[]>> {
    let url = `/${table}?`;
    
    if (options.select) {
      url += `select=${options.select}&`;
    }
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        url += `${key}=eq.${value}&`;
      });
    }
    
    if (options.order) {
      url += `order=${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}&`;
    }
    
    if (options.limit) {
      url += `limit=${options.limit}&`;
    }
    
    if (options.offset) {
      url += `offset=${options.offset}&`;
    }

    return this.get<T[]>(url);
  }

  async insert<T>(table: string, data: any): Promise<ApiResponse<T>> {
    return this.post<T>(`/${table}`, data);
  }

  async update<T>(table: string, id: string, data: any): Promise<ApiResponse<T>> {
    return this.patch<T>(`/${table}?id=eq.${id}`, data);
  }

  async delete<T>(table: string, id: string): Promise<ApiResponse<T>> {
    return this.delete<T>(`/${table}?id=eq.${id}`);
  }
}

export const supabaseApi = new SupabaseApiService();

// Error handling utilities
export const handleApiError = (error: ApiError): string => {
  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You are not authorized to perform this action. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 0:
      return 'Network error. Please check your connection and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Request interceptor for adding auth tokens
export const withAuth = (apiService: ApiService, getToken: () => string | null) => {
  const originalRequest = apiService.makeRequest.bind(apiService);
  
  apiService.makeRequest = async function<T>(method: string, url: string, data?: any, options: RequestInit = {}) {
    const token = getToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return originalRequest<T>(method, url, data, options);
  };
  
  return apiService;
};
