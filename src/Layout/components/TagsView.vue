<template>
    <div class="tags-view-wrap">
        <div class="icon-wrap arrow-left pointer">
            <Icon icon="svg-icon:arrowLeft" :size="20" />
        </div>
        <el-scrollbar class="tags-view">
            <router-link class="tags-view-item" :to="menu.path" v-for="menu in data.tagsMenuList" :key="menu.menuId"
                :class="{ 'active': activeIndex == menu.menuId }">
                <span>{{ menu.menuName }}</span>
            </router-link>
        </el-scrollbar>
        <div class="icon-wrap arrow-right pointer">
            <Icon icon="svg-icon:arrowRight" :size="20" />
        </div>
        <div class="icon-wrap  pointer">
            <Icon icon="svg-icon:setting" :size="20" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import Icon from "@/components/Icon.vue";
import { Menu } from "@/api/types";
import appStore from "@/store/index.js";


const data = reactive({
    tagsMenuList: [] as Menu[]
})
const activeIndex = ref(0);
const { permissionStore } = appStore;
const route = useRoute();
watch(() => route.path, (path) => {
    const pathName = path.replace("/", "");
    
    permissionStore.usePermissionState.menusList.forEach(menu => {
        if (menu.path === pathName) {
            data.tagsMenuList.push(menu);
            activeIndex.value = menu.menuId;
        } else {
            menu.children.forEach(menu => {
                if (menu.path === pathName) {
                    data.tagsMenuList.push(menu);
                    activeIndex.value = menu.menuId;
                }
            })
        }
    })
})
</script>

<style lang="scss" scoped>
.tags-view-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    height: 30px;
    background-color: var(--base-navbar-background);
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        margin-left: 5px;
        font-size: 12px;


        &:first-of-type {
            margin-left: 15px;
        }

        &:last-of-type {
            margin-right: 15px;
        }

        &.active {
            background-color: #42b983;
            color: #fff;
            border-color: #42b983;

            &::before {
                content: '';
                background: #fff;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                margin-right: 2px;
            }
        }
    }

    .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 30px;
        border: 1px solid var(--el-border-color);
    }
}
</style>