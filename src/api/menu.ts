import service from "../utils/request";
import { Menu } from "@/api/types";

export async function getMenuListApi() {
    let result = await service.get<Menu[]>("/menus");
    return result;
}