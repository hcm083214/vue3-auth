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

export interface Resource {
    resourceId: number,
    resourceName: string,
    component: string,
    path: string,
    icon: string,
    perms: string,
    orderNum: string,
    children: Resource[]
}
export interface RoleList {
    roleId: number,
    roleNameCn: string,
    roleNameEn: string,
    functionKey: string,
    roleSort: number,
    status: number,
    createTime: Date
}
export interface Role {
    total: number,
    pageNum: number,
    pageSize: number,
    pages: number,
    list: RoleList[]
}
export interface FunctionList {
    functionId: number,
    functionNameCn: string,
    functionNameEn: string,
    functionKey: string,
    functionDescriptionCn: string,
    functionDescriptionEn: string,
    status?: string,
    createTime?: Date,
    createBy?: string,
    updateTime?: Date,
    updateBy?: string,
}

export interface FunctionResult {
    total: number,
    pageNum: number,
    pageSize: number,
    pages: number,
    list: FunctionList[]
}