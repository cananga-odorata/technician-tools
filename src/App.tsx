import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleHistory from './pages/VehicleHistory';
import { getCookie, getAllCookies } from './utils/cookies';

const LIFTNGO_LOGIN_URL = import.meta.env.VITE_LIFTNGO_URL || 'https://liftngo.tmh-wst.com';

const AuthGuard: Component<{ children: any }> = (props) => {
  console.log('[AuthGuard] Checking authentication...');
  console.log('[AuthGuard] All cookies:', getAllCookies());

  const tsmCookie = getCookie('tsm');
  const localToken = localStorage.getItem('token');

  // Check cookie first, fallback to localStorage
  if (!tsmCookie && !localToken) {
    console.warn('[AuthGuard] No authentication found, redirecting to login');
    window.location.href = '/login';
    return null;
  }

  if (tsmCookie) {
    console.log('[AuthGuard] tsm cookie found:', tsmCookie.substring(0, 20) + '...');
  } else {
    console.log('[AuthGuard] Using localStorage token (legacy)');
  }

  return props.children;
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

