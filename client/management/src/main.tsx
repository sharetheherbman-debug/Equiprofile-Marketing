// Copyright (c) 2025-2026 Amarktai Network. All rights reserved.
import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import ManagementApp from "./ManagementApp";
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
      // Disable automatic refetch on window focus globally to prevent request
      // storms when users switch tabs. Sensitive queries (auth.me) opt back in
      // explicitly with refetchOnWindowFocus: true at the call site.
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

  // Check for trial lock error codes returned by the middleware,
  // TRPC PAYMENT_REQUIRED code, or message-based fallback detection
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

  // Open upgrade modal with the appropriate reason
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
      async fetch(input, init) {
        const response = await globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });

        // If the server returns a non-JSON response (e.g. nginx/Express HTML 413
        // page), tRPC's batch parser will crash with "Unexpected token '<'".
        // Also intercept JSON 413 responses from Express — the Express body-parser
        // returns {"error":"..."} which is not a valid tRPC batch array, causing
        // tRPC to throw "Unable to transform response from server".
        // Detect both cases early and synthesise a parseable JSON error response
        // so the calling mutation receives a proper TRPCClientError instead of
        // an unhandled JS exception.
        const contentType = response.headers.get("content-type") ?? "";
        if (!response.ok && (response.status === 413 || !contentType.includes("application/json"))) {
          let message = "Request failed";
          if (response.status === 413) {
            message = "File too large. Maximum upload size is 10MB.";
          }
          // ⚠️  INTENTIONAL HTTP 200 WORKAROUND — DO NOT CHANGE WITHOUT REVIEW
          // tRPC's httpBatchLink reads the response body ONLY when the HTTP
          // status is 2xx.  If we forward the original non-2xx status, the
          // link skips body parsing entirely and surfaces a generic network
          // error, hiding the actual message (e.g. "File too large").
          // By re-wrapping in a 200 response we force the link to parse the
          // JSON error payload from the batch array item, giving the UI a
          // meaningful error string.
          // Side effect: HTTP access logs will record a 200 for these requests.
          // Use the `data.code` / `data.httpStatus` fields in the tRPC error
          // object to distinguish real successes from forwarded errors.
          const body = JSON.stringify([
            {
              error: {
                message,
                code: -32000,
                data: {
                  code:
                    response.status === 413 ? "PAYLOAD_TOO_LARGE" : "INTERNAL_SERVER_ERROR",
                  httpStatus: response.status,
                },
              },
            },
          ]);
          return new Response(body, {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }

        return response;
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <ManagementApp />
      </RealtimeProvider>
    </QueryClientProvider>
  </trpc.Provider>,
);
