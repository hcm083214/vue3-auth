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
    </el-drawer>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import { ref } from 'vue';

import LayoutRadioPicker from "@/Layout/components/Settings/LayoutRadioPicker.vue";
import IconDark from "@/Layout/components/Settings/IconDark.vue";
import IconLight from "@/Layout/components/Settings/IconLight.vue";
import appStore from "@/store/index";
const { configState, setConfigAction } = appStore.configStore;

const isShow = ref(false);

const isNight = ref(configState.isDark);
const nightModeHandler = () => {
    setConfigAction("isDark", isNight.value);
}

</script>

<style scoped lang="scss">
.fixed {
    position: fixed;
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