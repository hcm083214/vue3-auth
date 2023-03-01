import { createRouter, createWebHistory } from "vue-router";
import NProgress from 'nprogress';

import Layout from '@/Layout/Layout.vue';
import { getToken } from "@/utils/token.js";
import appStore from "@/store/index.js";


const modules = import.meta.glob("../views/**/**.vue")

// 静态路由
export const staticRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
    },
    {
        path: '/:w+',
        hidden: true,
        redirect: '/404',
    },
    {
        path: '/',
        component: Layout,
        name: 'index',
        redirect: "/home",
        children: [
            {
                path: "/home",
                name: "home",
                component: () => import('@/views/Home.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes,
});
const whiteList = ["/login", "/register"];
NProgress.configure({ showSpinner: false });
router.beforeEach(async (to, from, next) => {

    const { usePermissionState, generateMenusAction } = appStore.permissionStore;
    const { userState, setUserInfoAction } = appStore.userStore;

    NProgress.start();
    if (getToken()) {
        // 登陆后token没过期，路由地址是登陆页直接跳转到首页
        if (to.path === "/login") {
            next({ path: '/' });
        } else {
            // 登陆后，直接放行
            // 设置当前用户的信息，包括姓名，头像，角色，权限信息
            await setUserInfoAction();
            // 设置当前用户的左侧菜单
            await generateMenusAction(userState.permissions);
            // 根据菜单栏生成路由
            generateRoutes(usePermissionState.rolesRoutes);
            // 解决使用动态路由地址直接访问，或者刷新页面导致无法找到路由的问题 No match found
            if (to.path == '/404' && to.redirectedFrom != undefined) {
                next({ path: to.redirectedFrom?.fullPath, replace: true })
            } else {
                next()
            }
        }
    } else {
        // 登陆后token过期,路由地址是白名单直接放行
        if (whiteList.includes(to.path)) {
            next();
        } else {
            // 登陆后token过期，跳转到首页，query 放入当前路由的path
            next({ path: "/login", query: { redirect: to.fullPath } });
        }
    }
});
router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
});

function generateRoutes(menusPath) {
    menusPath.length > 0 && menusPath.forEach(menu => {
        router.addRoute("index", {
            path: `/${menu.path}`,
            name: menu.path,
            // component: () => import(`@/views/${menu.component}.vue`)
            component:
                //需要用vite规定的导入方式导入,否则打包后部署到服务器报错找不到动态导入的文件,
                //对应上方的const modules = import.meta.glob("../views/**/**.vue")
                //使用/* @vite-ignore */则不会在开发是报错
                modules[/* @vite-ignore */`../views/${menu.component}.vue`],
        })
    })
}

export const REDIRECT_KEY = "redirect";
export default router;