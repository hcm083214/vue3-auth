<template>
    <div class="search">
        <el-form ref="menuFormRef" :model="menuForm" label-position="right" :inline="true" label-width="80px">
            <el-form-item :label="$t('permission.functionName')" prop="functionNameCn">
                <el-select v-model="menuForm.functionNameCn" :placeholder="$t('permission.functionDescriptionPlaceholder')"
                    filterable remote clearable :remote-method="handleFunctionSearch" style="width: 200px"
                    @keyup.enter.native="handleQuery">
                    <el-option v-for="(item, index) in searchData.searchFunctionList" :key="item + index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('permission.functionKey')" prop="functionKey">
                <el-select v-model="menuForm.functionKey" :placeholder="$t('permission.functionKeyPlaceholder')" filterable
                    remote clearable :remote-method="handleFunctionKeySearch" style="width: 200px"
                    @keyup.enter.native="handleQuery">
                    <el-option v-for="(item, index) in searchData.searchFunctionKeyList" :key="item + index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.status')" prop="status">
                <el-select v-model="menuForm.status" :placeholder="$t('common.status')" clearable style="width: 200px">
                    <el-option v-for="(status, index) in searchData.functionStatus" :key="index" :label="status.label"
                        :value="status.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <div class="search-btn">
            <el-button type="primary" @click="handleQuery">{{ $t('common.search') }}</el-button>
            <el-button @click="resetQuery(menuFormRef)">{{ $t('common.reset') }}</el-button>
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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

import Pagination from "@/components/Pagination.vue";
import CommonTable from "@/components/CommonTable.vue";
import { TableOperation, TableHandlerOption } from "@/components/CommonTable";
import FunctionConfig from "@/views/permission/function/FunctionConfig.vue";
import { getFunctionListApi, FunctionListApiQuery, getExportDataApi, getExportTemplateApi, editFunctionInfoApi, getFunctionSearchListApi } from "@/api/function";
import type { FunctionList } from "@/api/types";
import { excel } from "@/utils/download";
import { getToken } from "@/utils/token";
import { $t } from '@/utils/i18n';

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
            label: $t('common.ineffective')
        },
        {
            value: 1,
            label: $t('common.effectivity')
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

const tableData = reactive({
    isLoading: false,
    functionList: [] as FunctionList[],
    headerConfig: [
        {
            label: $t('permission.functionId'),
            prop: 'functionId',
            width: 120,
        },
        {
            label: $t('permission.functionName'),
            prop: 'functionNameCn',
            width: 150,
        },
        {
            label: $t('permission.functionKey'),
            prop: 'functionKey',
            width: 150,
        },
        {
            label: $t('permission.functionDescription'),
            prop: 'functionDescriptionCn',
            width: 200,
        },
        {
            label: $t('common.status'),
            prop: 'status',
            width: 120,
        },
        {
            label: $t('common.createTime'),
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
        dialogConfig.title = $t('common.add');
        dialogConfig.mode = TableOperation.Add;
        dialogData.value = initDialogData;
    },
    async handleEdit(option: TableHandlerOption<FunctionList>) {
        const functions = option.option?.rowData as FunctionList;
        const isEditStatus = option.option?.isEditStatus;
        if (isEditStatus) {
            await editFunctionInfoApi(functions);
        } else {
            dialogConfig.isVisible = true;
            dialogConfig.title = $t('common.edit') + `(${functions.functionNameCn})`;
            dialogConfig.mode = TableOperation.Edit;
            dialogData.value = functions;
        }
    },
    handleDelete() {

    },
    async handleExport(option: TableHandlerOption<FunctionList>) {
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
const tableHandler = (option: TableHandlerOption<FunctionList>) => {
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