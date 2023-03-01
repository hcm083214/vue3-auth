<template>
    <div class="navbar">
        <div class="left-menu">
            <div :class="isShow ? 'hamburger-container ' : 'hamburger-container reverse'" @click="toggleSideBar">
                <img :src="hamburger" />
            </div>
            <el-breadcrumb separator="/">
                <template v-for="(menu, index) in data.breadcrumbArr" :key="menu.id">
                    <el-breadcrumb-item v-if="index">
                        <span style="color: #999;">{{ menu.menuName }}</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-else :to="{ name: menu.path }">
                        <span>{{ menu.menuName }}</span>
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>
        <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <el-icon><CaretBottom /></el-icon>
                </div>
                <el-dropdown-menu>
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item @click="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import { CaretBottom } from "@element-plus/icons-vue";

import hamburger from "../assets/svg/hamburger.svg";
import appStore from "@/store/index.js";
import avatarSvg from "@/assets/images/avatar.svg";


const { permissionStore, userStore } = appStore;

const avatar = ref(userStore.userState.avatar || avatarSvg)

const route = useRoute();
const data = reactive({
    breadcrumbArr: [],
})

const bus = inject('$bus')
const isShow = ref(false);
const toggleSideBar = () => {
    isShow.value = !isShow.value;
    bus.emit("sidebarHandler", isShow.value);
}


watch(route, (route) => {

    data.breadcrumbArr = [];
    const path = route.path.replace("/", "")
    permissionStore.usePermissionState.menusList.forEach((menu) => {
        if (menu.path === path) {
            data.breadcrumbArr.push(menu);
        } else {
            menu.children.forEach((child) => {
                if (child.path === path) {
                    data.breadcrumbArr.push({
                        path: "/home",
                        name: 'home',
                        menuName: "首页",
                    })
                    data.breadcrumbArr.push(menu);
                    data.breadcrumbArr.push(child);
                }
            })
        }
    })
}, { immediate: true })


</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
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
        display:flex;
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
            display:flex;
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
                display:flex;
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
