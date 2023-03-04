import { createPinia, Store } from 'pinia';

import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";

export const pinia = createPinia();

export interface AppStore {
    userStore: ReturnType<typeof useUserStore>;
    permissionStore: ReturnType<typeof usePermissionStore>;
}

const appStore: AppStore = {} as AppStore;

export const registerStore = () => {
    appStore.userStore = useUserStore(pinia);
    appStore.permissionStore = usePermissionStore(pinia);
}

export default appStore;