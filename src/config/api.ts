// API Configuration
// This file centralizes all API-related configuration for easy management

// Backend server URL - change this if your backend URL changes
export const API_BASE_URL = 'https://cadverse-backend.onrender.com';

// API endpoints - organized by feature for better maintainability
export const API_ENDPOINTS = {
  // Contact form endpoint
  contact: '/api/contact',
  
  // File upload endpoints - dynamic based on service type
  upload: (serviceType: string) => `/api/upload/${serviceType}`,
  
  // Health check endpoint to verify backend connectivity
  health: '/api/health'
};

// Service type mappings for file uploads
// These map frontend service names to backend-expected service types
export const SERVICE_TYPE_MAPPING = {
  // Make sure these match exactly with your service titles
  '2D Rough Sketch to 3D Modeling': '2d-to-3d',  // Maps to Google Drive: "Uploaded Projects/2D to 3D sketches"
  '3D Printing Service': '3d-printing'            // Maps to Google Drive: "Uploaded Projects/3D Printing Services"
};

// HTTP status codes for better error handling
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Default fetch options for all API calls
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add credentials if your backend requires authentication
  // credentials: 'include' as RequestCredentials
}