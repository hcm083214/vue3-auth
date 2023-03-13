import { defineStore } from "pinia";
import { reactive } from "vue";
import { getMenuListApi } from "@/api/menu";
import { Menu } from "@/api/types";
const MENU_LIST = "userMenuList";

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
        menusList.length > 0 && menusList.forEach((menu: Menu) => {
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

