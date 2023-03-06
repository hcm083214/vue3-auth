<template>
    <div :class="configState.isCollapseSideBar ? 'app-wrapper collapseSidebar' : 'app-wrapper'">
        <div class="sidebar-container">
            <logo />
            <side-bar></side-bar>
        </div>
        <div class="main-container">
            <nav-bar></nav-bar>
            <router-view />
        </div>
        <settings />
    </div>
</template>

<script setup lang="ts">
import SideBar from "@/Layout/components/SideBar/SideBar.vue";
import NavBar from "@/Layout/components/NavBar.vue";
import Logo from "@/Layout/components/Logo.vue";
import Settings from "@/Layout/components/Settings/Settings.vue";
import appStore from "@/store/index";

const { configState } = appStore.configStore;
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.scss";


.app-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .sidebar-container {
        max-width: 200px;
        width: 200px;
        height: calc(100% - $base-header-height);
    }

    &.collapseSidebar .sidebar-container {
        width: $base-collapse-sidebar-width;
    }

    .main-container {
        width: calc(100% - $base-sidebar-width);
    }

    &.collapseSidebar .main-container {
        width: calc(100% - $base-collapse-sidebar-width);
    }
}
</style>