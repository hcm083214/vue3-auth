<template>
    <el-form ref="roleFormRef" :model="roleForm" label-position="top" :inline="true" :rules="rules" label-width="120px">
        <el-form-item label="角色中文名" prop="roleNameCn">
            <el-input v-model="roleForm.roleNameCn" class="role-name" />
        </el-form-item>
        <el-form-item label="角色英文名" prop="roleNameEn">
            <el-input v-model="roleForm.roleNameEn" class="role-name" />
        </el-form-item>
        <el-form-item label="角色中文描述" prop="roleDescriptionCn">
            <el-input v-model="roleForm.roleDescriptionCn" maxlength="200" type="textarea" class="role-desc" />
        </el-form-item>
        <el-form-item label="角色英文描述" prop="roleDescriptionEn">
            <el-input v-model="roleForm.roleDescriptionEn" maxlength="200" type="textarea" class="role-desc" />
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { FormRules } from 'element-plus';
import { reactive } from 'vue';

const roleForm = reactive({
    roleNameCn: '',
    roleNameEn: '',
    roleDescriptionCn: '',
    roleDescriptionEn: '',
})
const rules = reactive<FormRules>({

})
</script>

<style scoped lang="scss">
.role-name {
    width: 240px;
    margin-right: 50px;
}

.role-desc {
    width: 650px;
    height: 50px;
}
</style>