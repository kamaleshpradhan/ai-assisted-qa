import { APIRequestContext, APIResponse } from '@playwright/test';
import { envConfig } from '@config/env.config';

/**
 * API Client for making HTTP requests
 * Provides reusable methods for common API operations
 */
export class APIClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = envConfig.getApiURL();
  }

  /**
   * Perform GET request
   */
  async get(endpoint: string, options?: Record<string, unknown>): Promise<APIResponse> {
    return await this.request.get(`${this.baseURL}${endpoint}`, options);
  }

  /**
   * Perform POST request
   */
  async post(
    endpoint: string,
    data?: unknown,
    options?: Record<string, unknown>
  ): Promise<APIResponse> {
    return await this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * Perform PUT request
   */
  async put(
    endpoint: string,
    data?: unknown,
    options?: Record<string, unknown>
  ): Promise<APIResponse> {
    return await this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * Perform PATCH request
   */
  async patch(
    endpoint: string,
    data?: unknown,
    options?: Record<string, unknown>
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.baseURL}${endpoint}`, {
      data,
      ...options,
    });
  }

  /**
   * Perform DELETE request
   */
  async delete(endpoint: string, options?: Record<string, unknown>): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}${endpoint}`, options);
  }

  /**
   * Get response JSON data
   */
  async getResponseData(response: APIResponse): Promise<unknown> {
    return await response.json();
  }

  /**
   * Check if response is successful (2xx)
   */
  isSuccessful(response: APIResponse): boolean {
    return response.ok();
  }

  /**
   * Get response status code
   */
  getStatusCode(response: APIResponse): number {
    return response.status();
  }

  /**
   * Get response headers
   */
  getHeaders(response: APIResponse): Record<string, string> {
    return response.headers();
  }
}
