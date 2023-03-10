export interface Captcha {
    uuid: string,
    captchaEnabled: boolean,
    base64Url: string,
}

export interface UserInfo {
    roleId: number,
    userName: string,
    userType: string,
    avatar: string,
    token: string,
    roles: number[],
    permissions: number[],
}

export interface Menu {
    menuId: number,
    menuName: string,
    component: string,
    path: string,
    icon: string,
    perms: string,
    orderNum: string,
    children: Menu[]
}