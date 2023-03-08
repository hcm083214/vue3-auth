<template>
    <div class="color-radio-picker-warp">
        <span v-for="(item, i) in schema" :key="`radio-${i}`"
            class="pointer"
            :class="{ 'is-active': colorVal === item }" :style="{
                background: item
            }" @click="colorVal = item">
            <Icon v-if="colorVal === item" color="#fff" icon="ep:check" :size="16" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    schema: {
        type: Array,
        default: () => []
    }
})
let colorVal = ref(props.schema[0]);
</script>

<style scoped lang="scss">
.color-radio-picker-warp {
    display: flex;

    .is-active {
        border-color: var(--el-color-primary);
    }
}
</style>