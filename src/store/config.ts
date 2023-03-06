import { defineStore } from "pinia";
import { reactive } from "vue";

interface Config {
   layoutType: string,
   isShowSideBar: boolean,
   isCollapseSideBar: boolean
}
export type configKey = keyof Config;

const defaultValue: Config = {
   // 布局的方式
   layoutType: 'classic',
   // 是否显示侧边栏
   isShowSideBar: true,
   // 是否折叠侧边栏
   isCollapseSideBar: false,
}

const getDefault = (key: configKey) => {
   let result = localStorage.getItem("app-config") && JSON.parse(localStorage.getItem("app-config") as string);
   return !!result ? result[key] : defaultValue[key];
}

export const useConfigStore = defineStore('config', () => {
   const configState: Config = reactive({
      layoutType: getDefault("layoutType") as string,
      isShowSideBar: getDefault("isShowSideBar") as boolean,
      isCollapseSideBar: getDefault("isCollapseSideBar") as boolean,
   })
   const setConfigAction = (key: configKey, value: any) => {
      configState[key] = value;
   }
   return { configState, setConfigAction }
})