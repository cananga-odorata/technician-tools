import { type Component, For, createSignal, onMount, onCleanup } from "solid-js";
import { locale, setLocale, type Locale } from "../i18n/config";

const LanguageSelector: Component = () => {
    const [isOpen, setIsOpen] = createSignal(false);
    let containerRef: HTMLDivElement | undefined;

    const languages: { code: Locale; label: string; flag: string }[] = [
        { code: "th", label: "ไทย", flag: "🇹🇭" },
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "ja", label: "日本語", flag: "🇯🇵" },
    ];

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef && !containerRef.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener("click", handleClickOutside);
    });

    return (
        <div class="relative" ref={containerRef}>
            <button
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-tertiary text-text-primary transition-colors"
                onClick={() => setIsOpen(!isOpen())}
            >
                <span class="text-xl">{languages.find((l) => l.code === locale())?.flag}</span>
                <span class="text-sm font-medium">{locale().toUpperCase()}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class={`transition-transform duration-200 ${isOpen() ? "rotate-180" : ""}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            <div
                class={`absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-lg border border-border-primary overflow-hidden z-50 transition-all duration-200 origin-top-right ${isOpen() ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <For each={languages}>
                    {(lang) => (
                        <button
                            class={`w-full text-left px-4 py-2 text-sm hover:bg-tertiary flex items-center gap-3 transition-colors ${locale() === lang.code ? "bg-tertiary text-accent font-medium" : "text-text-primary"
                                }`}
                            onClick={() => {
                                setLocale(lang.code);
                                setIsOpen(false);
                            }}
                        >
                            <span class="text-lg">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
};

export default LanguageSelector;
