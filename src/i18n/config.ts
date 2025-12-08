import * as i18n from "@solid-primitives/i18n";
import { createMemo, createSignal, createRoot } from "solid-js";
import { dict as en } from "./en";
import { dict as th } from "./th";
import { dict as ja } from "./ja";

export type Locale = "en" | "th" | "ja";

const dictionaries = {
    en,
    th,
    ja,
};

// Default locale or get from localStorage
const storedLocale = localStorage.getItem("locale") as Locale;
const initialLocale: Locale = storedLocale && dictionaries[storedLocale] ? storedLocale : "th";

export const [locale, setLocale] = createSignal<Locale>(initialLocale);

// Persist locale changes
createRoot(() => {
    createMemo(() => {
        localStorage.setItem("locale", locale());
    });
});

export const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));

export const t = i18n.translator(dict);
