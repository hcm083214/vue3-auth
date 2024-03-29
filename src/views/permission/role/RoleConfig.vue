<template>
    <el-form ref="roleFormRef" :model="roleForm" label-position="top" :inline="true" :rules="rules" label-width="120px">
        <el-form-item :label="$t('permission.roleNameCn')" prop="roleNameCn" class="col2">
            <el-input v-model="roleForm.roleNameCn" />
        </el-form-item>
        <el-form-item :label="$t('permission.roleNameEn')" prop="roleNameEn" class="col2">
            <el-input v-model="roleForm.roleNameEn" />
        </el-form-item>
        <el-form-item :label="$t('permission.roleDescriptionCn')" prop="roleDescriptionCn" class="col1">
            <el-input v-model="roleForm.roleDescriptionCn" maxlength="200" type="textarea" style="height: 50px;" />
        </el-form-item>
        <el-form-item :label="$t('permission.roleDescriptionEn')" prop="roleDescriptionEn" class="col1">
            <el-input v-model="roleForm.roleDescriptionEn" maxlength="200" type="textarea" style="height: 50px;" />
        </el-form-item>
        <el-form-item :label="$t('permission.functionList')" class="col1">
            <el-transfer v-model="selectFunctionList" :props="transferProps" :data="functionListData" filterable
                :filter-placeholder="$t('permission.functionListPlaceholder')" />
        </el-form-item>
        <!-- <el-form-item label="数据维度列表" class="col2"></el-form-item> -->
    </el-form>
    <div class="control">
        <el-button type="primary" @click="handleClick(roleFormRef, mode as string)">
            {{ mode == "Add" ? $t('common.add') : $t('common.edit') }}
        </el-button>
        <el-button @click="resetQuery(roleFormRef)">{{ $t('common.reset') }}</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from "element-plus";

import { addRoleInfoApi, editRoleInfoApi } from '@/api/role'
import { getFunctionListApi } from "@/api/function";
import { FunctionList } from '@/api/types';
import { $t } from "@/utils/i18n";

onMounted(async () => {
    await getFunctionList();
    setSelectFunctionList();
})
const props = defineProps({
    roleConfigData: {
        default: () => ({
            roleId: -1,
            roleNameCn: '',
            roleNameEn: '',
            roleDescriptionCn: '',
            roleDescriptionEn: '',
            functionList: [] as FunctionList[]
        })
    },
    mode: String
})
const emit = defineEmits(['handleConfig']);
const roleForm = reactive({ ...props.roleConfigData });
const roleFormRef = ref();
const rules = reactive<FormRules>({
    roleNameCn: { required: true, message: $t('permission.roleNamePlaceholder'), trigger: 'blur' },
    roleNameEn: { required: true, message: $t('permission.roleNamePlaceholder'), trigger: 'blur' },
    roleDescriptionCn: { required: true, message: $t('permission.roleDescriptionPlaceholder'), trigger: 'blur' },
    roleDescriptionEn: { required: true, message: $t('permission.roleDescriptionPlaceholder'), trigger: 'blur' },
})

// 功能权限穿梭框
const transferProps = {
    key: 'functionId',
    label: 'functionKey',
}
const functionListData = ref<FunctionList[]>([]);
const selectFunctionList = ref<number[]>([]);
const getFunctionList = async () => {
    const result = await getFunctionListApi({ pageNum: 1, pageSize: 10 });
    if (result.code === 200) {
        functionListData.value = result.data.list;
    }
}
const setSelectFunctionList = () => {
    if (props.mode === 'Edit' && Array.isArray(props.roleConfigData.functionList)) {
        selectFunctionList.value = props.roleConfigData.functionList.map(functions => functions.functionId);
    }
}

const handleClick = async (formEl: FormInstance | undefined, mode: string) => {
    if (!formEl) return
    let isValidPass = await formEl.validate(async (valid, fields) => {
        if (valid) {
            return true;
        }
    })

    if (!isValidPass) return;
    let result;
    if (mode === "Add") {
        console.log(222)
        result = await addRoleInfoApi({ ...roleForm, functionJson: JSON.stringify(selectFunctionList.value) })
    } else if (mode === "Edit") {
        result = await editRoleInfoApi({ ...roleForm, functionJson: JSON.stringify(selectFunctionList.value) })
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
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}
</script>

<style scoped lang="scss">
.col2 {
    width: 240px;
    margin-right: 50px;
}

.col1 {
    width: 650px;
}
</style>