import service from "@/utils/request";
import { I18nData,Page } from "@/api/types";
import { data } from "@/assets/i18n/data";
import { getLocale } from "@/utils/i18n";

export interface i18nParams {
    pageNum?: number,
    pageSize?: number,
    // 语言环境
    locale?:string,
    data?:I18nData[] | I18nData
}

/**
 * @description: 得到国际化数据的列表
 * @param {i18nParams} params
 * @return {*}
 */
export async function getIl8nListApi(params: i18nParams) {
    return await service.get<Page<I18nData>>(`/i18n`, {
        params
    });
}

/**
 * @description: 新增一个key对应的语言
 * @param {i18nParams} params
 * @return {*}
 */
export async function addIl8nListApi(params: i18nParams) {
    return await service.post<Page<I18nData>>(`/i18n`, {
        data: params.data
    });
}

/**
 * @description: 修改数据
 * @param {i18nParams} params
 * @return {*}
 */
export async function editIl8nListApi(params: i18nParams) {
    return await service.post<Page<I18nData>>(`/i18n/i18n_id/${(params.data as I18nData).i18nId}`, {
        data: params.data
    });
}

/**
 * @description: 得到整个语言环境所有的国际化数据
 * @param {i18nParams} params
 * @return {*}
 */
export async function getIl8nPackageApi(params: i18nParams) {
    return await service.get<I18nData[]>(`/i18n/all`, {
        params
    });
}