<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item :label="$t('system.locale')" prop="locale" class="col2">
                <el-select v-model="queryParams.locale" class="m-2" placeholder="Select">
                    <el-option v-for="item in locales" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.i18nModule')" prop="i18nModule" class="col2">
                <el-input v-model="queryParams.i18nModule" />
            </el-form-item>
            <el-form-item :label="$t('system.i18nKey')" prop="i18nKey" class="col2">
                <el-input v-model="queryParams.i18nKey" />
            </el-form-item>
        </el-form>
        <div class="search-btn">
            <el-button type="primary" @click="handleQuery">{{ $t('common.search') }}</el-button>
            <el-button @click="resetQuery(queryForm)">{{ $t('common.reset') }}</el-button>
        </div>
        <common-table :tableList="tableData.i18nList" :isLoading="tableData.isLoading"
            :tableHeaderConfig="tableData.headerConfig" :uploadRequestConfig="tableData.uploadRequestConfig"
            @handleEvent="tableHandler" />
        <Pagination :total="pagination.total" :pageSize="pagination.pageSize" :currentPage="pagination.currentPage"
            @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange" />
        <el-dialog v-model="dialogConfig.isVisible" :title="dialogConfig.title" width="50%" top="100px"
            :close-on-click-modal="false" destroy-on-close draggable>
            <i18n-config :i18nConfigData="dialogConfig.data" :mode="dialogConfig.mode" @handleConfig="handleConfig" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus'

import CommonTable from "@/components/CommonTable.vue";
import { TableOperation, TableHandlerOption } from "@/components/CommonTable";
import Pagination from "@/components/Pagination.vue";
import { I18nData } from "@/api/types";
import { getIl8nListApi, i18nParams } from "@/api/config";
import { $t, SUPPORT_LOCALES as locales } from "@/utils/i18n";
import { getToken } from "@/utils/token";
import I18nConfig from "@/views/system/i18n/I18nConfig.vue";

async function getI18nData(params: i18nParams) {
    tableData.isLoading = true;
    const result = await getIl8nListApi(params);
    if (result.code === 200) {
        tableData.i18nList = result.data.list;
        pagination.total = result.data.total;
    }
    tableData.isLoading = false;
}
onMounted(() => getI18nData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize }));

const queryParams = reactive({
    locale: '',
    i18nModule: '',
    i18nKey: "",
})
const queryForm = ref();
function handleQuery() {
    getI18nData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, ...queryParams });
}
function resetQuery(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields();
    getI18nData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
}

const tableData = reactive({
    i18nList: [] as I18nData[],
    isLoading: false,
    headerConfig: [
        {
            label: $t('system.i18nId'),
            prop: 'i18nId',
            width: 80,
        },
        {
            label: $t('system.locale'),
            prop: 'locale',
            width: 100,
        },
        {
            label: $t('system.i18nModule'),
            prop: 'i18nModule',
            width: 180,
        },
        {
            label: $t('system.i18nKey'),
            prop: 'i18nKey',
            width: 200,
        },
        {
            label: $t('system.i18nValue'),
            prop: 'i18nValue',
            width: 250,
        },
    ],
    uploadRequestConfig: {
        uploadUrl: "api/i18n/import",
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
        dialogConfig.data = initI18nData;
    },
    async handleEdit(option: TableHandlerOption<I18nData>) {
        dialogConfig.isVisible = true;
        dialogConfig.title = $t('common.edit');
        dialogConfig.data = option.option?.rowData as I18nData;
        dialogConfig.mode = TableOperation.Edit;
    },
    handleDelete() {

    },
    async handleExport(config: TableHandlerOption<I18nData>) {

    }
}
const tableHandler = (option: TableHandlerOption<I18nData>) => {
    tableHandleEventObj[`handle${option.mode}`](option);
}

// 弹框相关逻辑
const initI18nData = {
    i18nId: -1,
    i18nKey: "",
    i18nModule: "",
    i18nValue: "",
    locale: "",
}
const dialogConfig = reactive({
    isVisible: false,
    title: '',
    mode: '',
    data: {} as I18nData,
});

const handleConfig = () => {
    dialogConfig.isVisible = false;
    getI18nData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
}

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    sizeSelection: [10, 20, 50, 100, 200]
})

function pageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
    getI18nData({ pageNum: pagination.currentPage, pageSize });
}

function currentPageChange(pageNum: number) {
    pagination.currentPage = pageNum;
    getI18nData({ pageNum, pageSize: pagination.pageSize });
}
</script>

<style scoped>
.search-btn {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    margin-right: 50px;
}
</style>