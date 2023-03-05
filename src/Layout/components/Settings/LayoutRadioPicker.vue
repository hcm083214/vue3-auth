<template>
  <div class="layout-radio-picker">
    <div class="layout-radio-picker__classic pointer" :class="index == 'classic' ? 'is-active' : ''"
      @click="layoutRenderMethodHandler('classic')"></div>
    <div class="layout-radio-picker__top-left pointer" :class="index == 'top-left' ? 'is-active' : ''"
      @click="layoutRenderMethodHandler('top-left')"></div>
    <div class="layout-radio-picker__top pointer" :class="index == 'top' ? 'is-active' : ''"
      @click="layoutRenderMethodHandler('top')"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import appStore from "@/store/index";

const index = ref("classic");

const configStore = appStore.configStore;
const layoutRenderMethodHandler = (type: string) => {
  index.value = type;
  configStore.setConfigAction("layoutType", type)
}
</script>

<style lang="scss" scoped>
.layout-radio-picker {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  &>div {
    width: 56px;
    height: 56px;
    position: relative;
    background-color: rgba(209, 213, 219, .6);
  }

  .layout-radio-picker__classic {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 33%;
      height: 100%;
      background-color: #273352;
      border-radius: 4px 0 0 4px;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background-color: #fff;
      border-radius: 4px 4px 0 4px;
      content: '';
    }
  }

  .layout-radio-picker__top-left {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  .layout-radio-picker__top {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }
  }

  .layout-radio-picker__cut-menu {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 10%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  .is-active {
    border-color: var(--el-color-primary);
  }
}
</style>
