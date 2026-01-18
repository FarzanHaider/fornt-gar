import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "./auth.context";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard for protected routes.
 * Uses auth context to check authentication state.
 * Shows nothing while loading, redirects to /signin if not authenticated.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const authState = useAuthState();

  // If auth is still loading, render null (prevents flash)
  if (authState === "loading") return null;

  // If user is not authenticated, redirect to signin
  if (authState === "guest") return <Navigate to="/signin" replace />;

  // Authenticated, render protected page
  return <>{children}</>;
};

export default AuthGuard;
