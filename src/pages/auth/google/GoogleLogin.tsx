import { createSignal, onMount, Show } from 'solid-js';

// 1. บอก TypeScript ว่าจะมีตัวแปร `google` อยู่ใน global scope
declare const google: any;

// (Optional) Type สำหรับ User
type UserCredential = string;

export default function GoogleLogin() {
    const [user, setUser] = createSignal<UserCredential | null>(null);
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    /**
     * 2. ฟังก์ชัน Callback ที่จะถูกเรียกโดย Google
     */
    async function handleLoginCallback(response: any) {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Login Success! Response:", response);
            const jwtToken = response.credential;
            console.log("This is your ID Token (JWT):", jwtToken);

            // --- (เพิ่มส่วนนี้) วิธีถอดรหัส Token บน Client ---
            try {
                // 1. Token มี 3 ส่วน (Header, Payload, Signature) เราต้องการส่วน Payload (ตรงกลาง)
                const payloadBase64 = jwtToken.split('.')[1];

                // 2. จัดการตัวอักษรพิเศษสำหรับ Base64
                const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

                // 3. ถอดรหัส Base64 เป็น JSON String
                const decodedJson = atob(base64);

                // 4. แปลง JSON String เป็น Object
                const payload = JSON.parse(decodedJson);

                // Add additional user data
                const enrichedPayload = {
                    ...payload,
                    loginMethod: 'google',
                    timestamp: new Date().toISOString()
                };

                // Simulate API call to your backend (if needed)
                await new Promise(resolve => setTimeout(resolve, 500));

                // Save to localStorage
                localStorage.setItem('user_profile', JSON.stringify(enrichedPayload));

                // Set user state (this will show success message briefly before redirect)
                setUser(enrichedPayload);

                // Small delay before redirect for better UX
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);

            } catch (err) {
                console.error('Login error:', err);
                setError(err instanceof Error ? err.message : "Google login failed. Please try again.");
            } finally {
                setIsLoading(false);
            }

            // คุณสามารถนำข้อมูลนี้ไปใส่ใน Signal (State) ของคุณได้เลย
            // setUserProfile(payload); // (ถ้าคุณมี Signal นี้)

        } catch (e) {
            console.error("Error decoding JWT:", e);
        }
        // ------------------------------------------------
    }
    /**
     * 3. onMount จะทำงานหลังจาก Component ถูก Render
     */
    onMount(() => {
        if (typeof google !== 'undefined') {

            // 3.1: Initialize Google Identity Services
            google.accounts.id.initialize({
                // ▼▼▼ แทนที่ตรงนี้ด้วย CLIENT ID ของคุณ ▼▼▼
                client_id: "1056317217331-nfu1s0fd79mnai9ovett79b9h6vvs86n.apps.googleusercontent.com",
                callback: handleLoginCallback
            });

            // 3.2: Render ปุ่ม Google Login
            google.accounts.id.renderButton(
                // บอกให้ Google แสดงปุ่มที่ Element นี้
                document.getElementById("google-login-button-div"),

                // ▼▼▼ ปรับแต่งหน้าตาปุ่มให้เข้ากับดีไซน์ของคุณ ▼▼▼
                {
                    theme: "outline",         // "outline" คล้ายกับดีไซน์ของคุณ (border)
                    size: "large",            // "large" คล้ายกับ py-3
                    text: "continue_with",    // ตรงกับข้อความ "Continue with Google"
                    shape: "rectangular",     // ตรงกับ "rounded-lg"
                    logo_alignment: "left",   // ตรงกับดีไซน์
                    width: "350"              // ตั้งค่าความกว้าง (ปรับได้ตามต้องการ)
                }
            );

        } else {
            console.error("Google Identity Services script not loaded.");
        }
    });

    return (
        <div class="google-login-container">
            <Show
                when={user()}
                fallback={
                    <div class="space-y-3">
                        <Show when={error()}>
                            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        </Show>

                        <div class="relative">
                            {/* Loading Overlay */}
                            <Show when={isLoading()}>
                                <div class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                                    <div class="flex items-center space-x-2">
                                        <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span class="text-sm text-gray-600">Connecting to Google...</span>
                                    </div>
                                </div>
                            </Show>

                            {/* Google Button Container */}
                            <div class="flex justify-center">
                                <div id="google-login-button-div"></div>
                            </div>
                        </div>
                    </div>
                }
            >
                {/* เมื่อ Login สำเร็จ, จะซ่อนปุ่มและแสดงข้อความนี้
           คุณอาจจะอยาก redirect ผู้ใช้ไปหน้าอื่นแทน
        */}
                <div class="text-center p-3 border border-green-300 bg-green-50 rounded-lg">
                    <p class="font-medium text-green-700">Login Successful!</p>
                </div>
            </Show>
        </div>
    );
}
