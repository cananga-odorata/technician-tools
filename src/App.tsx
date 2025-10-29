import { Route, Router } from '@solidjs/router';
import { onMount } from "solid-js";
import Home from './pages/Home';
import about from './pages/About';
import Layout from './components/layout/Layout';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Setting from './pages/legal/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Term from './pages/legal/Term';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';


const applyTheme = (themeId: string) => {
  document.documentElement.classList.remove(
    'theme-gruvbox',
    'theme-dracula',
    'theme-nord',
    'theme-tokyo-night',
    'theme-catppuccin',
    'theme-light',
    'theme-duminda',
    'theme-earthy-forest-hues',
    'theme-autumn-glow',
    'theme-black-and-gold-elegance',
    'theme-cyberpunk',

  );

  document.documentElement.classList.add(`theme-${themeId}`);
  if (themeId === 'light') {
    document.documentElement.classList.remove('dark-mode');
  } else {
    document.documentElement.classList.add('dark-mode');
  }
};

function App() {
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    let currentTheme = 'gruvbox';

    if (savedTheme) {
      currentTheme = savedTheme;
    } else {
      localStorage.setItem('theme', currentTheme);
    }


    applyTheme(currentTheme);

    if (!localStorage.getItem('lastDarkTheme')) {
      const lastDark = (currentTheme !== 'light') ? currentTheme : 'gruvbox';
      localStorage.setItem('lastDarkTheme', lastDark);
    }
  });

  return (
    <div class="app">
      <Router>
        <Route component={Layout}>
          <Route path='/' component={Home} />
          <Route path='/about' component={about} />
          <Route path='/contact' component={Contact} />
          <Route path='/profile' component={Profile} />
          <Route path='/settings' component={Setting} />
          <Route path='/terms' component={Term} />
          <Route path='/privacy' component={PrivacyPolicy} />
        </Route>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Router>
    </div>
  )
}

export default App
