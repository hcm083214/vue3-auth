<template>
    <div>
        <el-form ref="functionFormRef" :model="functionForm" label-position="top" :inline="true" :rules="rules"
            label-width="120px">
            <el-form-item :label="$t('permission.functionNameCn')" prop="functionNameCn" class="functional-name">
                <el-input v-model="functionForm.functionNameCn"  />
            </el-form-item>
            <el-form-item :label="$t('permission.functionNameEn')" prop="functionNameEn" class="functional-name">
                <el-input v-model="functionForm.functionNameEn"  />
            </el-form-item>
            <el-form-item :label="$t('permission.functionDescriptionCn')" prop="functionDescriptionCn" class="functional-desc">
                <el-input v-model="functionForm.functionDescriptionCn" maxlength="200" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('permission.functionDescriptionEn')" prop="functionDescriptionEn" class="functional-desc">
                <el-input v-model="functionForm.functionDescriptionEn" maxlength="200" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('permission.functionKey')" prop="functionKey" class="functional-name">
                <el-input v-model="functionForm.functionKey"  />
            </el-form-item>
        </el-form>
        <div class="tree">
            <div class="el-form-item__label">{{$t('permission.functionList')}}</div>
            <div class="tree-content">
                <el-tree ref="treeRef" v-loading="treeData.isLoading" :data="treeData.allPermissionList" show-checkbox
                    node-key="resourceId" :default-expanded-keys="treeData.selectPermissionIdList" :check-strictly="true"
                    :default-checked-keys="treeData.selectPermissionIdList" :props="treeDefaultProps" />
            </div>
        </div>
        <div class="control">
            <el-button type="primary" @click="handleClick(functionFormRef, mode as string)">{{ mode == "Add" ? "新增" : "修改"
            }}</el-button>
            <el-button @click="resetQuery(functionFormRef)">{{ $t('common.reset') }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElTree, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'

import { getResourceApi } from "@/api/menu";
import { getPermissionIdListApi, editFunctionInfoApi, addFunctionInfoApi } from "@/api/function";
import { Resource } from "@/api/types";
import { $t } from "@/utils/i18n";

const emit = defineEmits(["handleConfig"]);
const props = defineProps({
    configData: {
        default: () => ({
            functionId: -1,
            functionNameCn: '',
            functionNameEn: '',
            functionDescriptionCn: '',
            functionDescriptionEn: '',
            functionKey: '',
        })
    },
    mode: String
})
const functionFormRef = ref<FormInstance>();
const functionForm = reactive(props.configData);
const rules = reactive<FormRules>({
    functionNameCn: { required: true, message: $t('permission.functionNamePlaceholder'), trigger: 'blur' },
    functionNameEn: { required: true, message: $t('permission.functionNamePlaceholder'), trigger: 'blur' },
    functionDescriptionCn: { required: true, message: $t('permission.functionDescriptionPlaceholder'), trigger: 'blur' },
    functionDescriptionEn: { required: true, message: $t('permission.functionDescriptionPlaceholder'), trigger: 'blur' },
})
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeDefaultProps = {
    id: 'resourceId',
    children: 'children',
    label: 'resourceName',
}
const treeData = reactive({
    allPermissionList: [] as Resource[],
    selectPermissionIdList: [] as number[],
    isLoading: false,
})
const getTreeData = async () => {
    treeData.isLoading = true;
    const result1 = await getResourceApi();
    if (result1.code === 200) {
        treeData.allPermissionList = result1.data;
    }
    const result2 = await getPermissionIdListApi({ functionId: props.configData.functionId });
    if (result2.code === 200) {
        treeData.selectPermissionIdList = result2.data;
    }
    treeData.isLoading = false;
}
getTreeData();

const handleClick = async (formEl: FormInstance | undefined, mode: string) => {
    if (!formEl) return
    let isValidPass = await formEl.validate(async (valid, fields) => {
        if (valid) {
            return true;
        }
    })
    if (!isValidPass) return;
    const selectPermissionIdList = treeRef.value!.getCheckedKeys(false) as number[];
    let result;
    if (mode === "Add") {
        result = await addFunctionInfoApi({ ...functionForm, permissionIds: selectPermissionIdList })
    } else if (mode === "Edit") {
        result = await editFunctionInfoApi({ ...functionForm, permissionIds: selectPermissionIdList })
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

</script>

<style scoped lang="scss">
.functional-name {
    width: 30%;
    margin-right: 50px;
}

.functional-desc {
    width: 80%;
}

.tree {
    .el-form-item__label {
        font-weight: bold;
    }

    .tree-content {
        border: 1px solid #ccc;
        width: 300px;
        border-radius: 4px;
        padding: 10px;
    }
}

.control {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>