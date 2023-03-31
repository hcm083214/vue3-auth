<template>
    <div class="app-container">
        <el-button @click="isShowParentSetDialog = true" type="primary" class="mb10">功能权限关系快速编辑</el-button>
        <el-button type="success" class="mb10" @click="handleAdd">新增菜单权限</el-button>
        <el-table :data="menuData.menuList" v-loading="menuData.isLoading" style="width: 100%; margin-bottom: 20px"
            row-key="resourceId" border header-row-class-name="table-header" class="table-header">
            <el-table-column prop="resourceId" label="资源id" sortable />
            <el-table-column prop="resourceName" label="资源名称" sortable />
            <el-table-column label="资源类型" sortable>
                <template #default="scope">
                    {{ typeConvert(scope.row.resourceType) }}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="资源描述" sortable />
            <el-table-column prop="perms" label="权限标识" sortable />
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <div v-if="scope.row.resourceType !== 'F'">
                        <el-button size="small" link type="primary" @click="handleEdit(scope.row)">
                            <icon icon="svg-icon:edit" />修改
                        </el-button>
                        <el-button size="small" link type="primary">
                            <icon icon="svg-icon:delete" />删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="isShowConfigDialog" top="100px" width="50%" :title="configData.title"
            :close-on-click-modal="false" :destroy-on-close="true" draggable>
            <source-config :resourceConfig="configData.resource" :mode="configData.mode" @handleConfig="handleConfig" />
        </el-dialog>
        <el-dialog v-model="isShowParentSetDialog" title="功能权限关系快速编辑" width="30%" :close-on-click-modal="false">
            <div class="dialog-content">
                <div class="tree-content">
                    <el-tree :data="menuData.menuList" :props="menuDataDefaultProps" draggable default-expand-all
                        node-key="resourceId" />
                </div>
                <div class="control">
                    <el-button type="primary" class="btn" @click="handleEditParentId">修改</el-button>
                    <span></span>
                    <el-button class="btn" @click="resetParentId">重置</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import { getResourceApi, editResourceParentIdApi } from "@/api/menu"
import { Resource } from "@/api/types";
import Icon from "@/components/Icon.vue";
import { ElMessage } from "element-plus";
import SourceConfig from "@/views/permission/source/SourceConfig.vue"

onMounted(() => {
    getResourceData();
})

// 表单相关逻辑
const menuDataDefaultProps = {
    id: 'resourceId',
    children: 'children',
    label: 'resourceName',
}
const menuData = reactive({
    menuList: [] as Resource[],
    isLoading: false,
})
let initMenuList = [] as Resource[];
const getResourceData = async () => {
    menuData.isLoading = true;
    const result = await getResourceApi();
    if (result.code === 200) {
        menuData.menuList = initMenuList = result.data;
    }
    menuData.isLoading = false;
}
const typeConvert = (type: "M" | "C" | "F") => {
    const map = {
        M: "目录",
        C: "菜单",
        F: "按钮",
    }
    return map[type];
}

// 功能权限关系快速编辑逻辑
const isShowParentSetDialog = ref(false);
const handleEdit = (menu: Resource) => {
    isShowConfigDialog.value = true;
    configData.resource = menu;
    configData.title = "菜单编辑";
    configData.mode = "Edit";
}
const handleEditParentId = async () => {
    const result = await editResourceParentIdApi(menuData.menuList);
    if (result.code === 200) {
        isShowParentSetDialog.value = false;
    } else {
        ElMessage({
            type: 'error',
            message: result.msg,
        })
    }
}
const resetParentId = () => {
    menuData.menuList = initMenuList;
}

// 新增和编辑dialog框相关逻辑
const initConfigSource = {
    resourceId: -1,
    parentId: 0,
    resourceName: "",
    resourceType: '',
    component: '',
    path: '',
    icon: '',
    orderNum: '',
    children: [] as Resource[],
    perms: ''
}
const configData = reactive({
    resource: {} as Resource,
    title: '',
    mode: ''
});
const isShowConfigDialog = ref(false);
const handleAdd = () => {
    isShowConfigDialog.value = true;
    configData.title = "菜单新增";
    configData.resource = initConfigSource;
    configData.mode = "Add";
}
const handleConfig = () => {
    isShowConfigDialog.value = false;
}

</script>

<style scoped lang="scss">
:deep(.table-header th) {
    background: #f8f8f9;
}

.dialog-content {
    display: flex;
    align-items: flex-start;

    .tree-content {
        border: 1px solid #ccc;
        width: 300px;
        border-radius: 4px;
        padding: 10px;
    }

    .control {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        width: 50px;
        justify-content: center;
        margin-left: 20px;

        .btn {
            margin-bottom: 10px;
        }
    }
}
</style>