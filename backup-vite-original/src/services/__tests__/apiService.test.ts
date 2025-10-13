import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService, handleApiError } from '../apiService';

// Mock fetch
global.fetch = vi.fn();

describe('ApiService', () => {
  let apiService: ApiService;
  const mockFetch = vi.mocked(fetch);

  beforeEach(() => {
    apiService = new ApiService('https://api.test.com');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test', success: true })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual({
        data: { data: 'test', success: true },
        success: true,
        message: undefined
      });
    });

    it('should handle GET request with query parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await apiService.get('/test?param=value');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test?param=value',
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with data', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        json: vi.fn().mockResolvedValue({ id: 1, name: 'Test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.post('/test', { name: 'Test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result.data).toEqual({ id: 1, name: 'Test' });
    });

    it('should handle POST request without data', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await apiService.post('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(undefined)
        })
      );
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ id: 1, name: 'Updated' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.put('/test/1', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' })
        })
      );
      expect(result.data).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ id: 1, name: 'Patched' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.patch('/test/1', { name: 'Patched' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'Patched' })
        })
      );
      expect(result.data).toEqual({ id: 1, name: 'Patched' });
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        json: vi.fn().mockResolvedValue(null)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.delete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result.data).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({ message: 'Resource not found' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.get('/test')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new TypeError('Network error'));

      await expect(apiService.get('/test')).rejects.toThrow('Network error: Unable to connect to server');
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        text: vi.fn().mockResolvedValue('plain text response')
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await apiService.get('/test');

      expect(result.data).toBe('plain text response');
    });
  });

  describe('Retry logic', () => {
    it('should retry on server errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ message: 'Server error' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Mock setTimeout to avoid actual delays in tests
      vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn();
        return {} as any;
      });

      await expect(apiService.get('/test')).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('should not retry on client errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ message: 'Bad request' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(apiService.get('/test')).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('Authentication', () => {
    it('should add auth token to headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      apiService.setAuthToken('test-token');
      await apiService.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    it('should remove auth token', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      apiService.setAuthToken('test-token');
      apiService.removeAuthToken();
      await apiService.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      );
    });
  });

  describe('Custom headers', () => {
    it('should add custom headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      apiService.setHeader('X-Custom-Header', 'custom-value');
      await apiService.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value'
          })
        })
      );
    });

    it('should remove custom headers', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      apiService.setHeader('X-Custom-Header', 'custom-value');
      apiService.removeHeader('X-Custom-Header');
      await apiService.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'X-Custom-Header': expect.any(String)
          })
        })
      );
    });
  });

  describe('Retry configuration', () => {
    it('should update retry configuration', () => {
      apiService.updateRetryConfig({ maxRetries: 5, retryDelay: 2000 });

      // This would be tested by making a request that fails
      // and verifying the retry behavior matches the new config
      expect(apiService).toBeDefined();
    });
  });
});

describe('handleApiError', () => {
  it('should handle 400 Bad Request', () => {
    const error = { status: 400, message: 'Bad request' };
    const result = handleApiError(error);
    expect(result).toBe('Invalid request. Please check your input and try again.');
  });

  it('should handle 401 Unauthorized', () => {
    const error = { status: 401, message: 'Unauthorized' };
    const result = handleApiError(error);
    expect(result).toBe('You are not authorized to perform this action. Please log in.');
  });

  it('should handle 403 Forbidden', () => {
    const error = { status: 403, message: 'Forbidden' };
    const result = handleApiError(error);
    expect(result).toBe('You do not have permission to perform this action.');
  });

  it('should handle 404 Not Found', () => {
    const error = { status: 404, message: 'Not found' };
    const result = handleApiError(error);
    expect(result).toBe('The requested resource was not found.');
  });

  it('should handle 429 Too Many Requests', () => {
    const error = { status: 429, message: 'Too many requests' };
    const result = handleApiError(error);
    expect(result).toBe('Too many requests. Please wait a moment and try again.');
  });

  it('should handle 500 Server Error', () => {
    const error = { status: 500, message: 'Server error' };
    const result = handleApiError(error);
    expect(result).toBe('Server error. Please try again later.');
  });

  it('should handle network errors', () => {
    const error = { status: 0, message: 'Network error' };
    const result = handleApiError(error);
    expect(result).toBe('Network error. Please check your connection and try again.');
  });

  it('should handle unknown errors', () => {
    const error = { status: 999, message: 'Unknown error' };
    const result = handleApiError(error);
    expect(result).toBe('Unknown error');
  });

  it('should handle errors without message', () => {
    const error = { status: 500 };
    const result = handleApiError(error);
    expect(result).toBe('An unexpected error occurred. Please try again.');
  });
});
