<template>
    <div :class="configState.isCollapseSideBar ? 'app-wrapper collapseSidebar' : 'app-wrapper'">
        <div class="main-container">
            <nav-bar>
                <template v-slot:logo>
                    <logo />
                </template>
                <template v-slot:side-bar>
                    <side-bar ></side-bar>
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

const { configState } = appStore.configStore;
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