import { useQuery } from "@tanstack/react-query";
import { refreshToken } from "../api/auth.api";

export const useRefreshToken = () => {
  const {
    data: refreshTokenData,
    isLoading: refreshTokenPending,
    error: refreshTokenError,
    refetch: refreshTokenRefetch,
  } = useQuery({
    queryKey: ["refreshToken"],
    queryFn: async () => refreshToken(),
    enabled: false, // Disable automatic execution
  });

  return { refreshTokenPending, refreshTokenError, refreshTokenData, refreshTokenRefetch };
};
