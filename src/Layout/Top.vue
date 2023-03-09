<template>
    <div :class="configState.isCollapseSideBar ? 'app-wrapper collapseSidebar' : 'app-wrapper'">
        <div class="main-container">
            <nav-bar :isShowBreadCrumb="false">
                <template v-slot:logo>
                    <logo />
                </template>
                <template v-slot:side-bar>
                    <side-bar menuMode="horizontal" activeTextColor="#409eff" class="horizontal-sidebar"></side-bar>
                </template>
            </nav-bar>
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

const { configState, setThemeAction } = appStore.configStore;
setThemeAction({
    "--base-logo-background": configState.theme["--base-navbar-background"],
    "--base-logo-text-color": configState.theme["--base-navbar-text-color"],
    "--el-menu-bg-color": configState.theme["--base-navbar-background"],
    "--el-menu-text-color": configState.theme["--base-navbar-text-color"],
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.scss";


.app-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .main-container {
        width: calc(100%);
    }
}
</style>