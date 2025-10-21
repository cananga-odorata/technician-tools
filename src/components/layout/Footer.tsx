export default function Footer() {
    // Focus this line
    return (
        <footer class="bg-gray-800 text-white mt-auto">
            <div class="max-w-7xl mx-auto px-4 py-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div>
                        <h3 class="text-lg font-semibold mb-4">About Us</h3>
                        <p class="text-gray-400 text-sm">
                            {/* Your company description goes here. Brief and engaging content about your business. */}
                            Hi there, I am Anusorn Sriprom, a passionate web developer specializing in creating dynamic and user-friendly web applications. With a strong foundation in modern web technologies, I strive to deliver high-quality solutions that meet client needs and exceed expectations.
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
                            <li>Email: anusornsriprom44@gmail.com</li>
                            <li>Phone: +66 82 901 6969</li>
                            <li>40270 Banfang: KhonKean, Thailand</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} IOTech. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}