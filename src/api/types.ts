export interface Captcha {
    uuid: string,
    captchaEnabled: boolean,
    base64Url: string,
}

export interface UserInfo {
    uuid: string,
    roleId: number,
    userName: string,
    userType: string,
    avatar: string,
    token: string,
    roleIds: number[],
    authorizeUrl: Location,
    permissions: number[],
}

export interface Resource {
    resourceId: number,
    resourceName: string,
    parentId: number,
    component: string,
    path: string,
    icon: string,
    perms?: string,
    orderNum?: string,
    resourceType: string,
    children: Resource[]
}

export interface RoleList {
    roleId: number,
    roleNameCn: string,
    roleNameEn: string,
    roleDescriptionCn: string,
    roleDescriptionEn: string,
    functionJson: string,
    functionList: FunctionList[],
    roleSort?: number,
    status?: string,
    createTime?: Date
}

export interface Page<T> {
    total: number,
    pageNum: number,
    pageSize: number,
    pages: number,
    list: T[]
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

export interface I18nData {
    i18nId:number,
    locale:string,
    i18nModule:string,
    i18nKey:string,
    i18nValue:string,
    createTime?:Date,
}