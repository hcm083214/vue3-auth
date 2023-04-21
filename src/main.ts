import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import 'virtual:svg-icons-register'

import "@/index.css"
import "@/style.scss"
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
// import '@/assets/styles/ruoyi.scss'
import i18n from "@/utils/i18n";


import App from '@/App.vue'
import { pinia, registerStore } from '@/store/index.js'
import router from "@/router/index";
import EventBus, { $busKey } from './utils/bus'

const bus = new EventBus();
registerStore();

const app = createApp(App);
app.provide($busKey, bus);
// 挂载到this上
app.config.globalProperties.$bus = bus;

app.use(pinia)
    .use(router)
    .use(ElementPlus)
    .use(i18n)
    .mount('#app');