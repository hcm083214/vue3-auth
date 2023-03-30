<template>
    <div class="tags-view-wrap">
        <div class="icon-wrap arrow-left pointer" @click="scrollControl('decrease')">
            <Icon icon="svg-icon:arrowLeft" :size="20" />
        </div>
        <el-scrollbar ref="scrollbarRef" class="scrollbar" @wheel="scrollHandler">
            <div class="tags-view" ref="innerRef" >
                <router-link :to="menu.path" class="tags-view-item" v-for="menu in data.tagsMenuList" :key="menu.resourceId"
                    :class="{ 'active': activeIndex == menu.resourceId }">
                    <span>{{ menu.resourceName }}</span>
                    <span class="close" @click="removeTags(menu)">X</span>
                </router-link>
            </div>
        </el-scrollbar>
        <div class="icon-wrap arrow-right pointer" @click="scrollControl('add')">
            <Icon icon="svg-icon:arrowRight" :size="20" />
        </div>
        <el-popover :width="100" trigger="click">
            <template #reference>
                <div class="icon-wrap  pointer">
                    <Icon icon="svg-icon:setting" :size="20" />
                </div>
            </template>
            <template #default>
                <ul class="contextmenu">
                    <li @click="refreshSelectedTag">重新加载</li>
                    <li @click="closeSelectedTag">关闭标签页</li>
                    <li @click="closeOthersTags">关闭其他标签页</li>
                    <li @click="closeAllTags">关闭全部标签页</li>
                </ul>
            </template>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import { watch, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElScrollbar } from 'element-plus'

import Icon from "@/components/Icon.vue";
import { Resource } from "@/api/types";
import appStore from "@/store/index.js";


const data = reactive({
    tagsMenuList: [] as Resource[]
})
const activeIndex = ref(0);
const { permissionStore } = appStore;
const route = useRoute();

const tempTagsMenuMap = new Map<string, number>();
const setTagsMenuList = (menuList: Resource[], pathName: string) => {
    menuList.find((menu) => {
        if (menu.path === pathName) {
            activeIndex.value = menu.resourceId;
        }
        if (menu.path === pathName && !tempTagsMenuMap.has(pathName)) {
            tempTagsMenuMap.set(pathName, menu.resourceId)
            data.tagsMenuList.push(menu);
        } else {
            setTagsMenuList(menu.children, pathName);
        }
    })
}
// 监听路由变化生成 tagsMenuList
watch(() => route.path, (path) => {
    const pathName = path.replace("/", "");
    setTagsMenuList(permissionStore.usePermissionState.menusList, pathName);
}, {
    immediate: true
})
const refreshSelectedTag = () => {

}

const closeSelectedTag = () => {

}
const closeOthersTags = () => {

}
const closeAllTags = () => {

}

const removeTags = (menu: Resource) => {
    if (data.tagsMenuList.length <= 1) return
    data.tagsMenuList.find((tagsMenu, index) => {
        if (tagsMenu.resourceId === menu.resourceId) {
            // data.tagsMenuList.splice(index, 1);
            // tempTagsMenuMap.delete(menu.path);
        }
    })
}

let pos = 0;
const innerRef = ref<HTMLDivElement>();

// 滚动条相关功能
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const scrollControl = (type: "add" | "decrease") => {
    let innerRefWidth = innerRef.value!.clientWidth;
    if (type === "add") {
        scrollbarRef.value!.setScrollLeft(innerRefWidth);
        pos = innerRefWidth;
    } else if (type === "decrease") {
        scrollbarRef.value!.setScrollLeft(-innerRefWidth);
        pos = 0;
    }
}
const scrollHandler = (e) => {
    let innerRefWidth = innerRef.value!.clientWidth;
    let step = e.wheelDelta > 0 ? -5 : 5;
    pos += step;
    pos = pos > innerRefWidth ? innerRefWidth :
        pos < 0 ? 0 : pos;
    console.log(pos)
    scrollbarRef.value!.setScrollLeft(pos);
}


</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
.tags-view-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    height: $tags-view-height;
    background-color: var(--base-navbar-background);
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    :deep(.el-scrollbar__view) {
        height: 100%;
    }

    .scrollbar {
        width: calc(100% - 60px);
    }

    .tags-view {
        display: flex;
        height: 100%;

        .tags-view-item {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            height: 100%;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            margin-left: 5px;
            font-size: 12px;
            padding-right: 21px;

            .close {
                display: none;
            }

            &:hover {
                padding-right: 8px;
            }

            &:hover .close {
                display: inline-block;
                margin-left: 5px;
            }

            &:first-of-type {
                margin-left: 5px;
            }

            &:last-of-type {
                margin-right: 5px;
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
    }

    .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 30px;
        padding: 0 5px;
        border: 1px solid var(--el-border-color);
    }
}

.contextmenu {

    li {
        margin: 0;
        padding: 5px 0px;
        cursor: pointer;

        &:hover {
            background: #eee;
        }
    }
}
</style>