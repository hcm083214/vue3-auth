import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError
} from "axios";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getToken, removeToken } from "./token.js";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service: AxiosInstance = axios.create({
    baseURL: '/api',
    // 超时
    timeout: 10000
})

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken() || "";
    // 从请求头中获取 isNotSetToken，如果为 false 代表不需要携带 token
    const isNotSetToken = (config.headers || {}).isNotSetToken;
    if (token && !isNotSetToken) {
        config.headers['Authorization'] = token;
    }
    return config;
})

service.interceptors.response.use((response: AxiosResponse) => {
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
                // 使用 location.reload() 会导致页面手动刷新，导致 router direction path 会导航到404
                location.reload();
                // router.push({ path: "/login", query: { redirect: route.fullPath } });
            })
        }
        return data;
    }
}, function (error: AxiosError) {
    if (error.message.indexOf("timeout") !== -1) {
        ElMessage.error("服务器响应超时");
    } else if (error.message.indexOf("Server Error") !== -1) {
        ElMessage.error("后端接口连接异常");
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
interface ResultData<T> {
    code: number;
    msg: string;
    data: T
}
export default {
    get<T>(url: string, option?: Object): Promise<ResultData<T>> {
        return service.get(url, option);
    },
    post<T>(url: string, option: AxiosRequestConfig): Promise<ResultData<T>> {
        return service.post(url, option.data, option);
    }
};