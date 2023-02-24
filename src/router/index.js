import { createRouter, createWebHistory } from "vue-router";
import Layout from '../Layout/Layout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/Register.vue'),
        },
        {
            path: '/',
            component: Layout,
            redirect:"/home",
            children:[
                {
                    path:"/home",
                    name:"index",
                    component:()=>import('../views/Home.vue'),
                }
            ]
        },
    ]
})

export default router;