import service from "../utils/request";
import { RoleList,Page } from "@/api/types";

export interface roleListApiQuery {
    roleId?: number,
    pageNum?: number,
    pageSize?: number,
    roleNameCn?: string,
    roleNameEn?: string,
    status?: string,
    functionKey?: string,
    functionJson?: string,
    searchParams?: 'role_name_cn' | 'role_name_en' | 'function_key'
}
/**
 * @description: 根据 params 的设置获取角色列表
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function getRoleListApi(params: roleListApiQuery) {
    let result = await service.get<Page<RoleList>>("/roles", {
        params
    });
    return result;
}

/**
 * @description: 角色信息修改
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function editRoleInfoApi(params: roleListApiQuery) {
    return await service.post(`/roles/role_id/${params.roleId}`, {
        data: params
    });
}

/**
 * @description: 角色新增
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function addRoleInfoApi(params: roleListApiQuery) {
    return await service.post(`/roles`, {
        data: params
    });
}

/**
 * @description: 得到参数列表,供角色查询项目的联想搜索
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function getRoleSearchListApi(params: roleListApiQuery) {
    let result = await service.get<string[]>("/roles/params", {
        params,
    });
    return result;
}
/**
 * @description: 导出角色列表
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function exportRoleListApi(params: roleListApiQuery) {
    let result = await service.get("/roles/export", {
        params,
        responseType: 'blob'
    });
    return result;
}
/**
 * @description: 角色列表模板导出
 * @return {*}
 */
export async function importTemplateApi() {
    let result = await service.get("/roles/import-template", {
        responseType: 'blob'
    });
    return result;
}
/**
 * @description: 角色列表导入
 * @param {any} data
 * @return {*}
 */
export async function importRoleListApi(data: any) {
    let result = await service.post("/roles/import", {
        responseType: 'blob',
        data
    });
    return result;
}
