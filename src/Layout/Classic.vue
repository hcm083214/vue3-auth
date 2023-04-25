<template>
    <div :class="configState.isCollapseSideBar ? 'app-wrapper collapseSidebar' : 'app-wrapper'">
        <div class="sidebar-container">
            <logo />
            <side-bar></side-bar>
        </div>
        <div class="main-container">
            <div class="app-header">
                <nav-bar></nav-bar>
                <!-- <tags-view></tags-view> -->
            </div>
            <div class="app-main">
                <div class="app-container">
                    <router-view />
                </div>
            </div>
        </div>
        <settings />
    </div>
</template>

<script setup lang="ts">
import SideBar from "@/Layout/components/SideBar/SideBar.vue";
import NavBar from "@/Layout/components/NavBar.vue";
import TagsView from "@/Layout/components/TagsView.vue";
import Logo from "@/Layout/components/Logo.vue";
import Settings from "@/Layout/components/Settings/Settings.vue";
import appStore from "@/store/index";

const { configState, setThemeAction } = appStore.configStore;
setThemeAction({
    "--base-logo-background": configState.theme["--el-menu-bg-color"],
    "--base-logo-text-color": configState.theme["--el-menu-text-color"],
    "--el-menu-bg-color": configState.theme["--el-menu-bg-color"],
    "--el-menu-text-color": configState.theme["--el-menu-text-color"],
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.scss";


.app-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    &.collapseSidebar {
        .sidebar-container {
            width: $base-collapse-sidebar-width;
        }

        .main-container {
            width: calc(100% - $base-collapse-sidebar-width);
            margin-left: $base-collapse-sidebar-width;
        }

        .main-container {
            width: calc(100% - $base-collapse-sidebar-width);

            .app-header {
                width: calc(100% - $base-collapse-sidebar-width);
            }
        }
    }

    .sidebar-container {
        max-width: 200px;
        width: 200px;
        height: calc(100% - $base-header-height);
        position: fixed;
        z-index: 10;
    }

    .main-container {
        width: calc(100% - $base-sidebar-width);
        margin-left: $base-sidebar-width;

        .app-header {
            position: fixed;
            z-index: 10;
            width: calc(100% - $base-sidebar-width);
        }

        .app-main {
            margin-top: $base-header-height ;
        }
    }

}
</style>