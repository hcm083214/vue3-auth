import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from "vue-router";

import { getToken, removeToken } from "./token.js";
import { REDIRECT_KEY } from "@/router/index.js";


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
    baseURL: '/api',
    // 超时
    timeout: 10000
})


service.interceptors.request.use((config) => {
    const token = getToken() || "";
    const isNotSetToken = (config.headers || {}).isNotSetToken;
    if (token && !isNotSetToken) {
        config.headers['Authorization'] = token;
    }
    return config;
})

service.interceptors.response.use(function (response) {
    if (response.status === 200) {
        const data = response.data;
        if (data.code === 401 || data.code === 403) {
            removeToken();
            ElMessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登陆',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                location.href = "/";
            }).catch(() => { })
        }
        return data;
    }

}, function (error) {
    if (error.message.indexOf("timeout") !== -1) {
        ElMessage.error("服务器响应超时");
    } else if (error.message.indexOf("Server Error") !== -1) {
        ElMessage.error("后端接口连接异常");
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;