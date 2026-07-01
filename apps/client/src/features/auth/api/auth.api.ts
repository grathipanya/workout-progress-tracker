import type { SignInProps } from "../auth.types";

export const signIn = async ({ email, password }: SignInProps) => {
  const res = await fetch("http://localhost:3000/auth/sign-in", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Sign in failed");
  return res.json();
};

export const signOut = async () => {
  const res = await fetch("http://localhost:3000/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Sign out failed");
  return res.json();
};

export const refreshToken = async () => {
  const res = await fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
};
