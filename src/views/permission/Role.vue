<template>
    <div class="app-container">
        <div class="search">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item label="角色名称" prop="roleNameCn">
                    <el-select v-model="queryParams.roleNameCn" placeholder="请输入角色名称" filterable remote clearable
                        :remote-method="handleRoleSearch" :loading="searchData.isRoleLoading" style="width: 200px"
                        @keyup.enter.native="handleQuery">
                        <el-option v-for="(item, index) in searchData.searchRoleList" :key="item + index" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="权限字符" prop="functionKey">
                    <el-select v-model="queryParams.functionKey" placeholder="请输入权限字符" filterable remote clearable
                        :remote-method="handleRoleKeySearch" :loading="searchData.isRoleKeyLoading" style="width: 200px"
                        @keyup.enter.native="handleQuery">
                        <el-option v-for="(item, index) in searchData.searchRoleKeyList" :key="item + index" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 200px">
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
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery(queryForm)">重置</el-button>
            </div>
        </div>

        <common-table :tableList="tableData.roleList" :isLoading="tableData.isLoading"
            :tableHeaderConfig="tableData.headerConfig" :uploadRequestConfig="tableData.uploadRequestConfig"
            @handleEvent="tableHandler" />
        <Pagination :total="pagination.total" :pageSize="pagination.pageSize" :currentPage="pagination.currentPage"
            @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange" />

        <el-dialog v-model="dialogConfig.isVisible" :title="dialogConfig.title" width="50%" top="100px"
            :close-on-click-modal="false" draggable>
            <role-config />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus'

import { getRoleListApi, exportRoleListApi, importTemplateApi, importRoleListApi, getRoleSearchListApi } from "@/api/role";
import type { roleListApiQuery } from "@/api/role";
import { RoleList } from "@/api/types";
import { excel } from "@/utils/download";
import { getToken } from "@/utils/token";
import RoleConfig from "@/views/permission/role/RoleConfig.vue";
import Pagination from "@/components/Pagination.vue";
import CommonTable from "@/components/CommonTable.vue";

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
type searchKey = 'role_name_cn' | 'role_name_en' | 'function_key';
const getSearchList = async (searchKey: searchKey, searchVal: string) => {
    searchData.isRoleLoading = true;
    let result = await getRoleSearchListApi({ searchParams: searchKey, [searchKey]: searchVal });
    if (result.code === 200) {
        if (searchKey === "function_key") {
            searchData.searchRoleKeyList = result.data;
        } else {
            searchData.searchRoleList = result.data;
        }

    }
    searchData.isRoleLoading = false;
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
            label: "无效"
        },
        {
            value: 1,
            label: "有效"
        }
    ],
    searchRoleList: [] as string[],
    searchRoleKeyList: [] as string[],
    isRoleLoading: false,
    isRoleKeyLoading: false,
})
const handleRoleSearch = async (query: string) => {
    getSearchList("role_name_cn", query);
}
const handleRoleKeySearch = async (query: string) => {
    getSearchList("function_key", query);
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

// 表格相关逻辑
interface TableHandlerOption {
    mode: "Add" | "Export" | "Edit" | "Delete",
    option?: {
        type?: string,
        rowData?: RoleList
    }
}
const tableHandleEventObj = {
    handleAdd() {
        dialogConfig.isVisible = true;
        dialogConfig.title = "新增角色";
    },
    handleEdit(option: TableHandlerOption) {
        console.log("🚀 ~ file: Role.vue:147 ~ handleEdit ~ option:", option)
        const role = option.option?.rowData as RoleList;
        dialogConfig.isVisible = true;
        dialogConfig.title = `编辑角色（${role.roleId}）`;
    },
    handleDelete() {

    },
    async handleExport(config: TableHandlerOption) {
        let result;
        if (config.option?.type == 'template') {
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
            label: '角色编号',
            prop: 'roleId',
            width: 80,
        },
        {
            label: '角色名称',
            prop: 'roleNameCn',
            width: 150,
        },
        {
            label: '权限字符',
            prop: 'functionKey',
            width: 150,
        },
        {
            label: '角色描述',
            prop: 'roleDescriptionCn',
            width: 200,
        },
        {
            label: '状态',
            prop: 'status',
            width: 120,
        },
        {
            label: '创建时间',
            prop: 'createTime',
            width: 120,
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
const tableHandler = (option: TableHandlerOption) => {
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
    getRoleList({ pageNum: pagination.currentPage, pageSize, ...queryParams })
}
const currentPageChange = async (pageNum: number) => {
    getRoleList({ pageNum, pageSize: pagination.pageSize, ...queryParams })
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