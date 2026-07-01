import { useState, useEffect } from "react";
import type { PropsWithChildren } from "react";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check with the backend if a valid cookie session exists
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/protected", {
          method: "GET",
          // CRITICAL: Tells the browser to send cookies with cross-origin requests
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  console.log(isAuthenticated, loading);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
