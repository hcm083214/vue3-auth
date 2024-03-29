<template>
    <div class="navbar-wrap">
        <div class="left-menu">
            <slot name="logo"></slot>
            <slot name="side-bar"></slot>
            <div v-if="isShowBreadCrumb" :class="isCollapse ? 'hamburger-container ' : 'hamburger-container reverse'"
                @click="toggleSideBar">
                <icon icon="svg-icon:hamburger" :size="20"></icon>
            </div>
            <el-breadcrumb separator="/" v-if="isShowBreadCrumb" ref="breadCrumb" :style="{
                    '--el-text-color-regular': configStore.configState.theme['--base-navbar-text-color'],
                    '--el-text-color-primary': configStore.configState.theme['--base-navbar-text-color']
                }">
                <template v-for="(menu, index) in     data.breadcrumbArr" :key="menu.id">
                    <el-breadcrumb-item v-if="index">
                        <span>{{ menu.resourceName }}</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-else :to="{ name: menu.path }">
                        <span>{{ menu.resourceName }}</span>
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>
        <div class="right-menu">
            <locale />
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <el-icon>
                        <CaretBottom />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <router-link to="/user/profile">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item @click="logout">
                            <span>退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CaretBottom } from "@element-plus/icons-vue";

import avatarSvg from "@/assets/svg/avatar.svg";
import appStore from "@/store/index.js";
import EventBus, { $busKey } from "@/utils/bus";
import { Resource } from "@/api/types";
import Icon from "@/components/Icon.vue";
import { logoutApi } from "@/api/login";
import { removeToken } from "@/utils/token";
import Locale from "@/components/Locale.vue";

const props = defineProps({
    isShowBreadCrumb: {
        type: Boolean,
        default: true
    }
})

const { permissionStore, userStore, configStore } = appStore;

const avatar = ref(userStore.userState.avatar || avatarSvg)

const route = useRoute();
const router = useRouter();
const data = reactive({
    breadcrumbArr: [] as Resource[],
})

const bus = inject<EventBus>($busKey) as EventBus;

let isCollapse = ref(configStore.configState.isCollapseSideBar);
const toggleSideBar = () => {
    // store 模式
    isCollapse.value = !isCollapse.value;
    configStore.setConfigAction("isCollapseSideBar", isCollapse.value)
    // 事件总线模式
    // isShow.value = !isShow.value;
    // bus.emit(EventBus.sidebarHandler, isShow.value);
}
// 设置面包屑的数据
const setBreadCrumb = (menuList: Resource[], pathName: string, tempArr: Resource[]) => {
    menuList.forEach((menu, index) => {
        const temp = [...tempArr] as Resource[];
        if (menu.path === pathName) {
            data.breadcrumbArr = [...temp, menu];
        } else {
            temp.push(menu);
            setBreadCrumb(menu.children, pathName, temp);
        }
    })
}
// 监听路由变化设置面包屑的数据
watch(() => route.path, (paths) => {
    data.breadcrumbArr = [];
    const pathName = paths.replace("/", "")
    setBreadCrumb(permissionStore.usePermissionState.menusList, pathName, []);
}, { immediate: true })

const logout = async () => {
    const result = await logoutApi();
    if (result.code === 200) {
        removeToken();
        permissionStore.clearUserPermissionAction();
        userStore.clearUserInfoAction();
        router.push({ name: 'login' })
    }
}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.navbar-wrap {
    height: $base-header-height;
    overflow: hidden;
    position: relative;
    background: var(--base-navbar-background);
    color: var(--base-navbar-text-color);
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-menu {
        display: flex;
        justify-content: center;

        :deep(.el-breadcrumb) {
            display: flex;
            justify-content: center;
        }
    }

    .hamburger-container {
        padding: 0 15px;
        cursor: pointer;
        transition: all .3s;
        -webkit-tap-highlight-color: transparent;
        display: flex;
        align-items: center;

        &>img {
            width: 20px;
        }

        &.reverse>img {
            transform: rotate(0.5turn);
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        display: flex;
        justify-content: center;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;
            display: flex;
            justify-content: center;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;
                display: flex;
                justify-content: center;

                .user-avatar {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
