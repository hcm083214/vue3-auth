import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { getToken } from "../utils/token.js";
import { loginApi } from "../api/login";

export const useUserStore = defineStore('user', () => {
    const userState = reactive({
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: []
    })
    return { userState }
})