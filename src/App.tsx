import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleHistory from './pages/VehicleHistory';

const AuthGuard: Component<{ children: any }> = (props) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
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
