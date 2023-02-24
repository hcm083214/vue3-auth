<template>
    <el-sub-menu :index="index" v-if="item.children.length">
        <template #title>
            <el-icon>
                <location />
            </el-icon>
            <span>{{ item.menuName }}</span>
        </template>
        <el-menu-item-group v-for="child in item.children" :key="child.menuId">
            <el-menu-item :index="child.menuId + child.menuName" class="menu-item">{{ child.menuName }}</el-menu-item>
        </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item :index="index" class="menu-item" v-else>
        <el-icon><icon-menu /></el-icon>
        <span>{{ item.menuName }}</span>
    </el-menu-item>
</template>

<script setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const props = defineProps(['item', "index"])
</script>

<style lang="scss" scoped>
:deep(.el-menu-item-group__title) {
    padding: 0;
}
.menu-item{
    height: 50px;
}
</style>