<template>
    <div class="app-container">
        <div class="search">
            <el-form ref="menuFormRef" :model="menuForm" label-position="right" :inline="true" label-width="80px">
                <el-form-item label="权限名称" prop="functionNameCn">
                    <el-input v-model="menuForm.functionNameCn" />
                </el-form-item>
                <el-form-item label="权限字符" prop="functionKey">
                    <el-input v-model="menuForm.functionKey" />
                </el-form-item>
            </el-form>
            <div class="search-btn">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery(menuFormRef)">重置</el-button>
            </div>
        </div>
        <common-table :tableList="tableData.functionList" :isLoading="tableData.isLoading"
            :tableHeaderConfig="tableData.headerConfig" @handleEvent="tableHandler" />
        <Pagination :total="pagination.total" :pageSize="pagination.pageSize" :currentPage="pagination.currentPage"
            @pageSizeChange="pageSizeChange" @currentPageChange="currentPageChange" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

import Pagination from "@/components/Pagination.vue";
import CommonTable from "@/components/CommonTable.vue";
import { getFunctionListApi, FunctionListApiQuery } from "@/api/function";
import type { FunctionList } from "@/api/types";

onMounted(async () => {
    await getTableData({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
})
const getTableData = async (params: FunctionListApiQuery) => {
    const result = await getFunctionListApi(params);
    if (result.code === 200) {
        tableData.functionList = result.data.list;
        pagination.total = result.data.total;
    }
}

const menuFormRef = ref();
const menuForm = reactive({
    functionNameCn: '',
    functionKey: ''
})
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}
const handleQuery = () => {

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
            width: 100,
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
            width: 120,
        },
    ]
})
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})
const tableHandler = (params: Object) => {
    console.log("🚀 ~ file: Functional.vue:133 ~ tableHandler ~ params:", params)
}
const pageSizeChange = async (pageSize: number) => {
    await getTableData({ pageNum: pagination.currentPage, pageSize });
}
const currentPageChange = async (currentPage: number) => {
    await getTableData({ pageNum: currentPage, pageSize: pagination.pageSize });
}
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