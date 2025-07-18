// API Utility Functions
// This file contains reusable functions for making API calls

import { API_BASE_URL, DEFAULT_FETCH_OPTIONS, HTTP_STATUS } from '../config/api';

// Generic API response interface for type safety
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Custom error class for API-related errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic function to make API calls with proper error handling
 * @param endpoint - API endpoint (relative to base URL)
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise with parsed response data
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Construct full URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Merge default options with provided options
    const fetchOptions: RequestInit = {
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_FETCH_OPTIONS.headers,
        ...options.headers,
      },
    };

    console.log(`🌐 API Request Details:`);
    console.log(`📍 URL: ${url}`);
    console.log(`🔧 Method: ${fetchOptions.method || 'GET'}`);
    console.log(`📋 Headers:`, fetchOptions.headers);
    
    if (fetchOptions.body) {
      console.log(`📦 Request body type:`, {
        isFormData: fetchOptions.body instanceof FormData,
        isString: typeof fetchOptions.body === 'string',
        bodySize: fetchOptions.body instanceof FormData 
          ? 'FormData (multipart)' 
          : `${fetchOptions.body.toString().length} characters`
      });
    }
    
    console.log(`⏰ Request timestamp: ${new Date().toISOString()}`);
    
    const startTime = Date.now();
    
    // Make the API call
    const response = await fetch(url, fetchOptions);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`📥 API Response received in ${duration}ms:`);
    console.log(`📊 Response status: ${response.status} ${response.statusText}`);
    console.log(`✅ Response OK: ${response.ok}`);
    console.log(`📋 Response headers:`, {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });
    
    // Parse response as JSON
    let responseData;
    try {
      const responseText = await response.text();
      console.log(`📄 Raw response text (first 200 chars):`, responseText.substring(0, 200));
      
      if (responseText) {
        responseData = JSON.parse(responseText);
      } else {
        responseData = {
          success: response.ok,
          message: response.ok ? 'Success' : 'Request failed'
        };
      }
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      // If response is not JSON, create a generic response
      responseData = {
        success: response.ok,
        message: response.ok ? 'Success' : 'Request failed',
        error: 'Invalid JSON response from server'
      };
    }
    
    console.log(`📋 Parsed response data:`, responseData);
    
    // Handle non-2xx responses
    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}:`, {
        status: response.status,
        statusText: response.statusText,
        url: url,
        responseData: responseData
      });
      
      throw new ApiError(
        responseData.error || responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData
      );
    }
    
    console.log(`✅ API call successful:`, {
      endpoint: endpoint,
      duration: `${duration}ms`,
      success: responseData.success
    });
    
    return responseData;
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error - please check your internet connection and try again',
        0
      );
    }
    
    // Generic error fallback
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Helper function for GET requests
 */
export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

/**
 * Helper function for POST requests with JSON data
 */
export async function apiPost<T = any>(
  endpoint: string,
  data: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Helper function for POST requests with FormData (file uploads)
 * This function handles multipart/form-data uploads properly
 */
export async function apiPostFormData<T = any>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  console.log('📤 FormData upload preparation:');
  console.log('🎯 Upload endpoint:', endpoint);
  console.log('📦 FormData details:', {
    endpoint,
    hasFormData: formData instanceof FormData,
    totalEntries: Array.from(formData.entries()).length
  });
  
  // Log FormData entries for debugging
  const formDataEntries = Array.from(formData.entries()).map(([key, value]) => ({
    key,
    value: value instanceof File ? {
      fileName: value.name,
      fileSize: value.size,
      fileSizeInMB: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: value.type,
      lastModified: new Date(value.lastModified).toISOString()
    } : value
  }));
  
  console.log('📋 FormData entries:', formDataEntries);
  
  // Validate FormData before sending
  if (!formData || Array.from(formData.entries()).length === 0) {
    console.error('❌ FormData validation failed: Empty or invalid FormData');
    throw new ApiError('No file data to upload', 400);
  }
  
  // Check if file exists in FormData
  const fileEntry = formData.get('file');
  if (!fileEntry || !(fileEntry instanceof File)) {
    console.error('❌ FormData validation failed: No file found in FormData');
    throw new ApiError('No file found in upload data', 400);
  }
  
  console.log('✅ FormData validation passed:', {
    fileName: fileEntry.name,
    fileSize: `${(fileEntry.size / 1024 / 1024).toFixed(2)} MB`,
    fileType: fileEntry.type
  });
  
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      // IMPORTANT: Don't set Content-Type for FormData 
      // Browser will automatically set it with proper boundary
      // Remove any Content-Type header to let browser handle it
      'Accept': 'application/json',
      // Remove Content-Type to let browser set multipart boundary
    },
  });
}

/**
 * Function to test backend connectivity
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await apiGet('/api/health');
    return response.success;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}