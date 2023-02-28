<template>
    <div class="sidebar-wrap">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeIndex" :collapse="isCollapse" active-text-color="#ffd04b"
                background-color="#2b2f3a" class="el-menu-vertical" text-color="#fff" mode="vertical">
                <sidebar-item v-for="item in sidebarRouters.router" :key="item.menuId" :item="item"
                    :index="item.path" :isCollapse="isCollapse"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch,inject } from 'vue';
import { useRoute } from 'vue-router';

import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";
import { usePermissionStore } from "@/store/permission.js";


const { usePermissionState } = usePermissionStore();
const result = usePermissionState.menusList || [];
const sidebarRouters = reactive({
    router: {}
});
if (result.length > 0) {
    sidebarRouters.router = result.sort((a, b) => a.orderNum - b.orderNum);
}

const isCollapse = ref(false);
const eventBus = inject("$bus");
eventBus.on("sidebarHandler",(isShow)=>{
    console.log(isShow)
    isCollapse.value = isShow;
})

const showLogo = ref(true);



const activeIndex = ref(result[0].path);
const route = useRoute();
watch(route, () => {
    activeIndex.value = route.path.replace("/", "");
}, {
    immediate: true
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