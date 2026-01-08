import type { Component } from "solid-js";
import { createSignal, createEffect, Show } from "solid-js";
import { Router, Route } from "@solidjs/router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleHistory from "./pages/VehicleHistory";
import { api, getCookie, setCookie, removeCookie } from "./services/api";

const AuthGuard: Component<{ children: any }> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean | null>(
    null,
  );
  const [isLoading, setIsLoading] = createSignal(true);

  createEffect(async () => {
    // First, check if we have a valid local JWT token
    const existingToken = getCookie("tsm");

    console.log("AuthGuard: tsm cookie:", existingToken ? `found (${existingToken.substring(0, 20)}...)` : "NULL");

    // Check if token looks like a JWT (starts with eyJ) vs Liftngo token (starts with number|)
    const isLocalJwt = existingToken && existingToken.startsWith("eyJ");
    const isLiftngoToken = existingToken && /^\d+\|/.test(existingToken);

    if (isLocalJwt) {
      // Already have local JWT - authenticated
      console.log("AuthGuard: Found local JWT, authenticated");
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    if (isLiftngoToken) {
      // Have Liftngo token, need to exchange for local JWT via backend
      console.log("AuthGuard: Found Liftngo token, exchanging for local JWT...");
      try {
        const ssoResult = await api.ssoLogin(existingToken);

        if (ssoResult) {
          // SSO successful - store local JWT and keep Liftngo token for logout
          setCookie("tsm", ssoResult.token);
          localStorage.setItem("user", JSON.stringify(ssoResult.user));
          // Save Liftngo token for logout API call later
          localStorage.setItem("liftngo_token", existingToken);
          console.log("AuthGuard: SSO login successful");
          setIsAuthenticated(true);
        } else {
          console.warn("AuthGuard: SSO login returned no result");
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.warn("AuthGuard: SSO login failed:", error?.message || error);
        // Remove invalid token
        removeCookie("tsm");
        setIsAuthenticated(false);
      }
      setIsLoading(false);
      return;
    }

    // No readable token - try cookie-based authentication (for HttpOnly cookies)
    console.log("AuthGuard: No readable token, trying cookie-based auth...");
    try {
      const cookieAuthResult = await api.loginWithCookie();

      if (cookieAuthResult && cookieAuthResult.user) {
        localStorage.setItem("user", JSON.stringify(cookieAuthResult.user));
        console.log("AuthGuard: Cookie-based authentication successful");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } else {
        console.warn("AuthGuard: Cookie auth returned no user data");
      }
    } catch (error: any) {
      console.warn("AuthGuard: Cookie-based auth failed:", error?.message || error);
    }

    // All authentication methods failed
    console.log("AuthGuard: All authentication methods failed, redirecting to login");
    setIsAuthenticated(false);
    setIsLoading(false);
  });

  return (
    <Show
      when={!isLoading()}
      fallback={
        <div class="min-h-screen flex items-center justify-center bg-primary">
          <div class="text-text-primary">Loading...</div>
        </div>
      }
    >
      <Show
        when={isAuthenticated()}
        fallback={(() => {
          // Redirect to login page when not authenticated
          window.location.replace("/login");
          return null;
        })()}
      >
        {props.children}
      </Show>
    </Show>
  );
};

const App: Component = () => {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route
        path="/"
        component={() => (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        )}
      />
      <Route
        path="/vehicle/:id/history"
        component={() => (
          <AuthGuard>
            <VehicleHistory />
          </AuthGuard>
        )}
      />
      <Route
        path="/history"
        component={() => (
          <AuthGuard>
            <VehicleHistory />
          </AuthGuard>
        )}
      />
    </Router>
  );
};

export default App;
