import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import "./index.css"
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss' // global css
import './assets/styles/ruoyi.scss' // ruoyi css

import router from "./router/index";
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();

app.use(router)
    .use(ElementPlus)
    .use(pinia)
    .mount('#app');

