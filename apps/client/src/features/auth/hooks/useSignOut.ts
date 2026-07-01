import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export const useSignOut = () => {
  const { clear } = useQueryClient();
  const { logout } = useAuth();

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
