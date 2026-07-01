import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@package/ui/styles/global.css";
// import "./index.css";
import App from "./App.tsx";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof Error && error.message.includes("401")) {
        queryClient.clear();
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
