<template>
    <div class="flex align-items-center">
        <el-dropdown>
            <span class="el-dropdown-link">
                {{ $t('system.locale') }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="item in locales" :key="item" :label="item" :value="item"
                        @click="handleClick(item)">
                        {{ item }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { $t, SUPPORT_LOCALES as locales, support_locales,loadLanguageAsync } from "@/utils/i18n";

async function handleClick(locale: support_locales) {
    await loadLanguageAsync(locale);
}
</script>

<style scoped></style>