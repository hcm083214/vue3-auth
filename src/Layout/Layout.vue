<template>
    <div :class="isShowSideBar ? 'app-wrapper' : 'app-wrapper hideSidebar'">
        <side-bar class="sidebar-container" />
        <div class="main-container">
            <div>
                <nav-bar />
                <!-- <tags-view v-if="needTagsView" /> -->
            </div>
            <!-- <app-main /> -->
            <router-view />
            <!-- <right-panel>
                <settings />
            </right-panel> -->
        </div>
    </div>
</template>

<script setup>
import SideBar from "@/layout/SideBar/SideBar.vue";
import NavBar from "@/layout/NavBar.vue";
import { inject, ref } from "vue";


let isShowSideBar = ref(true);
const eventBus = inject("$bus");
eventBus.on("sidebarHandler", (isShow) => {
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