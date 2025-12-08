import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { api } from '../services/api';

const Login = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [error, setError] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const navigate = useNavigate();

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
            <div class="bg-secondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-border-primary">
                <div class="text-center mb-8">
                    <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-accent-text font-bold text-xl mx-auto mb-4 shadow-lg shadow-accent/20">T</div>
                    <h1 class="text-2xl font-bold text-text-primary">Technician Login</h1>
                    <p class="text-text-tertiary mt-2">Enter your credentials to access the system</p>
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
        </div>
    );
};

export default Login;
