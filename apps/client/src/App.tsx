// import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./App.css";

const App = () => {
  // const [count, setCount] = useState(0);

  return (
    <>
      <LoginComponent />
    </>
  );
};

export const LoginComponent = () => {
  const formData = {
    email: "mister.user@example.com",
    password: "password123",
  };

  // 1. Mutation for Signing In
  const loginMutation = useMutation({
    mutationFn: async () => {
      console.log("logging in...");
      const response = await fetch("http://localhost:3000/auth/sign-in", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Login failed");
      return response.json();
    },
    onSuccess: (data) => {
      console.log("login success:", data);
    },
    onError: (error) => {
      console.error("login error:", error.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("logging out...");
      const response = await fetch("http://localhost:3000/auth/sign-out", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: (data) => {
      console.log("logout success:", data);
    },
    onError: (error) => {
      console.error("logout error:", error.message);
    },
  });

  // 2. Query for the Protected Route (with inline 401 intercept & refresh)
  const { refetch, isFetching } = useQuery({
    queryKey: ["protectedData"],
    queryFn: async () => {
      console.log("accessing protected route...");

      // First attempt
      let response = await fetch("http://localhost:3000/protected", {
        method: "GET",
        credentials: "include",
      });

      // Intercept 401 Unauthorized
      if (response.status === 401) {
        console.log("Access token expired. Attempting token refresh...");

        const refreshResponse = await fetch("http://localhost:3000/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          throw new Error("Accessing protected route failed after refresh");
        }

        // Retry original request if refresh succeeded
        console.log("Token refreshed successfully. Retrying original request...");
        response = await fetch("http://localhost:3000/protected", {
          method: "GET",
          credentials: "include",
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: false, // Prevents running automatically on mount
    retry: false, // Prevents TanStack Query from doing extra background retries on error
  });

  // Triggered on button click
  const handleButtonClick = () => {
    loginMutation.mutate();
  };

  const handleLogoutButtonClick = () => {
    logoutMutation.mutate();
  };

  // Triggered on button click
  const handleProtectedRouteClick = async () => {
    const result = await refetch();

    console.log(result);

    if (result.data) {
      console.log("protected route data:", result.data);
    } else if (result.error) {
      console.error("protected route error:", result.error.message);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "logging in..." : "click me to log in"}
      </button>

      <button
        onClick={handleLogoutButtonClick}
        disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? "logging out..." : "click me to log out"}
      </button>

      <button
        onClick={handleProtectedRouteClick}
        disabled={isFetching}>
        {isFetching ? "accessing..." : "access protected route"}
      </button>
    </>
  );
};

export default App;
