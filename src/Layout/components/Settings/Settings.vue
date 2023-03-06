<template>
    <div class="fixed pointer" @click="isShow = !isShow">
        <el-icon>
            <Setting />
        </el-icon>
    </div>
    <el-drawer v-model="isShow" title="项目配置">
        <el-divider>主题</el-divider>
        <el-switch v-model="isNight" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="Check"
            :inactive-icon="Close" />
        <el-divider>布局</el-divider>
        <layout-radio-picker />
    </el-drawer>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import { ref } from 'vue';

import LayoutRadioPicker from "@/Layout/components/Settings/LayoutRadioPicker.vue";

const isShow = ref(false);

const isNight = ref(false);

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