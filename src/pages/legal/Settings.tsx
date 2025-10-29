import { createSignal, onMount, For, createMemo } from "solid-js";
import { A } from "@solidjs/router";

export interface Theme {
    id: string;
    name: string;
    description: string;
    preview: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
}

export const availableThemes: Theme[] = [
    {
        id: "gruvbox",
        name: "Gruvbox",
        description: "Warm retro theme with earthy tones",
        preview: {
            primary: "#d79921",
            secondary: "#83a598",
            background: "#282828",
            text: "#ebdbb2"
        }
    },
    {
        id: "dracula",
        name: "Dracula",
        description: "Dark theme with vibrant purple accents",
        preview: {
            primary: "#bd93f9",
            secondary: "#50fa7b",
            background: "#282a36",
            text: "#f8f8f2"
        }
    },
    {
        id: "nord",
        name: "Nord",
        description: "Arctic, north-bluish color palette",
        preview: {
            primary: "#88c0d0",
            secondary: "#81a1c1",
            background: "#2e3440",
            text: "#eceff4"
        }
    },
    {
        id: "tokyo-night",
        name: "Tokyo Night",
        description: "Clean dark theme inspired by Tokyo's night",
        preview: {
            primary: "#7aa2f7",
            secondary: "#bb9af7",
            background: "#1a1b26",
            text: "#c0caf5"
        }
    },
    {
        id: "catppuccin",
        name: "Catppuccin",
        description: "Soothing pastel theme for cozy coding",
        preview: {
            primary: "#cba6f7",
            secondary: "#89b4fa",
            background: "#1e1e2e",
            text: "#cdd6f4"
        }
    },
    {
        id: "light",
        name: "Light",
        description: "Clean and bright default theme",
        preview: {
            primary: "#3b82f6",
            secondary: "#8b5cf6",
            background: "#ffffff",
            text: "#1f2937"
        }
    },
    {
        id: "duminda",
        name: "Duminda",
        description: "A custom theme with unique color combinations",
        preview: {
            primary: "#ff6ac1",
            secondary: "#6eeb83",
            background: "#1b1b2f",
            text: "#e0e0e0"
        }
    },
    {
        id: "earthy-forest-hues",
        name: "Earthy Forest Hues",
        description: "Nature-inspired theme with earthy tones",
        preview: {
            primary: "#4caf50",
            secondary: "#8bc34a",
            background: "#2e3b2f",
            text: "#d7ccc8"
        }
    },
    {
        id: "autumn-glow",
        name: "Autumn Glow",
        description: "Warm autumn colors for a cozy feel",
        preview: {
            primary: "#ff7043",
            secondary: "#ffa726",
            background: "#3e2723",
            text: "#fbe9e7"
        }
    },
    {
        id: "black-and-gold-elegance",
        name: "Black and Gold Elegance",
        description: "Sophisticated black and gold color scheme",
        preview: {
            primary: "#ffd700",
            secondary: "#ffa500",
            background: "#121212",
            text: "#f5f5f5"
        }
    },
    {
        id: "cyberpunk",
        name: "Cyberpunk",
        description: "Futuristic theme with neon colors",
        preview: {
            primary: "#ff00ff",
            secondary: "#00ffff",
            background: "#0f0f0f",
            text: "#e0e0e0"
        }
    },
    {
        id: "arctic-frost",
        name: "Arctic Frost",
        description: "Cool icy tones for a refreshing look",
        preview: {
            primary: "#00bfff",
            secondary: "#1e90ff",
            background: "#e0f7fa",
            text: "#01579b"
        }
    }

];

export default function Settings() {
    // 1. เก็บ Theme ปัจจุบัน
    const [currentTheme, setCurrentTheme] = createSignal<string>("gruvbox");
    // 2. เก็บ Theme มืดล่าสุดที่ผู้ใช้เลือก
    const [lastDarkTheme, setLastDarkTheme] = createSignal<string>("gruvbox");

    // 3. สร้าง Memo (derived signal) เพื่อดูว่าตอนนี้เป็น Dark Mode หรือไม่
    const isDarkMode = createMemo(() => currentTheme() !== "light");

    // 4. (themes array... ไม่เปลี่ยนแปลง)
    const themes: Theme[] = [
        {
            id: "gruvbox",
            name: "Gruvbox",
            description: "Warm retro theme with earthy tones",
            preview: {
                primary: "#d79921",
                secondary: "#83a598",
                background: "#282828",
                text: "#ebdbb2"
            }
        },
        {
            id: "dracula",
            name: "Dracula",
            description: "Dark theme with vibrant purple accents",
            preview: {
                primary: "#bd93f9",
                secondary: "#50fa7b",
                background: "#282a36",
                text: "#f8f8f2"
            }
        },
        {
            id: "nord",
            name: "Nord",
            description: "Arctic, north-bluish color palette",
            preview: {
                primary: "#88c0d0",
                secondary: "#81a1c1",
                background: "#2e3440",
                text: "#eceff4"
            }
        },
        {
            id: "tokyo-night",
            name: "Tokyo Night",
            description: "Clean dark theme inspired by Tokyo's night",
            preview: {
                primary: "#7aa2f7",
                secondary: "#bb9af7",
                background: "#1a1b26",
                text: "#c0caf5"
            }
        },
        {
            id: "catppuccin",
            name: "Catppuccin",
            description: "Soothing pastel theme for cozy coding",
            preview: {
                primary: "#cba6f7",
                secondary: "#89b4fa",
                background: "#1e1e2e",
                text: "#cdd6f4"
            }
        },
        {
            id: "light",
            name: "Light",
            description: "Clean and bright default theme",
            preview: {
                primary: "#3b82f6",
                secondary: "#8b5cf6",
                background: "#ffffff",
                text: "#1f2937"
            }
        },
        {
            id: "duminda",
            name: "Duminda",
            description: "A custom theme with unique color combinations",
            preview: {
                primary: "#ff6ac1",
                secondary: "#6eeb83",
                background: "#1b1b2f",
                text: "#e0e0e0"
            }
        },
        {
            id: "earthy-forest-hues",
            name: "Earthy Forest Hues",
            description: "Nature-inspired theme with earthy tones",
            preview: {
                primary: "#4caf50",
                secondary: "#8bc34a",
                background: "#2e3b2f",
                text: "#d7ccc8"
            }
        },
        {
            id: "autumn-glow",
            name: "Autumn Glow",
            description: "Warm autumn colors for a cozy feel",
            preview: {
                primary: "#ff7043",
                secondary: "#ffa726",
                background: "#3e2723",
                text: "#fbe9e7"
            }
        },
        {
            id: "black-and-gold-elegance",
            name: "Black and Gold Elegance",
            description: "Sophisticated black and gold color scheme",
            preview: {
                primary: "#ffd700",
                secondary: "#ffa500",
                background: "#121212",
                text: "#f5f5f5"
            }
        },
        {
            id: "cyberpunk",
            name: "Cyberpunk",
            description: "Futuristic theme with neon colors",
            preview: {
                primary: "#ff00ff",
                secondary: "#00ffff",
                background: "#0f0f0f",
                text: "#e0e0e0"
            }
        },
        {
            id: "arctic-frost",
            name: "Arctic Frost",
            description: "Cool icy tones for a refreshing look",
            preview: {
                primary: "#00bfff",
                secondary: "#1e90ff",
                background: "#e0f7fa",
                text: "#01579b"
            }
        }

    ];

    onMount(() => {
        // 5. โหลด Theme ที่บันทึกไว้
        const savedTheme = localStorage.getItem('theme') || 'gruvbox';
        setCurrentTheme(savedTheme);

        // 6. ถ้า Theme ที่โหลดมาไม่ใช่ light ให้บันทึกเป็น lastDarkTheme
        if (savedTheme !== 'light') {
            setLastDarkTheme(savedTheme);
        }

        applyTheme(savedTheme);
    });

    const applyTheme = (themeId: string) => {
        // 7. ล้าง class theme เก่าออกจาก <html>
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
            'theme-arctic-frost'
        );

        // 8. เพิ่ม class theme ใหม่
        document.documentElement.classList.add(`theme-${themeId}`);

        // 9. *** FIX: เพิ่ม/ลบ .dark-mode โดยอัตโนมัติตาม Theme ที่เลือก ***
        if (themeId === 'light') {
            document.documentElement.classList.remove('dark-mode');
        } else {
            document.documentElement.classList.add('dark-mode');
        }
    };

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem('theme', themeId);

        // 10. ถ้าอันใหม่เป็น dark theme ให้บันทึกไว้
        if (themeId !== 'light') {
            setLastDarkTheme(themeId);
            localStorage.setItem('lastDarkTheme', themeId);
        }

        applyTheme(themeId);
    };

    const handleDarkModeToggle = () => {
        // 11. Toggle สลับระหว่าง theme 'light' และ 'lastDarkTheme'
        const newThemeId = isDarkMode() ? 'light' : lastDarkTheme();

        setCurrentTheme(newThemeId);
        localStorage.setItem('theme', newThemeId);
        applyTheme(newThemeId);
    };

    return (
        <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                {/* Header */}
                <div class="mb-8">
                    <A
                        href="/"
                        class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </A>
                    <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
                    <p class="text-gray-600 mt-2">Customize your experience</p>
                </div>

                {/* Dark Mode Toggle Section */}
                <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900 mb-1">Appearance</h2>
                            <p class="text-gray-600 text-sm">
                                Currently in {isDarkMode() ? "Dark Mode" : "Light Mode"}
                            </p>
                        </div>
                        <button
                            onClick={handleDarkModeToggle}
                            class={`relative inline-flex h-12 w-20 items-center rounded-full transition-colors ${isDarkMode() ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                class={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${isDarkMode() ? 'translate-x-9' : 'translate-x-1'
                                    }`}
                            >
                                {isDarkMode() ? (
                                    <svg class="w-6 h-6 m-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                ) : (
                                    <svg class="w-6 h-6 m-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                                    </svg>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Theme Selection Section */}
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Theme Selection</h2>
                    <p class="text-gray-600 mb-6">Choose your preferred color theme. This will also set your mode.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <For each={themes}>
                            {(theme) => (
                                <button
                                    onClick={() => handleThemeChange(theme.id)}
                                    class={`relative p-4 rounded-lg border-2 transition-all ${currentTheme() === theme.id
                                        ? 'border-blue-600 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Selected Indicator */}
                                    {currentTheme() === theme.id && (
                                        <div class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Theme Info */}
                                    <div class="text-left mb-3">
                                        <h3 class="text-lg font-semibold text-gray-900">{theme.name}</h3>
                                        <p class="text-sm text-gray-600">{theme.description}</p>
                                    </div>

                                    {/* Color Preview */}
                                    <div class="flex gap-2">
                                        <div
                                            class="w-12 h-12 rounded-md shadow-sm"
                                            style={{ background: theme.preview.background }}
                                        />
                                        <div
                                            class="w-12 h-12 rounded-md shadow-sm"
                                            style={{ background: theme.preview.primary }}
                                        />
                                        <div
                                            class="w-12 h-12 rounded-md shadow-sm"
                                            style={{ background: theme.preview.secondary }}
                                        />
                                        <div
                                            class="w-12 h-12 rounded-md shadow-sm"
                                            style={{ background: theme.preview.text }}
                                        />
                                    </div>
                                </button>
                            )}
                        </For>
                    </div>
                </div>

                {/* Additional Settings Section */}
                <div class="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-4">Other Settings</h2>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                                <p class="text-sm text-gray-600">Receive push notifications</p>
                            </div>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded" />
                        </div>

                        <div class="flex items-center justify-between py-3 border-b border-gray-200">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Email Updates</h3>
                                <p class="text-sm text-gray-600">Get email about your activity</p>
                            </div>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded" checked />
                        </div>

                        <div class="flex items-center justify-between py-3">
                            <div>
                                <h3 class="text-sm font-medium text-gray-900">Privacy Mode</h3>
                                <p class="text-sm text-gray-600">Hide your online status</p>
                            </div>
                            <input type="checkbox" class="w-5 h-5 text-blue-600 rounded" />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div class="mt-6 flex justify-end">
                    <button class="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}