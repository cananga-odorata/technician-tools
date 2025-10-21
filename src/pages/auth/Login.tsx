import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

export default function Login() {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        console.log("Login with:", email(), password());
        // Add your login logic here
    };

    const handleSocialLogin = (provider: string) => {
        console.log("Login with:", provider);
        // Add your social login logic here
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full">
                {/* Card Container */}
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p class="text-gray-600">Sign in to continue to your account</p>
                    </div>

                    {/* Social Login Buttons */}
                    <div class="space-y-3 mb-6">
                        {/* Google */}
                        <button
                            onClick={() => handleSocialLogin("Google")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                        >
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Apple */}
                        <button
                            onClick={() => handleSocialLogin("Apple")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            Continue with Apple
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleSocialLogin("Facebook")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition font-medium"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continue with Facebook
                        </button>

                        {/* Line */}
                        <button
                            onClick={() => handleSocialLogin("Line")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#00B900] text-white rounded-lg hover:bg-[#00A000] transition font-medium"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                            </svg>
                            Continue with Line
                        </button>
                    </div>

                    {/* Divider */}
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} class="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email()}
                                onInput={(e) => setEmail(e.currentTarget.value)}
                                placeholder="you@example.com"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div class="relative">
                                <input
                                    id="password"
                                    type={showPassword() ? "text" : "password"}
                                    value={password()}
                                    onInput={(e) => setPassword(e.currentTarget.value)}
                                    placeholder="Enter your password"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword())}
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword() ? (
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div class="flex items-center justify-between">
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition focus:ring-4 focus:ring-blue-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p class="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <A href="/register" class="text-blue-600 hover:text-blue-700 font-medium">
                            Sign up
                        </A>
                    </p>
                </div>

                {/* Terms & Privacy */}
                <p class="text-center text-xs text-gray-500 mt-6">
                    By continuing, you agree to our{" "}
                    <a href="/terms" class="underline hover:text-gray-700">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" class="underline hover:text-gray-700">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}