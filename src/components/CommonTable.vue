<template>
    <div>
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
                <el-button type="warning" plain @click="handleExport('template')">
                    <icon icon="svg-icon:export" />
                    导入模板下载
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
        <el-table v-loading="props.isLoading" :data="props.tableList">
            <el-table-column type="selection" width="55" align="center" />
            <template v-for="rows in props.tableHeaderConfig" :key="rows.label">

                <el-table-column label="状态" align="center" width="100" v-if="rows.label == '状态'">
                    <template #default="scope">
                        <el-switch active-value="1" inactive-value="0" v-model="scope.row.status"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-else-if="rows.label == '创建时间'">
                    <template #default="scope">
                        <span>{{ dataFormat(scope.row.createTime, "YYYY/MM/DD HH:mm:ss") }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="rows.label" :prop="rows.prop" :width="rows.width" v-else />
            </template>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="small" link type="primary">
                        <icon icon="svg-icon:edit" />修改
                    </el-button>
                    <el-button size="small" link type="primary">
                        <icon icon="svg-icon:delete" />删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadUserFile, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus';

import { dataFormat } from "@/utils/index";
import Icon from "@/components/Icon.vue";
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    tableList: {
        type: Array,
        default: [],
    },
    tableHeaderConfig: {
        default: () => ([{
            label: '',
            prop: '',
            width: 120,
        }])
    },
    // 提供给upload组件的请求配置
    uploadRequestConfig: {
        type: Object,
        default: () => ({
            uploadUrl: '',
            headers: {
                Authorization: ''
            }
        })
    }
})
const fileList = ref<UploadUserFile[]>();
const emit = defineEmits(["handleEvent"])
const handleAdd = () => {
    emit("handleEvent", { mode: "Add" })
}
const handleExport = (type: 'template' | undefined) => {
    emit("handleEvent", {
        mode: "Export",
        option: {
            type
        }
    })
}
const handleUploadSuccess = (response: any) => {
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
</script>

<style scoped lang="scss"></style>