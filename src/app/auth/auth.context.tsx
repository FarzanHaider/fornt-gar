import React, { createContext, useContext, useEffect, useState } from "react";
import { checkSession } from "./auth.service";

export type AuthState = "loading" | "authenticated" | "guest";

const AuthContext = createContext<AuthState>("loading");

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    checkSession().then((ok) => {
      setState(ok ? "authenticated" : "guest");
    });
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
