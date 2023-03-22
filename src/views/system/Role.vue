<template>
    <div class="app-container">
        <div class="search">
            <el-form :model="queryParams" ref="queryForm" :inline="true">
                <el-form-item label="角色名称" prop="roleNameCn">
                    <el-select v-model="queryParams.roleNameCn" placeholder="请输入角色名称" filterable remote clearable
                        :remote-method="handleRoleSearch" :loading="searchData.isRoleLoading" style="width: 200px"
                        @keyup.enter.native="handleQuery">
                        <el-option v-for="role in searchData.roleList" :key="role.roleId" :label="role.roleNameCn"
                            :value="role.roleNameCn" />
                    </el-select>
                </el-form-item>
                <el-form-item label="权限字符" prop="roleKey">
                    <el-select v-model="queryParams.roleKey" placeholder="请输入权限字符" filterable remote clearable
                        :remote-method="handleRoleKeySearch" :loading="searchData.isRoleKeyLoading" style="width: 200px"
                        @keyup.enter.native="handleQuery">
                        <el-option v-for="role in searchData.roleList" :key="role.roleId" :label="role.roleKey"
                            :value="role.roleKey" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 200px">
                        <el-option v-for="(status, index) in searchData.roleStatus" :key="index" :label="status.label"
                            :value="status.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="queryParams.dateRange" style="width: 200px" value-format="YYYY/MM/DD"
                        type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <div class="search-btn">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery(queryForm)">重置</el-button>
            </div>
        </div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain @click="handleAdd">
                    <icon icon="svg-icon:add" />
                    新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain @click="handleExport">
                    <icon icon="svg-icon:export" />
                    导出
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain @click="handleExport('template')">
                    <icon icon="svg-icon:export" />
                    导入模板
                </el-button>
            </el-col>

            <el-col :span="1.5">
                <el-upload v-model:file-list="fileList" class="upload-demo" method="post" :on-success="handleUploadSuccess"
                    :on-error="handleUploadError" :show-file-list="false" :action="uploadRequestConfig.uploadUrl"
                    :headers="uploadRequestConfig.headers">
                    <el-button type="success" plain>
                        <icon icon="svg-icon:import" />
                        导入
                    </el-button>
                </el-upload>
            </el-col>
        </el-row>

        <el-table v-loading="tableData.loading" :data="tableData.roleList">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="角色编号" prop="roleId" width="120" />
            <el-table-column label="角色名称" prop="roleNameCn" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="显示顺序" prop="roleSort" width="100" />
            <el-table-column label="状态" align="center" width="100">
                <template #default="scope">
                    <el-switch active-value="1" inactive-value="0" v-model="scope.row.status"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ dataFormat(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="small" link type="primary">
                        <icon icon="svg-icon:edit" />修改
                    </el-button>
                    <el-button size="small" link type="primary">
                        <icon icon="svg-icon:delete" />删除
                    </el-button>
                    <el-dropdown size="small" class="dropdown-more">
                        <el-button size="small" link type="primary">更多</el-button>
                        <template #dropdown>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleDataScope">数据权限</el-dropdown-item>
                                <el-dropdown-item command="handleAuthUser">分配用户</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <span class="size">共{{ pagination.total }}条</span>
            <el-select v-model="pagination.pageSize" class="m-2 pagination-select" placeholder="Select">
                <el-option v-for="(item, index) in pagination.sizeSelection" :key="index" :label="item + '条/页'"
                    :value="item" />
            </el-select>
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :background="true" layout="prev, pager, next" :total="pagination.total" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import { dayjs, ElMessage } from 'element-plus'
import type { UploadUserFile,FormInstance } from 'element-plus'

import { getRoleListApi, exportRoleListApi, importTemplateApi, importRoleListApi } from "@/api/role";
import type { roleListApiQuery } from "@/api/role";
import { RoleList } from "@/api/types";
import Icon from "@/components/Icon.vue";
import { excel } from "@/utils/download";
import { getToken } from "@/utils/token";

const dataFormat = (date: string) => {
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
}

const tableData = reactive({
    roleList: [] as RoleList[],
    loading: false,
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
    roleList: [] as RoleList[],
    isRoleLoading: false,
    isRoleKeyLoading: false,
})
const queryForm = ref();
const queryParams = reactive({
    roleNameCn: '',
    roleKey: "",
    status: "",
    dateRange: [],
})

onMounted(async () => {
    await handleQuery();
})

const getRoleList = async (params: roleListApiQuery, type: string = 'table') => {
    let result = await getRoleListApi(params);
    if (result.code === 200) {
        if (type == 'table') {
            tableData.roleList = result.data.list;
            pagination.total = result.data.total;
        } else {
            searchData.roleList = result.data.list;
        }

    }
}
const handleRoleSearch = async (query: string) => {
    searchData.isRoleLoading = true;
    await getRoleList({ pageNum: 1, pageSize: 400, roleNameCn: query }, "search");
    searchData.isRoleLoading = false;
}
const handleRoleKeySearch = async (query: string) => {
    searchData.isRoleKeyLoading = true;
    await getRoleList({ pageNum: 1, pageSize: 400, roleKey: query }, "search");
    searchData.isRoleKeyLoading = false;
}
const handleQuery = async () => {
    tableData.loading = true;
    await getRoleList({ pageNum: pagination.currentPage, pageSize: pagination.pageSize, ...queryParams })
    tableData.loading = false;
}
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
}

const handleAdd = () => {

}

const handleDelete = () => {
    
}
const fileList = ref<UploadUserFile[]>();
const uploadRequestConfig = reactive({
    uploadUrl: "api/roles/import",
    headers: {
        Authorization: getToken()
    }
})

const handleUploadSuccess = (response: any) => {
    console.log(response)
    if (response.code === 200) {
        ElMessage({
            type: 'success',
            message: response.msg
        })
    } else {
        ElMessage({
            type: 'error',
            message: response.msg
        })
    }
}
const handleUploadError = (error: Error) => {
    ElMessage({
        type: 'error',
        message: "上传失败"
    })
}
const handleExport = async (type?: string) => {
    if (type === "template") {
        const result = await importTemplateApi();
        excel(result, "角色列表导入模板");
    } else {
        const result = await exportRoleListApi({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
        excel(result, "角色列表");
    }
}

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    sizeSelection: [10, 20, 50, 100, 200]
})
const pageChange = async () => {
    tableData.loading = true;
    await getRoleList({ pageNum: pagination.currentPage, pageSize: pagination.pageSize });
    tableData.loading = false;
}
watch(() => pagination.currentPage, async () => {
    await pageChange();
});
watch(() => pagination.pageSize, async () => {
    await pageChange();
})

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