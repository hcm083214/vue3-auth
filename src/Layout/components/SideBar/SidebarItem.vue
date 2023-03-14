<template>
    <el-sub-menu :index="index" v-if="item.children.length">
        <template #title>
            <icon v-if="grade == 1" :icon="'svg-icon:'+item.icon"></icon>
            <span>{{ item.menuName }}</span>
        </template>
        <el-menu-item-group v-for="child in item.children" :key="child.menuId">
            <sidebar-item :item="child" :index="child.path" :grade="gradeInner" />
        </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item :index="index" class="menu-item" v-else>
        <icon v-if="grade == 1" :icon="'svg-icon:'+item.icon"></icon>
        <template #title v-if="item.component">
            <router-link :to="{ 'name': item.path }">
                {{ item.menuName }}
            </router-link>
        </template>
        <template #title v-else>
            <el-button text disabled>{{ item.menuName }}</el-button>
        </template>
    </el-menu-item>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";

const props = defineProps(['item', "index", "grade"]);
// 用来标记菜单的等级
let gradeInner = props.grade + 1;
</script>

<style lang="scss" scoped>
:deep(.el-menu-item-group__title) {
    padding: 0;
}

:deep(.el-menu--collapse .el-sub-menu__title) {
    display: flex;
    justify-content: center;
    padding: 0;
}

:deep(.el-menu-item button) {
    padding: 0;
}

.menu-item {
    height: 50px;
}
</style>