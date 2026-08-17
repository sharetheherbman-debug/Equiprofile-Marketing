// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import SchoolApp from "./SchoolApp";
import { getLoginUrl } from "@/const";
import "@/index.css";
import { RealtimeProvider } from "@/contexts/RealtimeContext";

// Initialize bootstrap modules (service worker, analytics) - MUST be imported before App
import { registerServiceWorker } from "@/bootstrap";
import { initializeAnalytics } from "@/analytics";

// Initialize admin toggle system - sets up console commands

// Import upgrade modal state
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

// Initialize service worker and analytics
registerServiceWorker();
initializeAnalytics();

// Load visual configuration for post-deployment customization
fetch("/visual-config.json")
  .then((res) => res.json())
  .then((config) => {
    // Store config globally for components to access
    (window as any).__VISUAL_CONFIG__ = config;
    // Optionally apply colors to CSS variables
    if (config.colors) {
      const root = document.documentElement;
      Object.entries(config.colors).forEach(([key, value]) => {
        root.style.setProperty(`--visual-${key}`, value as string);
      });
    }
  })
  .catch((err) => {
    // Visual config is optional - silently continue if not available
    if (process.env.NODE_ENV === "development") {
      console.log("Visual config not loaded, using defaults:", err.message);
    }
  });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry on rate-limit (429) or auth errors — retrying floods the server
      retry: (failureCount, error) => {
        if (error instanceof TRPCClientError) {
          const code = (error as any)?.data?.code;
          const httpStatus = (error as any)?.data?.httpStatus;
          if (
            code === "TOO_MANY_REQUESTS" ||
            code === "UNAUTHORIZED" ||
            code === "FORBIDDEN" ||
            code === "PAYMENT_REQUIRED" ||
            httpStatus === 402
          )
            return false;
        }
        return failureCount < 1;
      },
      staleTime: 60 * 1000, // 1 minute default stale time
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

const handleTrialLockError = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;

  const errorCode = error.data?.code;
  const httpStatus = error.data?.httpStatus;
  const messageText = error.message?.toLowerCase() ?? "";

  const isTrialLockError =
    errorCode === "PAYMENT_REQUIRED" ||
    httpStatus === 402 ||
    messageText.includes("trial expired") ||
    messageText.includes("trial has ended") ||
    messageText.includes("subscription expired") ||
    messageText.includes("subscription has expired") ||
    messageText.includes("subscription has ended");

  if (!isTrialLockError) return;

  const { open } = useUpgradeModal.getState();

  if (
    messageText.includes("trial") ||
    errorCode === "TRIAL_EXPIRED"
  ) {
    open("trial_expired", error.message);
  } else if (
    messageText.includes("subscription") ||
    errorCode === "SUBSCRIPTION_EXPIRED" ||
    errorCode === "SUBSCRIPTION_ENDED"
  ) {
    open("subscription_expired", error.message);
  } else {
    open("payment_required", error.message);
  }
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    handleTrialLockError(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    handleTrialLockError(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <SchoolApp />
      </RealtimeProvider>
    </QueryClientProvider>
  </trpc.Provider>,
);
