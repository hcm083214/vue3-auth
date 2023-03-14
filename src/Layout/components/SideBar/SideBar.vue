<template>
    <div class="sidebar-wrap">
        <slot></slot>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeIndex" :collapse="configState.isCollapseSideBar"
                :active-text-color="activeTextColor" :background-color="configState.theme['--el-menu-bg-color']" class="el-menu-vertical"
                :text-color="configState.theme['--el-menu-text-color']" :mode="menuMode">
                <sidebar-item v-for="item in sidebarRouters.router" :key="item.menuId" :item="item" :index="item.path"
                    :grade="1"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';


import SidebarItem from "./SidebarItem.vue";

import { usePermissionStore } from "@/store/permission";
import { Menu } from "@/api/types";
import appStore from "@/store/index";

const props = defineProps({
    menuMode: {
        type: String,
        default: "vertical"
    },
    activeTextColor: {
        type: String,
        default: "#ffd04b"
    },
})

const { usePermissionState } = appStore.permissionStore;
const result = usePermissionState.menusList || [];
const sidebarRouters = reactive({
    router: {} as Menu[]
});
if (result.length > 0) {
    sidebarRouters.router = result.sort((a, b) => Number(a.orderNum) - Number(b.orderNum));
}
const { configState } = appStore.configStore;
// const isCollapse = ref(false);
// const eventBus = inject<EventBus>($busKey) as EventBus;
// eventBus.on(EventBus.sidebarHandler, (isShow:boolean) => {
//     console.log(isShow)
//     isCollapse.value = isShow;
// })

const activeIndex = ref(result[0].path);
const route = useRoute();
watch(route, () => {
    activeIndex.value = route.path.replace("/", "");
}, {
    immediate: true
})

</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.sidebar-wrap {
    -webkit-transition: width .28s;
    transition: width 0.28s;
    width: 100%;
    background-color: var(--base-menu-background);
    height: 100%;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);

    &.horizontal-sidebar{
        box-shadow: none;
    }

    // reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
        right: 0px;
    }

    .el-scrollbar {
        height: 100%;
    }

    &.has-logo {
        .el-scrollbar {
            height: calc(100% - 50px);
        }
    }

    .is-horizontal {
        display: none;
    }

    a {
        display: inline-block;
        overflow: hidden;
    }

    .svg-icon {
        margin-right: 16px;
    }

    .el-menu {
        border: none;
        height: 100%;
        width: 100% !important;
    }

    .el-menu-item,
    .el-submenu__title {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    // menu hover
    .submenu-title-noDropdown,
    .el-submenu__title {
        &:hover {
            background-color: rgba(0, 0, 0, 0.06) !important;
        }
    }

    & .theme-dark .is-active>.el-submenu__title {
        color: $base-menu-color-active !important;
    }

    & .nest-menu .el-submenu>.el-submenu__title,
    & .el-submenu .el-menu-item {
        min-width: $base-sidebar-width !important;

        &:hover {
            background-color: rgba(0, 0, 0, 0.06) !important;
        }
    }

    & .theme-dark .nest-menu .el-submenu>.el-submenu__title,
    & .theme-dark .el-submenu .el-menu-item {
        background-color: $base-sub-menu-background !important;

        &:hover {
            background-color: $base-sub-menu-hover !important;
        }
    }
}

.scrollbar-wrapper {
    height: 100%;
}

:deep(.el-scrollbar__view) {
    height: 100%;
}

.el-menu-vertical {
    height: 100%;
}
</style>