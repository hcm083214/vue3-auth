<template>
    <div>
        <el-button @click="isShowParentSetDialog = true" type="primary" class="mb10">{{ $t('common.quickEdit') }}</el-button>
        <el-button type="success" class="mb10" @click="handleAdd">{{ $t('common.add') }}</el-button>
        <el-button type="success" class="mb10" @click="handleSyncResource">{{ $t('common.sync') }}</el-button>
        <el-table :data="menuData.menuList" v-loading="menuData.isLoading" style="width: 100%; margin-bottom: 20px"
            row-key="resourceId" border header-row-class-name="table-header" class="table-header">
            <el-table-column prop="resourceId" :label="$t('permission.parentId')" sortable />
            <el-table-column prop="resourceName" :label="$t('permission.resourceName')" sortable />
            <el-table-column :label="$t('permission.resourceType')" sortable>
                <template #default="scope">
                    {{ typeConvert(scope.row.resourceType) }}
                </template>
            </el-table-column>
            <el-table-column prop="description" :label="$t('permission.resourceDesc')" sortable />
            <el-table-column prop="perms" :label="$t('permission.perms')" sortable />
            <el-table-column align="center" :label="$t('common.operation')">
                <template #default="scope">
                    <el-button v-if="scope.row.resourceType !== 'F'" size="small" link type="primary"
                        @click="handleEdit(scope.row)">
                        <icon icon="svg-icon:edit" />{{ $t('common.edit') }}
                    </el-button>
                    <el-button size="small" link type="primary" @click="handleDelete(scope.row)">
                        <icon icon="svg-icon:delete" />{{ $t('common.delete') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="isShowConfigDialog" top="100px" width="50%" :title="configData.title"
            :close-on-click-modal="false" :destroy-on-close="true" draggable>
            <source-config :resourceConfig="configData.resource" :mode="configData.mode" @handleConfig="handleConfig" />
        </el-dialog>
        <el-dialog v-model="isShowParentSetDialog" :title="$t('common.quickEdit')" width="30%"
            :close-on-click-modal="false">
            <div class="dialog-content">
                <div class="tree-content">
                    <el-tree :data="menuData.menuList" :props="menuDataDefaultProps" draggable default-expand-all
                        node-key="resourceId" />
                </div>
                <div class="control">
                    <el-button type="primary" class="btn" @click="handleEditParentId">{{ $t('common.edit') }}</el-button>
                    <span></span>
                    <el-button class="btn" @click="resetParentId">{{ $t('common.reset') }}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import { getResourceApi, editResourceParentIdApi, syncApiList, deleteResourceApi } from "@/api/menu"
import { Resource } from "@/api/types";
import Icon from "@/components/Icon.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import SourceConfig from "@/views/permission/source/SourceConfig.vue"
import { typeConvert } from "@/views/permission/source/source"
import { $t } from "@/utils/i18n";

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
const handleSyncResource = async () => {
    await syncApiList();
    await getResourceData();
}

const handleEdit = (menu: Resource) => {
    // 菜单和目录才可编辑
    isShowConfigDialog.value = true;
    configData.resource = menu;
    configData.title = $t('common.edit');
    configData.mode = "Edit";
}
const deleteResourceFn = (list: Resource[], deleteResource: Resource) => {
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].resourceId === deleteResource.resourceId) {
            list.splice(i, 1);
            break;
        }
        if (list[i].children.length > 0) {
            deleteResourceFn(list[i].children, deleteResource);
        }
    }
}
const handleDelete = async (resource: Resource) => {
    await ElMessageBox.confirm(
        $t('common.confirmDelete'),
        $t('common.systemPrompt'),
        {
            confirmButtonText: $t('common.confirm'),
            cancelButtonText: $t('common.cancel'),
            type: 'warning',
        }
    )
    await deleteResourceApi(resource.resourceId);
    deleteResourceFn(menuData.menuList, resource);

}

// 功能权限关系快速编辑逻辑
const isShowParentSetDialog = ref(false);
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
    configData.title = $t('common.add');
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