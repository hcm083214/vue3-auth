export function setCssVar(key: string, value: any, dom = document.documentElement) {
    dom.style.setProperty(key, value)
}