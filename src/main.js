import { createApp } from 'vue'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'

import "@/index.css"
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'
import '@/assets/styles/ruoyi.scss'

import router from "@/router/index";
import App from '@/App.vue'
import { pinia } from '@/store/index.js'

const app = createApp(App);

app.use(pinia)
    .use(router)
    .use(ElementPlus)
    .mount('#app');



