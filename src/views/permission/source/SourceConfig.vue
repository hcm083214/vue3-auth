<template>
    <div>
        <el-form ref="sourceFormRef" :model="sourceForm" label-position="top" :inline="true" :rules="rules"
            label-width="120px">
            <el-form-item label="父资源id" prop="parentId" :style="{ width: '260px' }">
                <el-select v-model="sourceForm.parentId" class="m-2" placeholder="请选择父资源id">
                    <el-option v-for="item in sourceForm.parentMenu" :key="item.resourceId" :label="item.resourceName"
                        :value="item.resourceId" />
                </el-select>
            </el-form-item>
            <el-form-item label="资源名称" prop="resourceName" :style="{ width: '260px' }">
                <el-input v-model="sourceForm.resourceName" />
            </el-form-item>
            <el-form-item label="资源类型" prop="resourceType" :style="{ width: '260px' }">
                <el-select v-model="sourceForm.resourceType" class="m-2" placeholder="请选择资源类型">
                    <el-option v-for="item in resourceType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="资源路径" prop="path" :style="{ width: '260px' }">
                <el-input v-model="sourceForm.path" />
            </el-form-item>
            <el-form-item label="资源组件" prop="component" :style="{ width: '260px' }">
                <el-input v-model="sourceForm.component" />
            </el-form-item>
            <el-form-item label="资源图标" prop="icon" :style="{ width: '260px' }">
                <el-input v-model="sourceForm.icon">
                    <template #prefix>
                        <Icon :icon="'svg-icon:' + sourceForm.icon" :size="12" color="#000"></Icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleClick(sourceFormRef, mode as string)">
                    {{ mode == "Add" ? "新增" : "修改" }}
                </el-button>
                <el-button @click="resetQuery(sourceFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { getMenuListApi, editMenuListApi, addMenuListApi, getResourceApi } from "@/api/menu";
import { Resource } from "@/api/types";
import Icon from "@/components/Icon.vue";

getResourceApi().then(res => {
    if (res.code === 200) {
        let result = [] as Resource[];
        tree2List(res.data, result);
        sourceForm.parentMenu = [...sourceForm.parentMenu, ...result];
    }
})

const tree2List = (tree: Resource[], list: Resource[]) => {
    tree.forEach(menu => {
        if (menu.resourceType === "M" || menu.resourceType === "C") {
            list.push(menu)
        }
        menu?.children.length > 0 && tree2List(menu?.children, list);
    })
}

const props = defineProps({
    resourceConfig: {
        default: () => ({
            resourceId: -1,
            parentId: 0,
            resourceName: "",
            resourceType: '',
            component: '',
            path: '',
            icon: '',
        })
    },
    mode: String
})
const emit = defineEmits(['handleConfig'])

const resourceType = [
    {
        label: "目录",
        value: "M"
    },
    {
        label: "菜单",
        value: "C"
    },
    {
        label: "按钮",
        value: "F"
    }
]
const sourceFormRef = ref();
const sourceForm = reactive({
    ...props.resourceConfig,
    parentMenu: [
        {
            resourceName: '主菜单',
            resourceId: 0,
        }
    ],
    children: [],
});
const componentValidate = (rule: any, value: any, callback: any) => {
    if (sourceForm.resourceType === "C") {
        if (value === '') {
            callback(new Error('资源类型选菜单组件必须填写'));
        } else {
            callback();
        }
    } else {
        callback();
    }
}
const rules = reactive({
    parentId: { required: true, message: '请输入parentId', trigger: 'blur' },
    resourceName: { required: true, message: '请输入资源名称', trigger: 'blur' },
    resourceType: { required: true, message: '请输入资源类型 ', trigger: 'blur' },
    component: { validator: componentValidate, trigger: 'blur' },
    path: { required: true, message: '请输入功能权限英文描述', trigger: 'blur' },
});

const handleClick = async (formEl: FormInstance | undefined, mode: string) => {
    if (!formEl) return
    let isValidPass = await formEl.validate(async (valid, fields) => {
        if (valid) {
            return true;
        }
    })
    if (!isValidPass) return;
    console.log(111)
    let result;
    if (mode === "Add") {
        console.log("🚀 ~ file: SourceConfig.vue:138 ~ handleClick ~ mode:", mode)
        result = await addMenuListApi({ ...sourceForm })
    } else if (mode === "Edit") {
        result = await editMenuListApi({ ...sourceForm })
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
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}
</script>

<style scoped lang="scss"></style>