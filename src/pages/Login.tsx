import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { api } from '../services/api';
import { getCookie } from '../utils/cookies';

const LIFTNGO_LOGIN_URL = import.meta.env.VITE_LIFTNGO_URL || 'https://liftngo.tmh-wst.com';

const Login = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [error, setError] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [cookieCheckDone, setCookieCheckDone] = createSignal(false);
    const navigate = useNavigate();

    onMount(async () => {
        try {
            console.log('[Login] Checking for tsm cookie...');
            const tsmCookie = getCookie('tsm');

            if (tsmCookie) {
                console.log('[Login] tsm session cookie found, exchanging for JWT...');
                setLoading(true);

                // Timeout promise: 3 seconds
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout')), 3000);
                });

                try {
                    // Race between API call and timeout
                    const jwtData: any = await Promise.race([
                        api.exchangeSessionForJWT(tsmCookie),
                        timeoutPromise
                    ]);

                    if (jwtData && jwtData.access_token) {
                        console.log('[Login] JWT exchange successful!');
                        localStorage.setItem('token', jwtData.access_token);
                        localStorage.setItem('user', JSON.stringify(jwtData.user));
                        navigate('/');
                        return;
                    }

                    // API returned but invalid data
                    console.warn('[Login] JWT exchange failed (invalid response)');
                    setError('Automatic login failed. Please login manually.');
                } catch (err: any) {
                    console.warn('[Login] Auto-login error:', err);
                    if (err.message === 'Timeout') {
                        setError('Automatic login timed out. Please login manually.');
                    } else {
                        setError('Session verification failed. Please login manually.');
                    }
                }
            } else {
                console.log('[Login] No tsm cookie found, showing login form');
            }
        } catch (e) {
            console.error('[Login] Critical error in auth check:', e);
        } finally {
            console.log('[Login] Auth check completed');
            setLoading(false);
            setCookieCheckDone(true);
        }
    });

    const handleLogin = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.login(username(), password());
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-primary transition-colors duration-300">
            {/* Loading State */}
            <Show when={!cookieCheckDone()}>
                <div class="bg-secondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-border-primary">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p class="text-text-secondary">Checking authentication...</p>
                    </div>
                </div>
            </Show>

            {/* Login Form */}
            <Show when={cookieCheckDone()}>
                <div class="bg-secondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-border-primary">
                    <div class="text-center mb-8">
                        <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-accent-text font-bold text-xl mx-auto mb-4 shadow-lg shadow-accent/20">T</div>
                        <h1 class="text-2xl font-bold text-text-primary">Technician Login</h1>
                        <p class="text-text-tertiary mt-2">Enter your credentials to access the system</p>
                        <p class="text-text-tertiary text-xs mt-4">
                            Or <a href={`${LIFTNGO_LOGIN_URL}/login`} class="text-accent hover:underline">login via Liftngo</a>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-2">Username</label>
                            <input
                                type="text"
                                value={username()}
                                onInput={(e) => setUsername(e.currentTarget.value)}
                                class="w-full px-4 py-3 rounded-lg border border-border-primary bg-tertiary text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="username"
                                required
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-text-secondary mb-2">Password</label>
                            <input
                                type="password"
                                value={password()}
                                onInput={(e) => setPassword(e.currentTarget.value)}
                                class="w-full px-4 py-3 rounded-lg border border-border-primary bg-tertiary text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error() && (
                            <div class="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg text-center border border-red-500/20">
                                {error()}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading()}
                            class="w-full bg-accent hover:bg-accent-hover text-accent-text font-bold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading() ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </Show>
        </div>
    );
};

export default Login;

