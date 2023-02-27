import { defineStore } from "pinia";
import { reactive } from "vue";
import { getMenuListApi } from "../api/menu.js";
const MENU_LIST = "userMenuList";

export const usePermissionStore = defineStore("permission", () => {
    const usePermissionState = reactive({
        rolesRoutes: [],
        menusList: [],
    })
    const generateMenusAction = async (permissions) => {
        let menusList = JSON.parse(sessionStorage.getItem(MENU_LIST) || "[]");
        if (!sessionStorage.getItem(MENU_LIST)) {
            const result = await getMenuListApi();
            if (result.code === 200) {
                sessionStorage.setItem(MENU_LIST, JSON.stringify(result.data));
            }
            menusList = result.data;
        }
        menusList.forEach((menu) => {
            let children = menu.children;
            if (Array.isArray(children)) {
                for (let index = children.length - 1; index >= 0; index--) {
                    if (permissions.includes(children[index].menuId)) {
                        usePermissionState.rolesRoutes.push(children[index]);
                    } else {
                        children.splice(index, 1);
                    }
                }
            }
        });
        usePermissionState.menusList = menusList;
    }
    return { usePermissionState, generateMenusAction }
})

