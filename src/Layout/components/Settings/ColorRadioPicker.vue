<template>
    <div class="color-radio-picker-warp">
        <span v-for="(item, i) in schema" :key="`radio-${i}`" class="pointer" :class="{ 'is-active': colorVal === item }"
            :style="{
                backgroundColor: item
            }" @click="colorPickerHandler(item)">
            <Icon v-if="colorVal === item" color="#fff" icon="ep:check" :size="16" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import appStore from "@/store/index";

const { configState, setThemeAction } = appStore.configStore;

const props = defineProps({
    schema: {
        type: Array,
        default: () => ([])
    }
})
let colorVal = ref(props.schema[0]);
const colorPickerHandler = (value: string) => {
    colorVal.value = value;
    if (configState.layoutType == "classic") {
        setThemeAction({
            "--base-navbar-background": value
        })
    } else {
        setThemeAction({
            "--base-logo-background": value,
            "--base-navbar-background": value
        })
    }
}
</script>

<style scoped lang="scss">
.color-radio-picker-warp {
    display: flex;
    justify-content: space-around;

    span {
        width: 20px;
        height: 20px;
        border: 1px solid var(--el-border-color);
        transition: transform .25s;
    }

    .is-active {
        border-color: var(--el-color-primary);
        transform: scale(1.2);
    }
}
</style>