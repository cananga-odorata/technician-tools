import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { createSignal, Show, onMount } from 'solid-js';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleHistory from './pages/VehicleHistory';
import { getCookie, getAllCookies } from './utils/cookies';
import { api } from './services/api';

const AuthGuard: Component<{ children: any }> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    console.log('[AuthGuard] Checking authentication...');
    console.log('[AuthGuard] All cookies:', getAllCookies());

    const tsmCookie = getCookie('tsm');
    const localToken = localStorage.getItem('token');

    // If we have JWT token already, we're good
    if (localToken) {
      console.log('[AuthGuard] JWT token found in localStorage');
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // If we have session cookie but no JWT, exchange it
    if (tsmCookie && !localToken) {
      console.log('[AuthGuard] tsm cookie found, exchanging for JWT...');

      try {
        const jwtData = await api.exchangeSessionForJWT(tsmCookie);

        if (jwtData?.access_token) {
          console.log('[AuthGuard] JWT exchange successful!');
          localStorage.setItem('token', jwtData.access_token);
          localStorage.setItem('user', JSON.stringify(jwtData.user));
          setIsAuthenticated(true);
        } else {
          console.warn('[AuthGuard] JWT exchange failed');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('[AuthGuard] JWT exchange error:', error);
        window.location.href = '/login';
      }

      setIsLoading(false);
      return;
    }

    // No cookie and no token - redirect to login
    console.warn('[AuthGuard] No authentication found, redirecting to login');
    window.location.href = '/login';
  });

  return (
    <Show when={!isLoading()} fallback={
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <p>Loading...</p>
      </div>
    }>
      <Show when={isAuthenticated()}>
        {props.children}
      </Show>
    </Show>
  );
};

const App: Component = () => {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => (
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      )} />
      <Route path="/vehicle/:id/history" component={() => (
        <AuthGuard>
          <VehicleHistory />
        </AuthGuard>
      )} />
      <Route path="/history" component={() => (
        <AuthGuard>
          <VehicleHistory />
        </AuthGuard>
      )} />
    </Router>
  );
};

export default App;
