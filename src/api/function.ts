import service from "../utils/request";
import { FunctionResult } from "@/api/types";

export interface FunctionListApiQuery {
    functionId?: number,
    pageNum?: number,
    pageSize?: number,
    functionNameCn?: string,
    functionNameEn?: string,
    status?: string,
    functionKey?: string,
    permissionIds?: number[],
    searchParams?: 'function_name_cn' | 'function_name_en' | 'function_key'
}
/**
 * @description: 分页获取功能权限详情列表
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function getFunctionListApi(params: FunctionListApiQuery) {
    let result = await service.get<FunctionResult>("/functions", {
        params
    });
    return result;
}

/**
 * @description: 获取功能权限（菜单权限）的id
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function getPermissionIdListApi(params: FunctionListApiQuery) {
    let result = await service.get<number[]>(`/functions/function_id/${params.functionId}`);
    return result;
}

/**
 * @description: 编辑功能权限（菜单权限）的信息
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function editFunctionInfoApi(params: FunctionListApiQuery) {
    let result = await service.post<number[]>(`/functions/function_id/${params.functionId}`, {
        data: params
    });
    return result;
}

/**
 * @description: 新增功能权限（菜单和按钮权限）
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function addFunctionInfoApi(params: FunctionListApiQuery) {
    let result = await service.post<number[]>(`/functions`, {
        data: params
    });
    return result;
}

/**
 * @description: 分页导出功能权限（菜单权限）的列表
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function getExportDataApi(params: FunctionListApiQuery) {
    let result = await service.get(`/functions/export`, {
        params,
        responseType: 'blob',
    });
    return result;
}

/**
 * @description: 分页导出功能权限（菜单权限）的模板
 * @return {*}
 */
export async function getExportTemplateApi() {
    let result = await service.get(`/functions/export-template`, {
        responseType: 'blob',
    });
    return result;
}

/**
 * @description: 搜索栏联想查询结果
 * @param {FunctionListApiQuery} params
 * @return {*}
 */
export async function getFunctionSearchListApi(params: FunctionListApiQuery) {
    let result = await service.get<string[]>(`/functions/params`, {
        params
    });
    return result;
}

