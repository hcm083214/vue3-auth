<template>
    <div :class="isShowSideBar ? 'app-wrapper' : 'app-wrapper hideSidebar'">
        <side-bar class="sidebar-container">
            <logo />
        </side-bar>
        <div class="main-container">
            <nav-bar></nav-bar>
            <router-view />
            <settings />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";

import SideBar from "@/Layout/components/SideBar/SideBar.vue";
import NavBar from "@/Layout/components/NavBar.vue";
import EventBus, { $busKey } from "@/utils/bus";
import Logo from "@/Layout/components/Logo.vue";
import Settings from "@/Layout/components/Settings/Settings.vue";


let isShowSideBar = ref(true);
const eventBus = inject<EventBus>($busKey) as EventBus;
eventBus.on(EventBus.sidebarHandler, (isShow: boolean) => {
    isShowSideBar.value = !isShow;
})
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixin.scss";
@import "../assets/styles/variables.scss";


.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 66px);
}

.sidebarHide .fixed-header {
    width: 100%;
}

.mobile .fixed-header {
    width: 100%;
}
</style>