import { createI18n } from "vue-i18n";
import { nextTick } from 'vue'

import { getIl8nPackageApi } from "@/api/config";
import { I18nData } from "@/api/types";
import zh_CN from "@/assets/i18n/zh";
import { isEmptyObj } from "@/utils/index";

const LOCALE = 'Locale'
const LOCALE_PACKAGE = 'locale_package';

export function getLocale() {
    return localStorage.getItem(LOCALE) || "zh";
}

export function setLocale(locale: support_locales) {
    return localStorage.setItem(LOCALE, locale)
}

export function removeLocale() {
    return localStorage.removeItem(LOCALE);
}

function getLocalePackage() {
    const localePackage = localStorage.getItem(LOCALE_PACKAGE);
    return !!localePackage && JSON.parse(localePackage);
}

function setLocalePackage(localePackage: any) {
    const localePackageJson = JSON.stringify(localePackage);
    return localStorage.setItem(LOCALE_PACKAGE, localePackageJson);
}

function removeLocalePackage() {
    return localStorage.removeItem(LOCALE_PACKAGE);
}

export const SUPPORT_LOCALES = ['en', 'zh'] as const;
export type support_locales = typeof SUPPORT_LOCALES[number];

export const i18n = createI18n({
    // 使用 Composition API 模式，则需要将其设置为false
    legacy: false,
    // 全局注入 $t 函数
    globalInjection: true,
    // 关闭waring提示信息
    silentTranslationWarn: true
});

const { t } = i18n.global
export const $t = t;

type LocalePackage = {
    [key: string]: string | LocalePackage
}
function formatLocalePackage(i18nData: I18nData[]) {
    const localePackage = {} as LocalePackage;
    i18nData.forEach(i => {
        if (!localePackage[i.i18nModule]) {
            localePackage[i.i18nModule] = {} as LocalePackage
        }
        (localePackage[i.i18nModule] as LocalePackage)[i.i18nKey] = i.i18nValue;
    })
    return localePackage;
}
function isChangeLocale(locale: support_locales){
    return locale !== getLocale() || !getLocalePackage();
}
/**
 * @description: 异步加载语言包
 * @param {support_locales} locale 
 * @return {*}
 */
export async function loadLanguageAsync(locale: support_locales) {
    if (isChangeLocale(locale)) {
        const result = await getIl8nPackageApi({ locale });
        if (result.code === 200) {
            const localePackage = formatLocalePackage(result.data)
            i18n.global.setLocaleMessage(locale, localePackage);
            setLocalePackage(JSON.stringify(localePackage));
            setLocale(locale);
            location.reload();
        }
    } else {
        i18n.global.setLocaleMessage(locale, JSON.parse(getLocalePackage()));
    }
    i18n.global.locale.value = locale;
    (document.querySelector('html') as HTMLHtmlElement).setAttribute('lang', locale);
    
    return nextTick();
}

export default i18n
