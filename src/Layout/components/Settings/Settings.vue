<template>
    <div class="fixed pointer" @click="isShow = !isShow">
        <el-icon>
            <Setting />
        </el-icon>
    </div>
    <el-drawer v-model="isShow" title="项目配置">
        <el-divider>主题</el-divider>
        <el-switch v-model="isNight" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="IconLight"
            :inactive-icon="IconDark" @change="nightModeHandler" />
        <el-divider>布局</el-divider>
        <layout-radio-picker />
        <el-divider>头部主题</el-divider>
        <color-radio-picker :schemaArr="[
            { backgroundColor: '#fff', textColor: '#000' },
            { backgroundColor: '#009688', textColor: '#fff' },
            { backgroundColor: '#536dfe', textColor: '#fff' },
            { backgroundColor: '#ff5c93', textColor: '#fff' },
            { backgroundColor: '#ee4f12', textColor: '#fff' },
            { backgroundColor: '#9c27b0', textColor: '#fff' },
            { backgroundColor: '#ff9800', textColor: '#fff' },
        ]" @themeChange="topicThemeChange" />
        <el-divider>菜单主题</el-divider>
        <color-radio-picker :schemaArr="[
            { backgroundColor: '#2b2f3a', textColor: '#fff' },
            { backgroundColor: '#fff', textColor: '#000' },
            { backgroundColor: '#5172dc', textColor: '#fff' },
            { backgroundColor: '#24292e', textColor: '#fff' },
            { backgroundColor: '#394664', textColor: '#fff' },
            { backgroundColor: '#009688', textColor: '#fff' },
            { backgroundColor: '#383f45', textColor: '#fff' },
        ]" @themeChange="menuThemeChange" />
    </el-drawer>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import { ref } from 'vue';

import LayoutRadioPicker from "@/Layout/components/Settings/LayoutRadioPicker.vue";
import ColorRadioPicker from "@/Layout/components/Settings/ColorRadioPicker.vue";
import IconDark from "@/Layout/components/Settings/IconDark.vue";
import IconLight from "@/Layout/components/Settings/IconLight.vue";
import appStore from "@/store/index";
import { Schema } from "@/store/config";
import { ElMessage } from 'element-plus';
const { configState, setConfigAction, setThemeAction } = appStore.configStore;

const isShow = ref(false);

const isNight = ref(configState.isDark);
const nightModeHandler = () => {
    setConfigAction("isDark", isNight.value);
}
const topicThemeChange = (theme: Schema) => {
    if (configState.layoutType == "classic") {
        setThemeAction({
            "--base-navbar-background": theme.backgroundColor,
            "--base-navbar-text-color": theme.textColor
        })
    } else if (configState.layoutType == "top-left") {
        setThemeAction({
            "--base-logo-background": theme.backgroundColor,
            "--base-logo-text-color": theme.textColor,
            "--base-navbar-background": theme.backgroundColor,
            "--base-navbar-text-color": theme.textColor
        })
    }else if(configState.layoutType == "top") {
        setThemeAction({
            "--base-logo-background": theme.backgroundColor,
            "--base-logo-text-color": theme.textColor,
            "--base-navbar-background": theme.backgroundColor,
            "--base-navbar-text-color": theme.textColor,
            "--el-menu-bg-color": theme.backgroundColor,
            "--el-menu-text-color": theme.textColor,
        })
    }
}
const menuThemeChange = (theme: Schema) => {
    if (configState.layoutType == "top") {
        setThemeAction({
            "--base-logo-background": theme.backgroundColor,
            "--base-logo-text-color": theme.textColor,
            "--el-menu-bg-color": theme.backgroundColor,
            "--el-menu-text-color": theme.textColor,
        })
    } else if (configState.layoutType == "classic") {
        setThemeAction({
            "--el-menu-bg-color": theme.backgroundColor,
            "--el-menu-text-color": theme.textColor,
            "--base-logo-background": theme.backgroundColor,
            "--base-logo-text-color": theme.textColor
        })
    } else {
        setThemeAction({
            "--el-menu-bg-color": theme.backgroundColor,
            "--el-menu-text-color": theme.textColor,
        })
    }
}
</script>

<style scoped lang="scss">
.fixed {
    position: fixed;
    transform: translateY(-50%);
    top: 50%;
    right: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    background: var(--el-color-primary);
    color: var(--el-color-white);
}
</style>