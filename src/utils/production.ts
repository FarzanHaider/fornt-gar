/**
 * Production utilities
 * Helper functions for production environment checks and optimizations
 */

/**
 * Check if we're in production mode
 */
export const isProduction = () => {
  return import.meta.env.PROD === true;
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = () => {
  return import.meta.env.DEV === true;
};

/**
 * Conditionally log only in development
 */
export const devLog = (...args: any[]) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

/**
 * Conditionally warn only in development
 */
export const devWarn = (...args: any[]) => {
  if (isDevelopment()) {
    console.warn(...args);
  }
};

/**
 * Error logging (always logs in production for monitoring)
 */
export const logError = (message: string, error?: any) => {
  if (isProduction()) {
    // In production, log errors for monitoring (you can send to error tracking service)
    console.error(`[ERROR] ${message}`, error || '');
    // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error || new Error(message));
    // }
  } else {
    // In development, full error logging
    console.error(`[ERROR] ${message}`, error);
  }
};

/**
 * Get API URL (with proper fallbacks)
 */
export const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || '';
  if (!url && isProduction()) {
    logError('VITE_API_URL environment variable is not set!');
  }
  return url;
};

