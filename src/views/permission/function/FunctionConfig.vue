<template>
    <div>
        <el-form ref="functionFormRef" :model="functionForm" label-position="top" :inline="true" :rules="rules"
            label-width="120px">
            <el-form-item label="角色中文名" prop="functionNameCn">
                <el-input v-model="functionForm.functionNameCn" class="role-name" />
            </el-form-item>
            <el-form-item label="角色英文名" prop="functionNameEn">
                <el-input v-model="functionForm.functionNameEn" class="role-name" />
            </el-form-item>
            <el-form-item label="角色中文描述" prop="functionDescriptionCn">
                <el-input v-model="functionForm.functionDescriptionCn" maxlength="200" type="textarea" class="role-desc" />
            </el-form-item>
            <el-form-item label="角色英文描述" prop="functionDescriptionEn">
                <el-input v-model="functionForm.functionDescriptionEn" maxlength="200" type="textarea" class="role-desc" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { FormRules } from 'element-plus';

const functionFormRef = ref();
const functionForm = reactive({
    functionNameCn: '',
    functionNameEn: '',
    functionDescriptionCn: '',
    functionDescriptionEn: '',
})
const rules = reactive<FormRules>({

})
</script>

<style scoped lang="scss"></style>