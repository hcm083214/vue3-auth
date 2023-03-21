import service from "../utils/request";
import { Role } from "@/api/types";

export interface roleListApiQuery {
    pageNum: number,
    pageSize: number
}
export async function getRoleListApi(params: roleListApiQuery) {
    let result = await service.get<Role>("/roles", {
        params
    });
    return result;
}
export async function exportRoleListApi(params: roleListApiQuery) {
    let result = await service.get<Role>("/roles/export", {
        params,
        responseType: 'blob'
    });
    return result;
}

export async function importTemplateApi() {
    let result = await service.get<Role>("/roles/import-template", {
        responseType: 'blob'
    });
    return result;
}

export async function importRoleListApi(data:any) {
    let result = await service.post<Role>("/roles/import-template", {
        responseType: 'blob',
        data
    });
    return result;
}