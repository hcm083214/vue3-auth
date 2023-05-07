import service from "../utils/request";
import { Resource,Count } from "@/api/types";

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

/**
 * @description: api列表查询
 * @param {number} during
 * @return {*}
 */
export async function getApiListApi() {
    return await service.get<Resource[]>("/resource/api");
}

/**
 * @description: 页面访问量查询
 * @param {number} during
 * @return {*}
 */
export async function getApiUVApi(during: number) {
    return await service.get<Count>("/resource/api/uv", {
        params: {
            during
        }
    });
}

/**
 * @description: Api访问量查询
 * @return {*}
 */
export async function getApiPVApi(resourceId: number,during: number) {
    return await service.get<Resource>(`/resource/api/${resourceId}/pv`,{
        params: {
            during
        }
    });
}