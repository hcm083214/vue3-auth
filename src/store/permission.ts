import { defineStore } from "pinia";
import { reactive } from "vue";
import { getMenuListApi } from "@/api/menu";
import { Resource } from "@/api/types";
const MENU_LIST = "userMenuList";

const getRolesRoutes = (menusList: Resource[], rolesRoutes: Resource[]) => {
    menusList.forEach(menu => {
        if (menu.children.length > 0) {
            getRolesRoutes(menu.children, rolesRoutes);
        }
        if (menu.component?.trim()) {
            rolesRoutes.push(Object.assign({}, menu, { children: [] }))
        }
    })
}

/**
 * @description: 删除component为空的资源
 * @param {Resource} menusList
 * @return {*}
 */
const getMenuList = (menusList: Resource[]) => {
    let lens = menusList.length
    for (let i = lens - 1; i >= 0; i--) {
        if (menusList[i].children.length > 0) {
            getMenuList(menusList[i].children);
        }
        if (menusList[i].resourceType === "F") {
            menusList.splice(i, 1);
        }
    }
}

export const usePermissionStore = defineStore("permission", () => {
    const usePermissionState = reactive({
        rolesRoutes: [] as Resource[], // 当前角色的菜单数据转化为路由表 layout 下面的 children
        menusList: [] as Resource[],// 后端返回的菜单数据
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
        getMenuList(menusList);
        getRolesRoutes(menusList, usePermissionState.rolesRoutes);

        usePermissionState.menusList = menusList;
    }
    const clearUserPermissionAction = () => {
        usePermissionState.menusList = [];
        usePermissionState.rolesRoutes = [];
        sessionStorage.removeItem(MENU_LIST);
    }
    return { usePermissionState, generateMenusAction, clearUserPermissionAction }
})

