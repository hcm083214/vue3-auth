import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useTest = defineStore('test', () => {
    const state = reactive({
        count: 1
    })
    const count = ref(1);
    const addReactive = () => {
        state.count++;
    }
    const addRef = () => {
        count.value++;
    }
    return { state, count, addReactive, addRef };
})