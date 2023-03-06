import { inject, ref, toRefs } from "vue";

import EventBus, { $busKey } from "@/utils/bus";
import appStore from "@/store/index";

export function useLayout() {
    const { configState } = appStore.configStore;
    return configState;
    // return toRefs(configState);
    // let isShowSideBar = ref(true);
    // const eventBus = inject<EventBus>($busKey) as EventBus;
    // eventBus.on(EventBus.sidebarHandler, (isShow: boolean) => {
    //     isShowSideBar.value = !isShow;
    // })
    // return {isShowSideBar}
}

