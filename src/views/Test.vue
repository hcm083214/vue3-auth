<template>
    <div>
        test
        <div @click="addRef"> {{ count }}</div>
        <div @click="addReactive"> {{ state.count }}</div>
    </div>
</template>

<script setup lang="ts">
import { useTest } from '@/store/test';
import { storeToRefs } from 'pinia';

const testStore = useTest();
const {  state, addReactive, addRef } = testStore
const { count } = storeToRefs(testStore)
</script>

<style scoped></style>