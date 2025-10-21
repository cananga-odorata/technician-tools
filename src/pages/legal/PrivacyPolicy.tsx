export default function PrivacyPolicy() {
    return (
        <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <div class="bg-white p-8 rounded-lg shadow">
                    <h1 class="text-3xl font-bold text-blue-600 mb-8">Privacy Policy</h1>

                    <div class="space-y-6">
                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">1. Information We Collect</h2>
                            <p class="text-gray-600">We collect information that you provide directly to us, including:</p>
                            <ul class="list-disc pl-6 mt-2 text-gray-600">
                                <li>Name and contact information</li>
                                <li>Account credentials</li>
                                <li>Payment information</li>
                                <li>Communication preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">2. How We Use Your Information</h2>
                            <p class="text-gray-600">We use the information we collect to:</p>
                            <ul class="list-disc pl-6 mt-2 text-gray-600">
                                <li>Provide and maintain our services</li>
                                <li>Process your transactions</li>
                                <li>Send you important updates and notifications</li>
                                <li>Improve our services and develop new features</li>
                            </ul>
                        </section>

                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">3. Data Security</h2>
                            <p class="text-gray-600">
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">4. Your Rights</h2>
                            <p class="text-gray-600">You have the right to:</p>
                            <ul class="list-disc pl-6 mt-2 text-gray-600">
                                <li>Access your personal data</li>
                                <li>Request correction of your personal data</li>
                                <li>Request deletion of your personal data</li>
                                <li>Object to processing of your personal data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">5. Contact Us</h2>
                            <p class="text-gray-600">
                                If you have any questions about this Privacy Policy, please contact us at:<br />
                                Email: anusornsriprom44@gmail.com<br />
                                Phone: +66 82 901 6969
                            </p>
                        </section>

                        <section>
                            <h2 class="text-xl font-semibold text-blue-600 mb-3">6. Updates to This Policy</h2>
                            <p class="text-gray-600">
                                We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the last updated date.
                            </p>
                            <p class="text-gray-500 text-sm mt-2">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}