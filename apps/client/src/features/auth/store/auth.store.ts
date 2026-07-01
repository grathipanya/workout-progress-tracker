import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  isAuthenticated: boolean;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      loading: true,
      checkAuthStatus: async () => {
        set({ loading: true });

        try {
          const response = await fetch("http://localhost:3000/protected", {
            method: "GET",
            credentials: "include",
          });

          set({ isAuthenticated: response.ok });
        } catch {
          set({ isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
