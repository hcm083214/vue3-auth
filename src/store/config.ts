import { defineStore } from "pinia";
import { reactive } from "vue";

interface Config {
   layoutType: string,
}
export type configKey = keyof Config;

const defaultValue = {
   "layoutType": 'classic'
}

const getDefault = (key: configKey) => {
   let result = localStorage.getItem("app-config") && JSON.parse(localStorage.getItem("app-config") as string);
   return !!result ? result[key] : defaultValue[key];
}

export const useConfigStore = defineStore('config', () => {
   const configState: Config = reactive({
      layoutType: getDefault("layoutType")
   })
   const setConfigAction = (key: configKey, value: any) => {
      configState[key] = value;
   }
   return { configState, setConfigAction }
})