import "./App.css";
import { useAuthStore, useSignIn } from "./features/auth";
import { useRefreshToken } from "./features/auth/hooks/useRefreshToken";
import { useSignOut } from "./features/auth/hooks/useSignOut";

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      ---{isAuthenticated ? "you are logged in" : "you are not logged in"}---
      <LoginComponent />
    </>
  );
};

export const LoginComponent = () => {
  // const queryClient = useQueryClient();

  const formData = {
    email: "mister.user@example.com",
    password: "password123",
  };

  // const logoutMutation = useMutation({
  //   mutationFn: async () => {
  //     console.log("logging out...");
  //     const response = await fetch("http://localhost:3000/auth/sign-out", {
  //       method: "POST",
  //       credentials: "include",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) throw new Error("Logout failed");
  //     return response.json();
  //   },
  //   onSuccess: (data) => {
  //     console.log("logout success:", data);
  //     queryClient.removeQueries({ queryKey: ["protectedData"] });
  //   },
  //   onError: (error) => {
  //     console.error("logout error:", error.message);
  //   },
  // });

  // // 2. Query for the Protected Route (with inline 401 intercept & refresh)
  // const { refetch, isFetching } = useQuery({
  //   queryKey: ["protectedData"],
  //   queryFn: async () => {
  //     console.log("accessing protected route...");

  //     // First attempt
  //     let response = await fetch("http://localhost:3000/protected", {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     // Intercept 401 Unauthorized
  //     if (response.status === 401) {
  //       console.log("Access token expired. Attempting token refresh...");

  //       const refreshResponse = await fetch("http://localhost:3000/auth/refresh", {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       if (!refreshResponse.ok) {
  //         throw new Error("Accessing protected route failed after refresh");
  //       }

  //       // Retry original request if refresh succeeded
  //       console.log("Token refreshed successfully. Retrying original request...");
  //       response = await fetch("http://localhost:3000/protected", {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //     }

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     return response.json();
  //   },
  //   enabled: false, // Prevents running automatically on mount
  //   retry: false, // Prevents TanStack Query from doing extra background retries on error
  // });

  // // Triggered on button click
  const { signInMutation, signInPending } = useSignIn(formData);
  const { signOutMutation, signOutPending } = useSignOut();
  const { refreshTokenPending, refreshTokenError, refreshTokenData, refreshTokenRefetch } =
    useRefreshToken();

  // const handleLogoutButtonClick = () => {
  //   logoutMutation.mutate();
  // };

  // // Triggered on button click
  // const handleProtectedRouteClick = async () => {
  //   const result = await refetch();

  //   console.log(result);

  //   if (result.isError) {
  //     queryClient.removeQueries({ queryKey: ["protectedData"] });
  //     console.error(result.error);
  //     return;
  //   }

  //   if (result.isSuccess && result.data) {
  //     console.log(result.data);
  //   }
  // };

  return (
    <>
      <button
        onClick={() => signInMutation()}
        disabled={signInPending}>
        {signInPending ? "logging in..." : "click me to log in"}
      </button>

      <button
        onClick={() => refreshTokenRefetch()}
        disabled={refreshTokenPending}>
        {refreshTokenPending ? "refreshing token..." : "click me to refresh token"}
      </button>

      <button
        onClick={() => signOutMutation()}
        disabled={signOutPending}>
        {signOutPending ? "logging out..." : "click me to log out"}
      </button>

      {/* <button
        onClick={handleProtectedRouteClick}
        disabled={isFetching}>
        {isFetching ? "accessing..." : "access protected route"}
      </button> */}
    </>
  );
};

export default App;
