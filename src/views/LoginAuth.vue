<template>
    <div class="center">
        <div v-loading="isLoading"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from 'element-plus';

import { setToken } from '@/utils/token';
import { loginByThirdPartyApi } from "@/api/login";


const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
onMounted(async () => {
    const result = await loginByThirdPartyApi({
        source: localStorage.getItem("thirdPartySource") || "",
        code: route.query.code as string,
        uuid: localStorage.getItem("giteeUuid") || "",
    });
    if (result.code == 200) {
        setToken(result.data.token);
        router.push("/home");
        localStorage.removeItem("giteeUuid");
        localStorage.removeItem("thirdPartySource");
    } else {
        ElMessage({
            message: result.msg,
            type: 'warning',
        })
    }
    isLoading.value = false;
})
</script>

<style scoped>
.center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>