import { defineStore } from "pinia";
import { reactive } from "vue";

import { setCssVar } from "@/utils/index";

interface Theme {
   "--base-logo-background"?: string,
   "--base-logo-text-color"?: string,
}
export type themeKey = keyof Theme;

interface Config {
   layoutType: string,
   isShowSideBar: boolean,
   isCollapseSideBar: boolean,
   isDark: boolean,
   theme: Theme,
}
export type configKey = keyof Config;

const defaultValue: Config = {
   // 布局的方式
   layoutType: 'classic',
   // 是否显示侧边栏
   isShowSideBar: true,
   // 是否折叠侧边栏
   isCollapseSideBar: false,
   // 是否为黑夜模式
   isDark: false,
   // 主题
   theme: {
      // logo背景色
      "--base-logo-background":"#2b2f3a",
      // logo文字颜色
      "--base-logo-text-color": "#001529",
   },
}

const getDefault = (key: configKey) => {
   let result = localStorage.getItem("app-config") && JSON.parse(localStorage.getItem("app-config") as string);
   return !!result ? result[key] : defaultValue[key];
}
function setIsDark(isDark: boolean) {
   if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
   } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
   }
}
export const useConfigStore = defineStore('config', () => {
   const configState: Config = reactive({
      layoutType: getDefault("layoutType") as string,
      isShowSideBar: getDefault("isShowSideBar") as boolean,
      isCollapseSideBar: getDefault("isCollapseSideBar") as boolean,
      isDark: getDefault("isDark") as boolean,
      theme: getDefault("theme") as Theme,
   })
   const setConfigAction = (key: configKey, value: any) => {
      configState[key] = value;
      localStorage.setItem("app-config", JSON.stringify(configState));
      if (key === "isDark") {
         setIsDark(value)
      }
   }
   const setThemeAction = (theme:Theme) => {
      console.log("🚀 ~ file: config.ts:67 ~ setThemeAction ~ theme:",configState.theme, theme)
      Object.assign(configState.theme, theme);
      Object.keys(configState.theme).forEach(key => setCssVar(key, configState.theme[key]))
      localStorage.setItem("app-config", JSON.stringify(configState));
   }
   return { configState, setConfigAction, setThemeAction }
})