import service from "@/utils/request";
import { data } from "@/assets/i18n/data";

interface I18nData {
    "en-US": {
        [prop: string]: string;
    },
    "zh-CN": {
        [prop: string]: string;
    }
}

export async function getIl8nApi(locale: string) {
    // let result = await service.get<I18nData>(`../../assets/il8n/data.json`);
    return data;
}