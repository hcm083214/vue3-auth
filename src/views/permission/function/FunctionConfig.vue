<template>
    <div>
        <el-form ref="functionFormRef" :model="functionForm" label-position="top" :inline="true" :rules="rules"
            label-width="120px">
            <el-form-item label="功能权限中文名" prop="functionNameCn">
                <el-input v-model="functionForm.functionNameCn" class="functional-name" />
            </el-form-item>
            <el-form-item label="功能权限英文名" prop="functionNameEn">
                <el-input v-model="functionForm.functionNameEn" class="functional-name" />
            </el-form-item>
            <el-form-item label="功能权限中文描述" prop="functionDescriptionCn">
                <el-input v-model="functionForm.functionDescriptionCn" maxlength="200" type="textarea"
                    class="functional-desc" />
            </el-form-item>
            <el-form-item label="功能权限英文描述" prop="functionDescriptionEn">
                <el-input v-model="functionForm.functionDescriptionEn" maxlength="200" type="textarea"
                    class="functional-desc" />
            </el-form-item>
            <el-form-item label="权限字符" prop="functionKey">
                <el-input v-model="functionForm.functionKey" class="functional-name" />
            </el-form-item>
        </el-form>
        <div class="tree">
            <div class="el-form-item__label">对应的菜单列表</div>
            <div class="tree-content">
                <el-tree ref="treeRef" v-loading="treeData.isLoading" :data="treeData.allPermissionList" show-checkbox
                    node-key="menuId" :default-expanded-keys="treeData.selectPermissionIdList" :check-strictly="true"
                    :default-checked-keys="treeData.selectPermissionIdList" :props="treeDefaultProps" />
            </div>
        </div>
        <div class="control">
            <el-button type="primary" @click="handleClick(functionFormRef, mode as string)">{{ mode == "Add" ? "新增" : "修改"
            }}</el-button>
            <el-button @click="resetQuery(functionFormRef)">重置</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElTree, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'

import { getAllMenuListApi } from "@/api/menu";
import { getPermissionIdListApi, editFunctionInfoApi, addFunctionInfoApi } from "@/api/function";
import { Menu } from "@/api/types";

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
    functionNameCn: { required: true, message: '请输入功能权限中文名称', trigger: 'blur' },
    functionNameEn: { required: true, message: '请输入功能权限英文名称', trigger: 'blur' },
    functionDescriptionCn: { required: true, message: '请输入功能权限中文描述', trigger: 'blur' },
    functionDescriptionEn: { required: true, message: '请输入功能权限英文描述', trigger: 'blur' },
})
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeDefaultProps = {
    id: 'menuId',
    children: 'children',
    label: 'menuName',
}
const treeData = reactive({
    allPermissionList: [] as Menu[],
    selectPermissionIdList: [] as number[],
    isLoading: false,
})
const getTreeData = async () => {
    treeData.isLoading = true;
    const result1 = await getAllMenuListApi();
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
    width: 240px;
    margin-right: 50px;
}

.functional-desc {
    width: 650px;
    height: 50px;
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