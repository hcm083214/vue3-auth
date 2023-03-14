import { defineStore } from "pinia";
import { reactive } from "vue";
import { getMenuListApi } from "@/api/menu";
import { Menu } from "@/api/types";
const MENU_LIST = "userMenuList";

const getRolesRoutes = (menusList: Menu[], rolesRoutes: Menu[]) => {
    menusList.forEach(menu => {
        if (menu.children.length > 0) {
            getRolesRoutes(menu.children, rolesRoutes);
        }
        if (menu.component) {
            rolesRoutes.push(Object.assign({},menu, { children: [] }))
        }
    })
}

export const usePermissionStore = defineStore("permission", () => {
    const usePermissionState = reactive({
        rolesRoutes: [] as Menu[], // 当前角色的菜单数据转化为路由表 layout 下面的 children
        menusList: [] as Menu[],// 后端返回的菜单数据
    })
    const generateMenusAction = async (permissions: number[]) => {
        let menusList = JSON.parse(sessionStorage.getItem(MENU_LIST) || "[]");
        if (!sessionStorage.getItem(MENU_LIST)) {
            const result = await getMenuListApi();
            if (result.code === 200) {
                sessionStorage.setItem(MENU_LIST, JSON.stringify(result.data));
            }
            menusList = result.data;
        }
        getRolesRoutes(menusList, usePermissionState.rolesRoutes);

        usePermissionState.menusList = menusList;
    }
    return { usePermissionState, generateMenusAction }
})

