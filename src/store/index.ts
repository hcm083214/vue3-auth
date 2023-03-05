import { createPinia, Store } from 'pinia';

import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
import { useConfigStore } from "@/store/config";

export const pinia = createPinia();

export interface AppStore {
    userStore: ReturnType<typeof useUserStore>;
    permissionStore: ReturnType<typeof usePermissionStore>;
    configStore: ReturnType<typeof useConfigStore>;
}

const appStore: AppStore = {} as AppStore;

export const registerStore = () => {
    appStore.userStore = useUserStore(pinia);
    appStore.permissionStore = usePermissionStore(pinia);
    appStore.configStore = useConfigStore(pinia);
}

export default appStore;