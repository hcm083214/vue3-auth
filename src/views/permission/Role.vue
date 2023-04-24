<template>
    <div class="search">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item :label="$t('permission.roleName')" prop="roleNameCn">
                <el-select v-model="queryParams.roleNameCn" :placeholder="$t('permission.roleNamePlaceholder')" filterable
                    remote clearable :remote-method="handleRoleSearch" :loading="searchData.isRoleLoading"
                    style="width: 200px" @keyup.enter.native="handleQuery">
                    <el-option v-for="(item, index) in searchData.searchRoleList" :key="item + index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('permission.functionKey')" prop="functionKey">
                <el-select v-model="queryParams.functionKey" :placeholder="$t('permission.functionKeyPlaceholder')"
                    filterable remote clearable :remote-method="handleRoleKeySearch" :loading="searchData.isRoleKeyLoading"
                    style="width: 200px" @keyup.enter.native="handleQuery">
                    <el-option v-for="(item, index) in searchData.searchRoleKeyList" :key="item + index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.status')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('common.status')" clearable style="width: 200px">
                    <el-option v-for="(status, index) in searchData.roleStatus" :key="index" :label="status.label"
                        :value="status.value" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="创建时间">
                    <el-date-picker v-model="queryParams.dateRange" style="width: 200px" value-format="YYYY/MM/DD"
                        type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item> -->
        </el-form>
        <div class="search-btn">
            <el-button type="primary" @click="handleQuery">{{ $t('common.search') }}</el-button>
            <el-button @click="resetQuery(queryForm)">{{ $t('common.reset') }}</el-button>
        </div>
    </div>

    <common-table :tableList="tableData.roleList" :isLoading="tableData.isLoading"
        :tableHeaderConfig="tableData.headerConfig" :uploadRequestConfig="tableData.uploadRequestConfig"
        @handleEvent="tableHandler" />
    <Pagination :total="pagination.total" :pageSize="pagination.pageSize" :currentPage="pagination.currentPage"
        @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange" />

    <el-dialog v-model="dialogConfig.isVisible" :title="dialogConfig.title" width="50%" top="100px"
        :close-on-click-modal="false" destroy-on-close draggable>
        <role-config :roleConfigData="roleConfigData.data" :mode="roleConfigData.mode" @handleConfig="handleConfig" />
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus'

import { getRoleListApi, exportRoleListApi, importTemplateApi, importRoleListApi, getRoleSearchListApi, editRoleInfoApi } from "@/api/role";
import type { roleListApiQuery } from "@/api/role";
import { RoleList, FunctionList } from "@/api/types";
import { excel } from "@/utils/download";
import { getToken } from "@/utils/token";
import RoleConfig from "@/views/permission/role/RoleConfig.vue";
import Pagination from "@/components/Pagination.vue";
import CommonTable from "@/components/CommonTable.vue";
import { TableOperation, TableHandlerOption } from "@/components/CommonTable";
import { $t } from "@/utils/i18n";

onMounted(async () => {
    await getRoleList({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
})
const getRoleList = async (params: roleListApiQuery) => {
    tableData.isLoading = true;
    let result = await getRoleListApi(params);
    if (result.code === 200) {
        tableData.roleList = result.data.list;
        pagination.total = result.data.total;
    } else {
        tableData.roleList = [];
    }
    tableData.isLoading = false;
}

// 搜索栏相关逻辑
const queryForm = ref();
const queryParams = reactive({
    roleNameCn: '',
    functionKey: "",
    status: "",
    dateRange: [],
})
const searchData = reactive({
    roleStatus: [
        {
            value: 0,
            label: $t('common.ineffective')
        },
        {
            value: 1,
            label: $t('common.effectivity')
        }
    ],
    searchRoleList: [] as string[],
    searchRoleKeyList: [] as string[],
    isRoleLoading: false,
    isRoleKeyLoading: false,
})
const handleRoleSearch = async (query: string) => {
    searchData.isRoleLoading = true;
    let result = await getRoleSearchListApi({ searchParams: "role_name_cn", roleNameCn: query });
    if (result.code === 200) {
        searchData.searchRoleList = result.data;
    }
    searchData.isRoleLoading = false;
}
const handleRoleKeySearch = async (query: string) => {
    searchData.isRoleLoading = true;
    let result = await getRoleSearchListApi({ searchParams: "function_key", functionKey: query });
    if (result.code === 200) {
        searchData.searchRoleKeyList = result.data;
    }
    searchData.isRoleLoading = false;
}
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
    getRoleList({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
}

const dialogConfig = reactive({
    isVisible: false,
    title: '',
});


const tableHandleEventObj = {
    handleAdd() {
        dialogConfig.isVisible = true;
        dialogConfig.title = $t('permission.addRole');
        roleConfigData.data = initRoleConfigData;
        roleConfigData.mode = TableOperation.Add;
    },
    async handleEdit(option: TableHandlerOption<RoleList>) {
        const role = option.option?.rowData as RoleList;
        const isEditStatus = option.option?.isEditStatus;
        if (isEditStatus) {
            await editRoleInfoApi(role);
        } else {
            dialogConfig.isVisible = true;
            dialogConfig.title = $t('permission.editRole') + `（${role.roleId}）`;
            roleConfigData.data = role;
            roleConfigData.mode = TableOperation.Edit;
        }
    },
    handleDelete() {

    },
    async handleExport(config: TableHandlerOption<RoleList>) {
        let result;
        if (config.option?.exportType == 'template') {
            result = await importTemplateApi();
        } else {
            result = await exportRoleListApi({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
        }
        result && excel(result, "角色列表");
    }
}
const tableData = reactive({
    roleList: [] as RoleList[],
    isLoading: false,
    headerConfig: [
        {
            label: $t('permission.roleId'),
            prop: 'roleId',
            width: 80,
        },
        {
            label: $t('permission.roleName'),
            prop: 'roleNameCn',
            width: 150,
        },
        {
            label: $t('permission.functionList'),
            prop: 'functionList',
            width: 150,
        },
        {
            label: $t('permission.roleDescription'),
            prop: 'roleDescriptionCn',
            width: 220,
        },
        {
            label: $t('common.status'),
            prop: 'status',
            width: 120,
        },
        {
            label: $t('common.createTime'),
            prop: 'createTime',
            width: 160,
        },
    ],
    // 提供给upload组件的请求配置
    uploadRequestConfig: {
        uploadUrl: "api/roles/import",
        headers: {
            Authorization: getToken()
        }
    }
})
const tableHandler = (option: TableHandlerOption<RoleList>) => {
    tableHandleEventObj[`handle${option.mode}`](option);
}
const handleQuery = () => {
    getRoleList({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, ...queryParams });
}

// 分页相关逻辑
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    sizeSelection: [10, 20, 50, 100, 200]
})
const pageSizeChange = async (pageSize: number) => {
    pagination.pageSize = pageSize;
    getRoleList({ pageNum: pagination.currentPage, pageSize, ...queryParams })
}
const currentPageChange = async (pageNum: number) => {
    pagination.currentPage = pageNum;
    getRoleList({ pageNum, pageSize: pagination.pageSize, ...queryParams })
}

// 角色新增或者修改
const initRoleConfigData = {
    roleId: -1,
    roleNameCn: '',
    roleNameEn: '',
    roleDescriptionCn: '',
    roleDescriptionEn: '',
    functionJson: '',
    functionList: [] as FunctionList[]
}
const roleConfigData = reactive({
    data: {} as RoleList,
    mode: ''
})
const handleConfig = () => {
    dialogConfig.isVisible = false;
    handleQuery();
}

</script>

<style lang="scss" scoped>
.app-container {
    :deep(.cell) {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search {
        .search-btn {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
            margin-right: 50px;
        }
    }

    .dropdown-more {
        margin-left: 10px;
    }

    .permission-tree {
        margin-bottom: 30px;
    }

}
</style>