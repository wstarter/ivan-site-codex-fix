/**
 * WordPress SPA entry.
 *
 * Mounts the React app into #root inside the WordPress theme shell.
 * Does NOT use TanStack Start's document-level hydration — the WP theme owns
 * <html>, <head>, wp_head(), <body>, and wp_footer().
 *
 * Hardened for Phase 2Q:
 *  - Top-level ErrorBoundary + Suspense so a single bad route cannot
 *    black-screen the SPA (React error #474 leakage on direct URL loads).
 *  - Router default pending / error / notFound components.
 *  - Trailing-slash normalization before router boots (history.replaceState).
 *  - Runtime interaction unlocks around WP/browser navigation edges.
 */
import { Component, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { installInteractionSafetyNet, unlockBodyInteraction } from "./lib/interaction-safety";
import "./styles.css";

const queryClient = new QueryClient();

function WpLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#d4af37",
        fontFamily: "system-ui, sans-serif",
        fontSize: "0.95rem",
        letterSpacing: "0.08em",
        overflow: "auto",
        pointerEvents: "none",
        touchAction: "auto",
      }}
    >
      Učitavanje...
    </div>
  );
}

function WpErrorFallback({ message }: { message?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#d4af37",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
        overflow: "auto",
        touchAction: "auto",
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          Trenutno ne možemo da učitamo ovu stranicu
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#bfa14a", marginBottom: "1.25rem" }}>
          {message || "Pokušajte ponovo za nekoliko trenutaka."}
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "0.6rem 1.1rem",
            border: "1px solid #d4af37",
            color: "#d4af37",
            textDecoration: "none",
            letterSpacing: "0.08em",
            fontSize: "0.85rem",
          }}
        >
          POČETNA
        </a>
      </div>
    </div>
  );
}

class WpErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("[ivan-wp] render error", error);
  }
  render() {
    if (this.state.error) {
      return <WpErrorFallback message={this.state.error.message} />;
    }
    return this.props.children;
  }
}

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: WpLoadingFallback,
  defaultErrorComponent: ({ error }) => (
    <WpErrorFallback message={error?.message} />
  ),
  defaultNotFoundComponent: () => (
    <WpErrorFallback message="Stranica nije pronađena." />
  ),
});

installInteractionSafetyNet();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/** Normalize trailing slash before router boots — replaceState, no reload. */
function normalizeTrailingSlash() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const cleaned = pathname.replace(/\/+$/, "") || "/";
    try {
      window.history.replaceState(window.history.state, "", cleaned + search + hash);
    } catch {
      /* no-op: replaceState must never break the boot */
    }
  }
}

function mount() {
  unlockBodyInteraction();

  const el = document.getElementById("root");
  if (!el) {
    // eslint-disable-next-line no-console
    console.warn(
      '[ivan-wp] #root element not found. The WordPress theme must render <div id="root"></div> inside <body>.',
    );
    return;
  }

  normalizeTrailingSlash();
  unlockBodyInteraction();

  createRoot(el).render(
    <WpErrorBoundary>
      <Suspense fallback={<WpLoadingFallback />}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Suspense>
    </WpErrorBoundary>,
  );

  unlockBodyInteraction();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
