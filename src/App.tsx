import { Route, Router } from '@solidjs/router';
import Home from './pages/Home';
import about from './pages/About';
import Layout from './components/layout/Layout';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Setting from './pages/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';


function App() {
  return (
    <div class="app">
      <Router>
        <Route component={Layout}>
          <Route path='/' component={Home} />
          <Route path='/about' component={about} />
          <Route path='/contact' component={Contact} />
          <Route path='/profile' component={Profile} />
          <Route path='/settings' component={Setting} />
        </Route>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Router>
    </div>
  )
}

export default App
