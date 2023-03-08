<template>
    <div class="logo-container" :class="{ 'collapse': configState.isCollapseSideBar }">
        <transition name="sidebarLogoFade">
            <router-link v-if="configState.isCollapseSideBar" key="collapse" class="sidebar-logo-link" to="/">
                <img :src="logoImg" class="sidebar-logo" />
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img :src="logoImg" class="sidebar-logo" />
                <h1 class="sidebar-title">
                    {{ title }} </h1>
            </router-link>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import logoImg from '@/assets/logo/logo.svg'
import appStore from "@/store/index"

const { configState } = appStore.configStore;
const title = ref("Auth权限管理");
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.logo-container {
    position: relative;
    width: $base-sidebar-width;
    height: $base-header-height;
    line-height: $base-header-height;
    background: var(--base-logo-background);
    color: var(--base-logo-text-color);
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: var(--base-logo-text-color);
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}

.logo-container.collapse {
    width: $base-collapse-sidebar-width;
}
</style>
