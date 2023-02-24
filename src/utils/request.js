import axios from "axios";
import NProgress from 'nprogress'

import { getToken } from "./token.js";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
    baseURL: '/api',
    // 超时
    timeout: 10000
})


service.interceptors.request.use((config) => {
    const token = getToken() || "";
    const isNotSetToken = (config.headers || {}).isNotSetToken;
    if(token && !isNotSetToken) {
        config.headers['Authorization'] = token;
    }
    return config;
})

service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.status === 200) {
        return response.data;
    }

}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;