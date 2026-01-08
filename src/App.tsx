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
  const [debugInfo, setDebugInfo] = createSignal<string[]>([]);
  const [authError, setAuthError] = createSignal<string | null>(null);

  const addDebug = (msg: string) => {
    console.log(msg);
    setDebugInfo((prev) => [...prev, `${new Date().toISOString().split('T')[1].slice(0, 8)} - ${msg}`]);
  };

  createEffect(async () => {
    // First, check if we have a valid local JWT token
    const existingToken = getCookie("tsm");

    addDebug(`tsm cookie: ${existingToken ? `found (${existingToken.substring(0, 20)}...)` : "NULL (not readable or HttpOnly)"}`);

    // Check if token looks like a JWT (starts with eyJ) vs Liftngo token (starts with number|)
    const isLocalJwt = existingToken && existingToken.startsWith("eyJ");
    const isLiftngoToken = existingToken && /^\d+\|/.test(existingToken);

    addDebug(`Token type: isLocalJwt=${isLocalJwt}, isLiftngoToken=${isLiftngoToken}`);

    if (isLocalJwt) {
      // Already have local JWT - authenticated
      addDebug("✅ Found local JWT, authenticated");
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    if (isLiftngoToken) {
      // Have Liftngo token, need to exchange for local JWT via backend
      addDebug("Found Liftngo token, exchanging for local JWT...");
      try {
        const ssoResult = await api.ssoLogin(existingToken);

        if (ssoResult) {
          // SSO successful - store local JWT
          setCookie("tsm", ssoResult.token);
          localStorage.setItem("user", JSON.stringify(ssoResult.user));
          addDebug("✅ SSO login successful");
          setIsAuthenticated(true);
        } else {
          addDebug("❌ SSO login returned no result");
          setAuthError("SSO login returned no result");
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        addDebug(`❌ SSO login failed: ${error?.message || error}`);
        setAuthError(`SSO login failed: ${error?.message || error}`);
        // Remove invalid token
        removeCookie("tsm");
        setIsAuthenticated(false);
      }
      setIsLoading(false);
      return;
    }

    // No readable token - try cookie-based authentication (for HttpOnly cookies)
    // The cookie will be sent with the request even if we can't read it via JavaScript
    addDebug("No readable token, trying cookie-based auth (for HttpOnly cookies)...");
    try {
      const cookieAuthResult = await api.loginWithCookie();
      addDebug(`loginWithCookie result: ${JSON.stringify(cookieAuthResult)}`);

      if (cookieAuthResult && cookieAuthResult.user) {
        // Cookie auth successful - store user info
        localStorage.setItem("user", JSON.stringify(cookieAuthResult.user));
        addDebug("✅ Cookie-based authentication successful");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } else {
        addDebug("❌ Cookie auth returned no user data");
        setAuthError("Cookie auth returned no user data");
      }
    } catch (error: any) {
      addDebug(`❌ Cookie-based auth failed: ${error?.message || error}`);
      setAuthError(`Cookie-based auth failed: ${error?.message || error}`);
    }

    // All authentication methods failed
    addDebug("❌ All authentication methods failed");
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
        fallback={
          // DEBUG MODE: Show error info instead of redirecting
          <div class="min-h-screen flex items-center justify-center bg-primary p-4">
            <div class="bg-secondary p-6 rounded-xl border border-red-500/50 max-w-2xl w-full">
              <h2 class="text-xl font-bold text-red-400 mb-4">🔒 Authentication Debug Mode</h2>

              {authError() && (
                <div class="bg-red-500/20 border border-red-500/50 p-3 rounded-lg mb-4">
                  <p class="text-red-300 font-semibold">Error: {authError()}</p>
                </div>
              )}

              <div class="bg-primary p-4 rounded-lg mb-4">
                <h3 class="text-text-secondary font-semibold mb-2">Debug Log:</h3>
                <div class="font-mono text-xs text-text-tertiary space-y-1 max-h-60 overflow-y-auto">
                  {debugInfo().map((line) => (
                    <div class={line.includes("✅") ? "text-green-400" : line.includes("❌") ? "text-red-400" : "text-text-tertiary"}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div class="bg-primary p-4 rounded-lg mb-4">
                <h3 class="text-text-secondary font-semibold mb-2">Current Cookies (readable by JS):</h3>
                <p class="font-mono text-xs text-text-tertiary break-all">
                  {document.cookie || "(empty - cookies may be HttpOnly)"}
                </p>
              </div>

              <button
                onClick={() => window.location.replace("/login")}
                class="w-full bg-accent hover:bg-accent-hover text-accent-text font-bold py-3 rounded-xl transition-all"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        }
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
