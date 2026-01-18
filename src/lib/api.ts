/**
 * Central API export file
 * - Re-exports each modular API client
 * - Provides default Axios instance with interceptors
 */

// Modular APIs
export * from './api/auth.api';
export * from './api/payment.api';
export * from './api/sweetBonanza.api';
export * from './api/gatesOfOlympus.api';

// Default Axios Instance
export { default } from './api/index';

