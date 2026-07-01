import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { SignInProps } from "../auth.types";

export const useSignIn = ({ email, password }: SignInProps) => {
  const login = useAuthStore((state) => state.login);
  const { setQueryData } = useQueryClient();

  const {
    mutate: signInMutation,
    isPending: signInPending,
    error: signInError,
    data: signInData,
  } = useMutation({
    mutationFn: () => signIn({ email, password }),
    onSuccess: (data) => {
      login();
      setQueryData(["user"], data);
    },
  });

  return { signInMutation, signInPending, signInError, signInData };
};
