import service from "../utils/request";
import { Role } from "@/api/types";

export interface roleListApiQuery {
    pageNum?: number,
    pageSize?: number,
    roleNameCn?: string,
    roleNameEn?: string,
    status?: string,
    roleKey?: string,
    searchParams?: 'role_name_cn' | 'role_name_en' | 'role_key' 
}
/**
 * @description: 根据 params 的设置获取角色列表
 * @param {roleListApiQuery} params
 * @return {*}
 */
export async function getRoleListApi(params: roleListApiQuery) {
    let result = await service.get<Role>("/roles", {
        params
    });
    return result;
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