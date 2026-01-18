/**
 * Authentication API endpoints
 */

import api from "./index";

export const authAPI = {
  login: (emailOrUsername: string, password: string) => {
    // Backend expects email field (but email can be used as identifier)
    // If user provides username, we need to check if backend supports it
    // For now, send as email field (backend will handle validation)
    const loginPayload = { 
      email: emailOrUsername.trim().toLowerCase(), 
      password 
    };
    
    return api.post("/auth/login", loginPayload);
  },

  register: (userData: any) => 
    api.post("/auth/register", userData),

  logout: () => 
    api.post("/auth/logout"),

  // Canonical name
  me: () => 
    api.get("/auth/me"),

  // Backward-compatible alias
  getMe: () => 
    api.get("/auth/me"),

  forgotPassword: (email: string) => 
    api.post("/auth/forgot-password", { email }),

  // Backend expects confirmPassword too
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.post("/auth/reset-password", { token, password, confirmPassword }),

  // Backend route is POST /api/auth/refresh-token
  refresh: () => 
    api.post("/auth/refresh-token"),
};

