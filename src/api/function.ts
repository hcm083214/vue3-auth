import service from "../utils/request";
import { FunctionResult } from "@/api/types";

export interface FunctionListApiQuery {
    pageNum?: number,
    pageSize?: number,
    roleNameCn?: string,
    roleNameEn?: string,
    status?: number,
    functionKey?: string,
    searchParams?: 'function_name_cn' | 'function_name_en' | 'function_key' 
}
export async function getFunctionListApi(params: FunctionListApiQuery) {
    let result = await service.get<FunctionResult>("/functions", {
        params
    });
    console.log(result)
    return result;
}