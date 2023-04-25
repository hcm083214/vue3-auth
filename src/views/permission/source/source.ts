import { $t } from "@/utils/i18n";

export enum RESOURCETYPE {
    // 目录
    "M" = "M",
    // 菜单
    "C" = "C",
    // 按钮
    "F" = "F",
}

export const resourceType = [
    {
        label: $t('common.catalog'),
        value: RESOURCETYPE.M
    },
    {
        label: $t('common.menu'),
        value: RESOURCETYPE.C
    },
    {
        label: $t('common.button'),
        value: RESOURCETYPE.F
    }
]

export const typeConvert = (type: RESOURCETYPE) => {
    const resource =  resourceType.filter(r=>r.value === type);
    return resource[0].label;
}