<template>
    <el-form ref="i18nFormRef" :model="i18nForm" label-position="top" :inline="true" :rules="rules" label-width="120px">
        <el-form-item :label="$t('system.i18nModule')" prop="i18nModule" class="col2">
            <el-input v-model="i18nForm.i18nModule" />
        </el-form-item>
        <el-form-item :label="$t('system.i18nKey')" prop="i18nKey" class="col2">
            <el-input v-model="i18nForm.i18nKey" />
        </el-form-item>
        <div class="flex " v-for="(item, index) in i18nForm.localeData" :key="index">
            <el-form-item :label="$t('system.locale')" prop="locale" class="col2">
                <el-select v-model="item.locale" class="m-2" placeholder="Select">
                    <el-option v-for="item in locales" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.i18nValue')" prop="i18nValue" class="col2">
                <el-input v-model="item.i18nValue" />
            </el-form-item>
        </div>
    </el-form>
    <el-button type="success" text @click="handleAddLocale" v-if="mode === 'Add'">{{ $t('system.addLocale') }}</el-button>
    <div class="control">
        <el-button type="primary" @click="handleClick(i18nFormRef, mode as string)">
            {{ mode === "Add" ? $t('common.add') : $t('common.edit') }}
        </el-button>
        <el-button @click="resetQuery(i18nFormRef)">{{$t('common.reset')}}</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from "element-plus";

import { $t, SUPPORT_LOCALES as locales } from "@/utils/i18n";
import { addIl8nListApi, editIl8nListApi } from "@/api/config"
import { I18nData } from "@/api/types";

const props = defineProps({
    i18nConfigData: {
        default: () => ({
            i18nId: -1,
            locale: '',
            i18nModule: '',
            i18nKey: '',
            i18nValue: '',
        })
    },
    mode: String
})
const emit = defineEmits(['handleConfig']);
const i18nForm = reactive({
    i18nId: props.i18nConfigData.i18nId,
    i18nModule: props.i18nConfigData.i18nModule,
    i18nKey: props.i18nConfigData.i18nKey,
    localeData: [
        {
            locale: props.i18nConfigData.locale,
            i18nValue: props.i18nConfigData.i18nValue
        }
    ]
})
const i18nFormRef = ref();
const rules = reactive<FormRules>({
    i18nModule: { required: true, message: $t('system.i18nModulePlaceHolder'), trigger: 'blur' },
    i18nKey: { required: true, message: $t('system.i18nKeyPlaceHolder'), trigger: 'blur' },
})

function handleAddLocale() {
    i18nForm.localeData.push({
        locale: '',
        i18nValue: ''
    })
}
async function handleClick(formEl: FormInstance | undefined, mode: string) {
    if (!formEl) return
    let isValidPass = await formEl.validate(async (valid, fields) => {
        if (valid) {
            return true;
        }
    })

    if (!isValidPass) return;
    let result;
    if (mode === "Add") {
        result = await addIl8nListApi({ data: objToArr(i18nForm) })
    } else if (mode === "Edit") {
        result = await editIl8nListApi({
            data: {
                i18nId: i18nForm.i18nId,
                i18nModule: i18nForm.i18nModule,
                i18nKey: i18nForm.i18nKey,
                locale: i18nForm.localeData[0].locale,
                i18nValue: i18nForm.localeData[0].i18nValue
            }
        })
    }
    if (result?.code === 200) {
        // 关闭弹框
        emit("handleConfig");
    } else {
        ElMessage({
            type: "warning",
            message: result?.msg
        })
    }
}
type i18nFormType = typeof i18nForm;
function objToArr(i18nForm: i18nFormType) {
    return i18nForm.localeData.map(i => {
        Object.assign(i, {
            i18nId: i18nForm.i18nId,
            i18nModule: i18nForm.i18nModule,
            i18nKey: i18nForm.i18nKey,
        })
        return i as I18nData;
    })
}
function resetQuery(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields();
}
</script>

<style scoped></style>