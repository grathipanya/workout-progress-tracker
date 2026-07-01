import { useState } from "react";
import type { User } from "@database/generated/prisma/client";

export const useAuthController = () => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const signIn = async (email: string, password: string) => {
    // fetch logic
  };

  const refresh = async () => {
    // fetch logic
  };

  const signOut = async () => {
    // mutation logic
  };

  return {
    signIn,
    refresh,
    signOut,
    fetchLoading,
    fetchError,
  };
};
