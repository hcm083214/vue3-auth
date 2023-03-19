<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
                <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable style="width: 240px"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 240px">
                    <el-option v-for="dict in 2" :key="dict" :label="dict" :value="dict" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="queryParams.dateRange" style="width: 240px" value-format="yyyy-MM-dd"
                    type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" @click="handleUpdate">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-col>
        </el-row>

        <el-table v-loading="tableData.loading" :data="tableData.roleList">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="角色编号" prop="roleId" width="120" />
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="显示顺序" prop="roleSort" width="100" />
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <el-switch active-value="0" inactive-value="1"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                    <span>{{ }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="small">修改</el-button>
                    <el-button size="small">删除</el-button>
                    <el-dropdown size="small">
                        <el-button size="small">更多</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleDataScope">数据权限</el-dropdown-item>
                            <el-dropdown-item command="handleAuthUser">分配用户</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">

            <span class="size">共{{ pagination.total }}条</span>
            <el-select v-model="pagination.pageSize" class="m-2 pagination-select" placeholder="Select" >
                <el-option v-for="(item, index) in pagination.sizeSelection" :key="index" :label="item + '条/页'"
                    :value="item" />
            </el-select>
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :background="true" layout="prev, pager, next" :total="pagination.total" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';

import { getRoleListApi } from "@/api/role";
import { RoleList } from "@/api/types";

const tableData = reactive({
    roleList: [] as RoleList[],
    loading: false
})

const queryParams = reactive({
    roleName: '',
    roleKey: "",
    status: '',
    dateRange: [],
})

onMounted(() => {
    getRoleList(pagination.currentPage, pagination.pageSize);
})
const getRoleList = async (pageNum: number, pageSize: number) => {
    let result = await getRoleListApi({ pageNum, pageSize });
    console.log("🚀 ~ file: Role.vue:108 ~ getRoleList ~ result:", result)
    if (result.code === 200) {
        tableData.roleList = result.data.list;
        pagination.total = result.data.total;
    }
}

const getList = () => {

}
const handleQuery = () => {

}
const resetQuery = () => {

}

const handleAddRole = () => {

}
const handleAdd = () => {

}
const handleUpdate = () => {

}
const handleEdit = () => {

}

const handleDelete = () => {

}

const handleExport = () => {

}


const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    sizeSelection: [10, 20, 50, 100, 200]
})
watch(pagination, (pagination) => {
    getRoleList(pagination.currentPage, pagination.pageSize);
})

</script>

<style lang="scss" scoped>
.app-container {
    .roles-table {
        margin-top: 30px;
    }

    .permission-tree {
        margin-bottom: 30px;
    }

    .pagination {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .pagination-size {
            margin-left: 10px;
            width: 80px;
        }

        .size {
            margin-right: 10px;
        }

        .pagination-select {
            margin-right: 10px;
            width: 100px;
            height: 30px;
        }
    }
}
</style>