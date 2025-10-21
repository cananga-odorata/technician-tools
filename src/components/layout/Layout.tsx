import type { Component } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import Header from "./Header";

const Layout: Component<RouteSectionProps<unknown>> = (props) => {
    return (
        <div class="layout">
            <Header />
            <main class="h-screen">
                {props.children}
            </main>
            <footer class="bg-gray-800 text-white mt-auto">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h3 class="text-lg font-semibold mb-4">About Us</h3>
                            <p class="text-gray-400 text-sm">
                                Your company description goes here. Brief and engaging content about your business.
                            </p>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul class="space-y-2 text-sm">
                                <li><a href="/" class="text-gray-400 hover:text-white transition">Home</a></li>
                                <li><a href="/about" class="text-gray-400 hover:text-white transition">About</a></li>
                                <li><a href="/contact" class="text-gray-400 hover:text-white transition">Contact</a></li>
                                <li><a href="/login" class="text-gray-400 hover:text-white transition">Login</a></li>
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li>Email: info@example.com</li>
                                <li>Phone: +66 123 456 789</li>
                                <li>Address: Bangkok, Thailand</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default Layout;