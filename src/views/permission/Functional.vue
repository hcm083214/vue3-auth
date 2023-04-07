<template>
    <div class="app-container">
        <div class="search">
            <el-form ref="menuFormRef" :model="menuForm" label-position="right" :inline="true" label-width="80px">
                <el-form-item label="权限名称" prop="functionNameCn">
                    <el-select v-model="menuForm.functionNameCn" placeholder="请输入权限名称" filterable remote clearable
                        :remote-method="handleFunctionSearch" style="width: 200px" @keyup.enter.native="handleQuery">
                        <el-option v-for="(item, index) in searchData.searchFunctionList" :key="item + index" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="权限字符" prop="functionKey">
                    <el-select v-model="menuForm.functionKey" placeholder="请输入权限字符" filterable remote clearable
                        :remote-method="handleFunctionKeySearch" style="width: 200px" @keyup.enter.native="handleQuery">
                        <el-option v-for="(item, index) in searchData.searchFunctionKeyList" :key="item + index"
                            :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="menuForm.status" placeholder="状态" clearable style="width: 200px">
                        <el-option v-for="(status, index) in searchData.functionStatus" :key="index" :label="status.label"
                            :value="status.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="search-btn">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery(menuFormRef)">重置</el-button>
            </div>
        </div>
        <common-table :tableList="tableData.functionList" :isLoading="tableData.isLoading"
            :uploadRequestConfig="tableData.uploadRequestConfig" :tableHeaderConfig="tableData.headerConfig"
            @handleEvent="tableHandler" />
        <Pagination :total="pagination.total" :pageSize="pagination.pageSize" :currentPage="pagination.currentPage"
            @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange" />
        <el-dialog v-model="dialogConfig.isVisible" :title="dialogConfig.title" width="50%" top="100px"
            :close-on-click-modal="false" destroy-on-close draggable>
            <function-config :configData="dialogData" :mode="dialogConfig.mode" @handleConfig="handleConfig" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

import Pagination from "@/components/Pagination.vue";
import CommonTable from "@/components/CommonTable.vue";
import FunctionConfig from "@/views/permission/function/FunctionConfig.vue";
import { getFunctionListApi, FunctionListApiQuery, getExportDataApi, getExportTemplateApi, editFunctionInfoApi, getFunctionSearchListApi } from "@/api/function";
import type { FunctionList } from "@/api/types";
import { excel } from "@/utils/download";
import { getToken } from "@/utils/token";

const getTableData = async (params: FunctionListApiQuery) => {
    tableData.isLoading = true;
    const result = await getFunctionListApi(params);
    if (result.code === 200) {
        tableData.functionList = result.data.list;
        pagination.total = result.data.total;
    }
    tableData.isLoading = false;
}

// 搜索相关逻辑
const menuFormRef = ref();
const menuForm = reactive({
    functionNameCn: '',
    functionKey: '',
    status: ''
})
type searchKey = 'function_name_cn' | 'function_name_en' | 'function_key';
const searchData = reactive({
    functionStatus: [
        {
            value: 0,
            label: "无效"
        },
        {
            value: 1,
            label: "有效"
        }
    ],
    searchFunctionList: [] as string[],
    searchFunctionKeyList: [] as string[],
})
const handleFunctionSearch = async (query: string) => {
    const result = await getFunctionSearchListApi({ searchParams: "function_name_cn", functionNameCn: query });
    if (result.code === 200) {
        searchData.searchFunctionList = result.data;
    }
}
const handleFunctionKeySearch = async (query: string) => {
    const result = await getFunctionSearchListApi({ searchParams: "function_key", functionKey: query });
    if (result.code === 200) {
        searchData.searchFunctionKeyList = result.data;
    }
}
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
    getTableData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, ...menuForm })
}
const handleQuery = () => {
    getTableData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, ...menuForm })
}

// 表格相关逻辑
interface TableHandlerOption {
    mode: "Add" | "Export" | "Edit" | "Delete",
    option?: {
        // 'template' | undefined
        exportType?: string,
        // 点击行的表格数据
        rowData?: any,
        // 是否修改角色状态
        isEditStatus?: boolean,
    }
}
const tableData = reactive({
    isLoading: false,
    functionList: [] as FunctionList[],
    headerConfig: [
        {
            label: '功能权限编号',
            prop: 'functionId',
            width: 120,
        },
        {
            label: '权限名称',
            prop: 'functionNameCn',
            width: 150,
        },
        {
            label: '权限字符',
            prop: 'functionKey',
            width: 150,
        },
        {
            label: '权限描述',
            prop: 'functionDescriptionCn',
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
            width: 180,
        },
    ],
    // 提供给upload组件的请求配置
    uploadRequestConfig: {
        uploadUrl: "api/functions/import",
        headers: {
            Authorization: getToken()
        }
    }
})
const tableHandleEventObj = {
    handleAdd() {
        dialogConfig.isVisible = true;
        dialogConfig.title = "功能权限新增";
        dialogConfig.mode = "Add";
        dialogData.value = initDialogData;
    },
    async handleEdit(option: TableHandlerOption) {
        const functions = option.option?.rowData as FunctionList;
        const isEditStatus = option.option?.isEditStatus;
        if (isEditStatus) {
            await editFunctionInfoApi(functions);
        } else {
            dialogConfig.isVisible = true;
            dialogConfig.title = `功能权限编辑(${functions.functionNameCn})`;
            dialogConfig.mode = "Edit";
            dialogData.value = functions;
        }
    },
    handleDelete(){

    },
    async handleExport(option: TableHandlerOption) {
        let result;
        let fileName = ''
        if (option.option?.exportType === 'template') {
            result = await getExportTemplateApi();
            fileName = "权限导入模板";
        } else {
            result = await getExportDataApi({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
            fileName = "权限导出列表"
        }
        if (result) {
            excel(result, fileName);
        }
    }
}
const tableHandler = (option: TableHandlerOption) => {
    console.log(option)
    tableHandleEventObj[`handle${option.mode}`](option);
}

const dialogConfig = reactive({
    isVisible: false,
    title: '',
    mode: ''
});
let initDialogData = {
    functionId: -1,
    functionNameCn: '',
    functionNameEn: '',
    functionDescriptionCn: '',
    functionDescriptionEn: '',
    functionKey: '',
}
const dialogData = ref<FunctionList>(initDialogData);
const handleConfig = () => {
    dialogConfig.isVisible = false;
}

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})
const pageSizeChange = async (pageSize: number) => {
    await getTableData({ pageNum: pagination.currentPage, pageSize });
}
const currentPageChange = async (currentPage: number) => {
    await getTableData({ pageNum: currentPage, pageSize: pagination.pageSize });
}

getTableData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize })
</script>

<style lang="scss" scoped>
.search {

    .search-btn {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
        margin-right: 50px;
    }
}
</style>