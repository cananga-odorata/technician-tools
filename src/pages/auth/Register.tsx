import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

export default function Register() {
    const [formData, setFormData] = createSignal({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = createSignal(false);
    const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
    const [agreedToTerms, setAgreedToTerms] = createSignal(false);

    const updateField = (field: string, value: string) => {
        setFormData({ ...formData(), [field]: value });
    };

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        if (formData().password !== formData().confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!agreedToTerms()) {
            alert("Please agree to the Terms and Conditions");
            return;
        }

        console.log("Register with:", formData());
        // Add your registration logic here
    };

    const handleSocialRegister = (provider: string) => {
        console.log("Register with:", provider);
        // Add your social registration logic here
    };

    const passwordStrength = () => {
        const pwd = formData().password;
        if (!pwd) return { strength: 0, text: "", color: "" };

        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;

        const levels = [
            { strength: 0, text: "", color: "" },
            { strength: 1, text: "Weak", color: "bg-red-500" },
            { strength: 2, text: "Fair", color: "bg-orange-500" },
            { strength: 3, text: "Good", color: "bg-yellow-500" },
            { strength: 4, text: "Strong", color: "bg-green-500" }
        ];

        return levels[strength];
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full">
                {/* Card Container */}
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p class="text-gray-600">Sign up to get started</p>
                    </div>

                    {/* Social Register Buttons */}
                    <div class="space-y-3 mb-6">
                        {/* Google */}
                        <button
                            onClick={() => handleSocialRegister("Google")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                        >
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign up with Google
                        </button>

                        {/* Apple */}
                        <button
                            onClick={() => handleSocialRegister("Apple")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            Sign up with Apple
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleSocialRegister("Facebook")}
                            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition font-medium"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Sign up with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div class="relative my-6">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-white text-gray-500">Or register with email</span>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} class="space-y-4">
                        {/* Name Fields */}
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={formData().firstName}
                                    onInput={(e) => updateField("firstName", e.currentTarget.value)}
                                    placeholder="John"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <div>
                                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={formData().lastName}
                                    onInput={(e) => updateField("lastName", e.currentTarget.value)}
                                    placeholder="Doe"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData().email}
                                onInput={(e) => updateField("email", e.currentTarget.value)}
                                placeholder="you@example.com"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
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
                                    value={formData().password}
                                    onInput={(e) => updateField("password", e.currentTarget.value)}
                                    placeholder="Create a strong password"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
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
                            {/* Password Strength Indicator */}
                            {formData().password && (
                                <div class="mt-2">
                                    <div class="flex gap-1 mb-1">
                                        <div class={`h-1 flex-1 rounded ${passwordStrength().strength >= 1 ? passwordStrength().color : 'bg-gray-200'}`}></div>
                                        <div class={`h-1 flex-1 rounded ${passwordStrength().strength >= 2 ? passwordStrength().color : 'bg-gray-200'}`}></div>
                                        <div class={`h-1 flex-1 rounded ${passwordStrength().strength >= 3 ? passwordStrength().color : 'bg-gray-200'}`}></div>
                                        <div class={`h-1 flex-1 rounded ${passwordStrength().strength >= 4 ? passwordStrength().color : 'bg-gray-200'}`}></div>
                                    </div>
                                    <p class="text-xs text-gray-600">
                                        Password strength: <span class="font-medium">{passwordStrength().text}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div class="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword() ? "text" : "password"}
                                    value={formData().confirmPassword}
                                    onInput={(e) => updateField("confirmPassword", e.currentTarget.value)}
                                    placeholder="Confirm your password"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword() ? (
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
                            {/* Password Match Indicator */}
                            {formData().confirmPassword && (
                                <p class={`text-xs mt-2 ${formData().password === formData().confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                    {formData().password === formData().confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div class="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms()}
                                onChange={(e) => setAgreedToTerms(e.currentTarget.checked)}
                                class="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label for="terms" class="ml-2 text-sm text-gray-600">
                                I agree to the{" "}
                                <a href="/terms" class="text-purple-600 hover:text-purple-700 font-medium">
                                    Terms and Conditions
                                </a>
                                {" "}and{" "}
                                <a href="/privacy" class="text-purple-600 hover:text-purple-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            class="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition focus:ring-4 focus:ring-purple-200"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p class="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{" "}
                        <A href="/login" class="text-purple-600 hover:text-purple-700 font-medium">
                            Sign in
                        </A>
                    </p>
                </div>

                {/* Additional Info */}
                <p class="text-center text-xs text-gray-500 mt-6">
                    By signing up, you agree to receive updates and promotional emails. You can unsubscribe at any time.
                </p>
            </div>
        </div>
    );
}