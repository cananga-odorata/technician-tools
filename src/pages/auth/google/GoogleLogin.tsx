import { createSignal, onMount, Show } from 'solid-js';

// 1. บอก TypeScript ว่าจะมีตัวแปร `google` อยู่ใน global scope
declare const google: any;

// (Optional) Type สำหรับ User
type UserCredential = string;

export default function GoogleLogin() {

    const [user, setUser] = createSignal<UserCredential | null>(null);

    /**
     * 2. ฟังก์ชัน Callback ที่จะถูกเรียกโดย Google
     */
    function handleLoginCallback(response: any) {
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
            localStorage.setItem('user_profile', JSON.stringify(payload));

            // console.log("--- User Data (Decoded on Client) ---");
            // console.log("Email:", payload.email);
            // console.log("Name:", payload.name);
            // console.log("Picture URL:", payload.picture);
            // console.log("Google User ID:", payload.sub);
            // console.log("--------------------------------------");

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
                    // นี่คือ div ที่ Google จะใช้สร้างปุ่ม
                    // เราจัดให้อยู่ตรงกลางเพื่อให้ปุ่มที่ Google สร้างมาอยู่ตรงกลาง
                    <div class="flex justify-center">
                        <div id="google-login-button-div"></div>
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
