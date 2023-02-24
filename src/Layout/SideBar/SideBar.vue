<template>
    <div class="sidebar-wrap">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeIndex" active-text-color="#ffd04b" background-color="#2b2f3a"
                class="el-menu-vertical" text-color="#fff" mode="vertical">
                <sidebar-item v-for="item in sidebarRouters.router" :key="item.menuId" :item="item"
                    :index="item.menuName"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getMenuListApi } from "../../api/menu.js";
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";

const activeIndex = ref("1");
const isCollapse = ref(true);
const showLogo = ref(true);
const sidebarRouters = reactive({
    router: {}
});

const handleSelect = (key, keyPath) => {
    console.log(key, keyPath)
}
onMounted(async () => {
    const result = await getMenuListApi() || [];
    if (result.length > 0) {
        sidebarRouters.router = result.sort((a, b) => a.orderNum - b.orderNum);
    }
})
</script>

<style lang="scss" scoped>
.sidebar-wrap {
    max-width: 200px;
    height: calc(100% - 50px);
}

.scrollbar-wrapper {
    height: 100%;
}

:deep(.el-scrollbar__view) {
    height: 100%;
}

.el-menu-vertical {
    height: 100%;
}
</style>