import axios from "axios";

// API URL configuration - adapted for Vite (using import.meta.env instead of process.env)
const getAPIURL = () => {
  let url = '';
  
  // In Vite, environment variables must be prefixed with VITE_
  // Check for VITE_API_URL environment variable
  if (typeof window !== 'undefined') {
    // Client-side: check import.meta.env (Vite injects these at build time)
    url = import.meta.env.VITE_API_URL || '';
    
    // Debug: Log if URL is missing (only in browser console)
    if (!url && import.meta.env.PROD) {
      console.error('❌ VITE_API_URL is not set!');
      console.error('📝 Please set it in your deployment platform → Environment Variables');
      console.error('📝 Format: https://your-backend.onrender.com/api');
    }
  } else {
    // Server-side (if needed for SSR in future)
    url = import.meta.env.VITE_API_URL || '';
  }
  
  if (!url) {
    if (import.meta.env.PROD) {
      // In production, return empty string (will cause API calls to fail with clear error)
      return '';
    }
    // Development fallback - use environment variable or default to localhost
    const devUrl = import.meta.env.VITE_DEV_API_URL || "http://localhost:5000/api";
    return devUrl;
  }
  
  // Normalize the URL - ensure it ends with /api if it doesn't already
  // Remove trailing slash first
  url = url.trim().replace(/\/+$/, '');
  
  // If URL doesn't end with /api, add it
  // This handles cases where VITE_API_URL is set to just the domain
  if (!url.endsWith('/api')) {
    // Check if it already has /api in the path
    if (!url.includes('/api')) {
      url = `${url}/api`;
    }
  }
  
  return url;
};

const API_URL = getAPIURL();

// Validate API URL in production
if (import.meta.env.PROD && !API_URL) {
  console.error('CRITICAL: VITE_API_URL environment variable is not set!');
  console.error('Please set VITE_API_URL in your deployment platform settings.');
}

// Log API URL for debugging (only in development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('API Base URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false // We're using Bearer token, not cookies
});

// ---------------------------------------------
// Request Interceptor: Add token to Authorization header
// ---------------------------------------------
api.interceptors.request.use(
  (config) => {
    // Only add token if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && token !== 'cookie-auth') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------------------------------------------
// Response Interceptor: Comprehensive Error Handling
// ---------------------------------------------
api.interceptors.response.use(
  // Success path: just return the response
  (response) => response,
  
  // Error path: handle all error types
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Clear auth and redirect
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      // Clear invalid token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = "/";
        }
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        // If trying to access admin route without permission, redirect to home
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = "/";
        }
      }
    }

    // Handle network errors (no response from server)
    if (!error.response) {
      // Network error - server unreachable, CORS, timeout, etc.
      const networkError = {
        message: error.message || 'Network error occurred',
        code: error.code,
        timeout: error.code === 'ECONNABORTED',
        networkUnavailable: error.message?.includes('Network Error'),
      };

      // Only log critical errors in production
      if (import.meta.env.PROD) {
        if (error.code === 'ECONNABORTED') {
          console.error('API Request timeout - server may be slow or unreachable');
        } else if (error.message?.includes('Network Error')) {
          console.error('Network error - check your internet connection or API server status');
        }
      } else {
        console.error('API Network Error:', networkError);
      }

      // Enhance error object
      error.apiError = {
        url: originalRequest?.url,
        method: originalRequest?.method,
        timestamp: new Date().toISOString(),
        networkError: true,
        message: networkError.message,
      };

      return Promise.reject(error);
    }

    // Log error for debugging (response errors)
    const fullUrl = (originalRequest?.baseURL || '') + (originalRequest?.url || '');
    const errorInfo = {
      fullUrl,
      baseURL: originalRequest?.baseURL,
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    };
    
    if (import.meta.env.DEV) {
      console.error('API Error:', errorInfo);
    } else {
      // In production, log 404s to help debug routing issues
      if (error.response?.status === 404) {
        console.error('API 404 Error - Check if VITE_API_URL includes /api:', errorInfo);
      } else if (error.response?.status >= 500) {
        console.error('API Server Error:', error.response?.status, errorInfo.message);
      }
    }

    // Enhance error object with additional context
    error.apiError = {
      url: originalRequest?.url,
      method: originalRequest?.method,
      timestamp: new Date().toISOString(),
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };

    return Promise.reject(error);
  }
);

export default api;

