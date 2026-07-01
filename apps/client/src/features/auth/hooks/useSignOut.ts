import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export const useSignOut = () => {
  const { clear } = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  const {
    mutate: signOutMutation,
    isPending: signOutPending,
    error: signOutError,
    data: signOutData,
  } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      logout();
      clear();
    },
  });

  return { signOutMutation, signOutPending, signOutError, signOutData };
};
