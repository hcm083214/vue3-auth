import service from "../utils/request";
import { UserInfo, Captcha } from "@/api/types"

interface LoginRequestData {
    userName: string,
    password: string,
    code: string,
    // 验证码开关
    captchaEnabled: boolean,
    // 验证码图片地址
    codeUrl: string,
    uuid: string,
}

/**
 * @description: 获取验证码
 * @param {*} type string | math
 * @return {*}
 */
export async function getCodeApi(type = "string") {
    let result = await service.get<Captcha>("/captcha/image", {
        params: {
            type
        },
        headers: {
            isNotSetToken: true
        }
    });
    return result;
}

/**
 * @description: 登入服务
 * @param {LoginRequestData} data
 * @return {*}
 */
export async function loginApi(data: LoginRequestData) {
    let result = await service.post<UserInfo>("/login", {
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}

/**
 * @description: 注册服务
 * @param {LoginRequestData} data
 * @return {*}
 */
export async function registerApi(data: LoginRequestData) {
    let result = await service.post<UserInfo>("/register", {
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}

/**
 * @description: 得到登陆用户信息
 * @return {*}
 */
export async function getUserInfoApi() {
    const result = await service.get<UserInfo>("/user");
    return result;
}

/**
 * @description: 用户登出
 * @return {*}
 */
export async function logoutApi() {
    return await service.post<UserInfo>("/logout", {});
}

/**
 * @description: 第三方登录
 * @param {string} source 第三方
 * @return {*}
 */
export async function preLoginByThirdPartyApi(source: string) {
    return await service.get<UserInfo>("/login-third-party", {
        params: {
            source
        },
        headers: {
            isNotSetToken: true
        }
    });
}
