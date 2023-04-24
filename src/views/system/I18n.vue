<template>
    <div>
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

import CommonTable from "@/components/CommonTable.vue";
import { TableOperation, TableHandlerOption } from "@/components/CommonTable";
import Pagination from "@/components/Pagination.vue";
import { I18nData } from "@/api/types";
import { getIl8nListApi } from "@/api/config";
import { $t } from "@/utils/i18n";
import { getToken } from "@/utils/token";
import I18nConfig from "@/views/system/i18n/I18nConfig.vue";

async function getI18nData() {
    tableData.isLoading = true;
    const result = await getIl8nListApi({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, });
    if (result.code === 200) {
        tableData.i18nList = result.data.list;
        pagination.total = result.data.total;
    }
    tableData.isLoading = false;
}
onMounted(() => getI18nData());

const tableData = reactive({
    i18nList: [] as I18nData[],
    isLoading: false,
    headerConfig: [
        {
            label: $t('permission.roleId'),
            prop: 'i18nId',
            width: 80,
        },
        {
            label: $t('permission.roleId'),
            prop: 'locale',
            width: 100,
        },
        {
            label: $t('permission.roleId'),
            prop: 'i18nModule',
            width: 180,
        },
        {
            label: $t('permission.roleId'),
            prop: 'i18nKey',
            width: 200,
        },
        {
            label: $t('permission.roleId'),
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
    getI18nData();
}

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    sizeSelection: [10, 20, 50, 100, 200]
})

function pageSizeChange(pageSize: number) {
    pagination.pageSize = pageSize;
}

function currentPageChange(pageNum: number) {
    pagination.currentPage = pageNum;
}
</script>

<style scoped></style>