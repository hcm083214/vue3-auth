import service from "../utils/request";
import { Resource } from "@/api/types";

/**
 * @description: 获取菜单列表
 * @return {*}
 */
export async function getMenuListApi() {
    let result = await service.get<Resource[]>("/resource/menu");
    return result;
}
/**
 * @description: 编辑菜单列表
 * @return {*}
 */
export async function editMenuListApi(params: Resource) {
    return await service.post<Resource[]>(`/resource/menu/resource_id/${params.resourceId}`, {
        data: params
    });
}
/**
 * @description: 编辑菜单列表
 * @return {*}
 */
export async function addMenuListApi(params: Resource) {
    return await service.post<Resource[]>(`/resource/menu`, {
        data: params
    });
}

/**
 * @description: 获取API列表
 * @return {*}
 */
export async function getApiList() {
    return await service.get<Resource[]>("/resource/api");
}

/**
 * @description: 同步API列表
 * @return {*}
 */
export async function syncApiList() {
    return await service.get("/resource/api/sync");
}

/**
 * @description: 获取功能权限列表（菜单+api接口）
 * @return {*}
 */
export async function getResourceApi() {
    let result = await service.get<Resource[]>("/resource/all");
    return result;
}

/**
 * @description: 获取功能权限列表（菜单+api接口）
 * @return {*}
 */
export async function deleteResourceApi(resourceId: number) {
    return await service.post(`/resource/all/resource_id/${resourceId}`, {});
}

/**
 * @description: 编辑资源父id
 * @return {*}
 */
export async function editResourceParentIdApi(data: Resource[]) {
    return await service.post<Resource[]>("/resource/all", {
        data
    });
}