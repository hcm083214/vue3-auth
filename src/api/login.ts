import service from "../utils/request";
import { UserInfo,Captcha } from "@/api/types"

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

export async function loginApi(data: LoginRequestData) {
    let result = await service.post<UserInfo>("/login", {
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}

export async function registerApi(data: LoginRequestData) {
    let result = await service.post<UserInfo>("/register", {
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}

export async function getUserInfoApi() {
    const result = await service.get<UserInfo>("/user");
    return result;
}