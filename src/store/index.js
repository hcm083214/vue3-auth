import { createPinia } from 'pinia';

import { useUserStore } from "@/store/user.js";
import { usePermissionStore } from "@/store/permission.js";

export const pinia = createPinia();

const appStore = {};

export const registerStore = () => {
    appStore.userStore = useUserStore(pinia);
    appStore.permissionStore = usePermissionStore(pinia);
}
registerStore();
export default appStore;