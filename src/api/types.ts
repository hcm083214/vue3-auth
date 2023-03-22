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
export interface RoleList {
    roleId: number,
    roleNameCn: string,
    roleNameEn: string,
    roleKey: string,
    roleSort: number,
    status: string,
    createTime: Date
}
export interface Role {
    total: number,
    pageNum: number,
    pageSize: number,
    pages: number,
    list: RoleList[]
}