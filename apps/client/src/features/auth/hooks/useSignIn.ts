import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import type { SignInProps } from "../auth.types";

export const useSignIn = ({ email, password }: SignInProps) => {
  const { login } = useAuth();
  const { setQueryData } = useQueryClient();

  const {
    mutate: signInMutation,
    isPending: signInPending,
    error: signInError,
    data: signInData,
  } = useMutation({
    mutationFn: () => signIn({ email, password }),
    onSuccess: () => {
      login();
      setQueryData(["user"], signInData);
    },
  });

  return { signInMutation, signInPending, signInError, signInData };
};
