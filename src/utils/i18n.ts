import { createI18n } from "vue-i18n";
import { nextTick } from 'vue'

import { getIl8nApi } from "@/api/config";
import zh_CN from "@/assets/i18n/zh";

const LOCALE = 'Locale'

export function getLocale() {
    return localStorage.getItem(LOCALE) || "zh";
}

export function setLocale(token: string) {
    return localStorage.setItem(LOCALE, token)
}

export function removeLocale() {
    return localStorage.removeItem(LOCALE);
}

export const SUPPORT_LOCALES = ['en', 'zh'] as const;
export type support_locales = typeof SUPPORT_LOCALES[number];

export const i18n = createI18n({
    // 使用 Composition API 模式，则需要将其设置为false
    legacy: false,
    // 全局注入 $t 函数
    globalInjection: true,
});

const { t } = i18n.global
export const $t = t;

export async function loadLanguageAsync(locale: support_locales) {
    if (locale === "zh") {
        i18n.global.setLocaleMessage(locale, zh_CN);
    } else {
        const result = await getIl8nApi(locale);
        if (result.code === 200) {
            i18n.global.setLocaleMessage(locale, result.data);
        }
    }
    i18n.global.locale.value = locale;
    (document.querySelector('html') as HTMLHtmlElement).setAttribute('lang', locale)
    return nextTick();
}

export default i18n
