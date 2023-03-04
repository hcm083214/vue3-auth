import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { getUserInfoApi } from "../api/login";
const USER_INFO = "userInformation";
export const useUserStore = defineStore('user', () => {
    const userState = reactive({
        name: '',
        avatar: '',
        roles: [] as number[],
        permissions: [] as number[]
    })
    async function setUserInfoAction() {
        let user = JSON.parse(sessionStorage.getItem(USER_INFO) || "{}");
        if (!sessionStorage.getItem(USER_INFO)) {
            const result = await getUserInfoApi();
            if (result.code === 200) {
                userState.name = result.data.userName;
                userState.avatar = result.data.avatar;
                userState.roles = result.data.roles;
                userState.permissions = result.data.permissions;
                sessionStorage.setItem(USER_INFO, JSON.stringify(result.data));
            }
        } else {
            userState.name = user.userName;
            userState.avatar = user.avatar;
            userState.roles = user.roles;
            userState.permissions = user.permissions;
        }

    }
    return { userState, setUserInfoAction }
})