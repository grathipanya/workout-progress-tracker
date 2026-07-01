import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // todo find a better way to check if user is authenticated
  useEffect(() => {
    // Check with the backend if a valid cookie session exists.
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/protected", {
          method: "GET",
          credentials: "include",
        });

        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    void checkAuthStatus();
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
