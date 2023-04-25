<template>
    <div class="color-radio-picker-warp">
        <div class="color-set">
            <span v-for="(item, i) in schemaArr" :key="`radio-${i}`" class="pointer"
                :class="{ 'is-active': colorVal === item.backgroundColor }" :style="{
                    backgroundColor: item.backgroundColor
                }" @click="colorPickerHandler(item)">
            </span>
        </div>
        <div class="color-choice">
            <el-form :model="themeForm" size="small" :inline="true">
                <el-form-item :label="$t('common.backgroundColor')">
                    <el-color-picker v-model="themeForm.backgroundColor" @change="bgHandler" />
                </el-form-item>
                <el-form-item :label="$t('common.textColor')">
                    <el-color-picker v-model="themeForm.textColor" @change="bgHandler" />
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue';

import appStore from "@/store/index";
import { Schema } from "@/store/config";
import { $t } from "@/utils/i18n";

const { configState, setThemeAction } = appStore.configStore;

const props = defineProps({
    schemaArr: {
        type: Array as PropType<Schema[]>,
        default: () => ([])
    }
})
const emit = defineEmits(['themeChange']);
let colorVal = ref(configState.theme['--base-navbar-background'] || props.schemaArr[0].backgroundColor);
const colorPickerHandler = (value: Schema) => {
    colorVal.value = value.backgroundColor;
    themeForm.backgroundColor = value.backgroundColor;
    themeForm.textColor = value.textColor;
    emit("themeChange", value);
};

const themeForm = reactive({
    backgroundColor: "#fff",
    textColor: "#000",
});
const bgHandler = () => {
    emit("themeChange", {
        backgroundColor: themeForm.backgroundColor,
        textColor: themeForm.textColor,
    });
};
</script>

<style scoped lang="scss">
.color-radio-picker-warp {
    .color-set {
        display: flex;
        justify-content: space-around;
    }

    .color-choice {
        margin: 10px;
    }

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