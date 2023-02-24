import service from "../utils/request.js";

export async function getCodeApi(type = "string") {
    let result = await service({
        url: "/captcha/image",
        params: {
            type
        },
        headers: {
            isNotSetToken: true
        }
    });
    return result;
}

export async function loginApi(data) {
    let result = await service({
        url: "/login",
        method: "post",
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}

export async function registerApi(data) {
    let result = await service({
        url: "/register",
        method: "post",
        headers: {
            isNotSetToken: true
        },
        data
    });
    return result;
}