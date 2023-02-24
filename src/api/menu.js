import service from "../utils/request.js";

export async function getMenuListApi() {
    let result = await service("/menus");
    return result;
}