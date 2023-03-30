import service from "../utils/request";
import { Resource } from "@/api/types";

export async function getMenuListApi() {
    let result = await service.get<Resource[]>("/resource/menu");
    return result;
}

export async function getAllMenuListApi() {
    let result = await service.get<Resource[]>("/resource/all");
    return result;
}