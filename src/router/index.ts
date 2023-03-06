import { createRouter, createWebHistory } from "vue-router";
import NProgress from 'nprogress';

import Layout from '@/Layout/Layout.vue';
import { getToken } from "@/utils/token";
import appStore from "@/store/index";
import { Menu } from "@/api/types";

const modules = import.meta.glob("../views/**/**.vue")

/**
 * 
// 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限

name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
    roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
    title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

    // 当路由设置了该属性，则会高亮相对应的侧边栏。
    // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
    // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
    activeMenu: '/article/list'
}
 */

// 静态路由
const constantRoutes = [
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
    routes: constantRoutes,
});
const whiteList = ["/login", "/register"];
NProgress.configure({ showSpinner: false });
router.beforeEach(async (to, from, next) => {
    // 采用对象解构 usePermissionState 不再具有响应式，const { usePermissionState } = storeToRefs(usePermissionState)
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

function generateRoutes(menusPath:Menu[]) {
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