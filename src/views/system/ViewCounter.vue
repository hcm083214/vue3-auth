<template>
    <div class="UV-container">
        <el-row :gutter="16">
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="todayActive">
                        <template #title>
                            <div style="display: inline-flex; align-items: center">
                                日活跃用户
                                <el-tooltip effect="dark" content="Number of users who logged into the product in one day"
                                    placement="top">
                                    <el-icon style="margin-left: 4px" :size="12">
                                        <Warning />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-statistic>
                    <div class="statistic-footer">
                        <div class="footer-item">
                            <span>较昨日新增</span>
                            <span class="green">
                                {{ IncreaseFromYesterday }}
                                <el-icon>
                                    <CaretTop />
                                </el-icon>
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="693700">
                        <template #title>
                            <div style="display: inline-flex; align-items: center">
                                月活跃用户
                                <el-tooltip effect="dark" content="Number of users who logged into the product in one month"
                                    placement="top">
                                    <el-icon style="margin-left: 4px" :size="12">
                                        <Warning />
                                    </el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-statistic>
                    <div class="statistic-footer">
                        <div class="footer-item">
                            <span>较上月新增</span>
                            <span class="red">
                                12%
                                <el-icon>
                                    <CaretBottom />
                                </el-icon>
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="72000" title="New transactions today">
                        <template #title>
                            <div style="display: inline-flex; align-items: center">
                                New transactions today
                            </div>
                        </template>
                    </el-statistic>
                    <div class="statistic-footer">
                        <div class="footer-item">
                            <span>than yesterday</span>
                            <span class="green">
                                16%
                                <el-icon>
                                    <CaretTop />
                                </el-icon>
                            </span>
                        </div>
                        <div class="footer-item">
                            <el-icon :size="14">
                                <ArrowRight />
                            </el-icon>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>


    <div class="pv-container">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item :title="api.resourceName + '，总访问量：' + api.pageCounter['total']" :name="api.resourceId"
                v-for="api in data.apiList" :key="api.resourceId">
                <charts :chartData="chartData" :id="api.resourceName" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup lang="ts">
import {
    ArrowRight,
    CaretBottom,
    CaretTop,
    Warning,
} from '@element-plus/icons-vue';
import { onMounted, reactive, ref, computed } from 'vue';


import { getApiListApi, getApiUVApi, getApiPVApi } from "@/api/menu";
import { Resource, Count } from "@/api/types";
import Charts from "@/components/Charts.vue";
import { dataFormat } from "@/utils/index";

const data = reactive({
    apiList: [] as Resource[],
    uvCount: {} as Count
})
const todayActive = computed(() => data.uvCount[dataFormat(new Date(), 'YYYYMMDD')]);
const IncreaseFromYesterday = computed(() => {
    let time = new Date().getTime() - 24 * 60 * 60 * 1000;
    return (data.uvCount[dataFormat(new Date(time), 'YYYYMMDD')] - todayActive.value) / todayActive.value;
});
onMounted(() => {
    getApiListApi().then(result => {
        if (result.code === 200) {
            data.apiList = result.data;
        }
    });
    getApiUVApi(62).then(result => {
        if (result.code === 200) {
            data.uvCount = result.data;
        }
    });
})

const activeNames = ref()
type pvMap = {
    [attr: string]: Resource
}

const initChartData = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [] as string[]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [] as number[],
            type: 'line',
            areaStyle: {}
        }
    ]
};
const chartData = reactive(initChartData);
async function handleChange(val: number) {
    const result = {} as pvMap;
    if (!val) return;
    const r = await getApiPVApi(val, 7);
    if (r.code === 200) {
        result[val] = r.data;
        setChartsData(result[val]);
    }
}
function setChartsData(data: Resource) {
    chartData.xAxis.data = [];
    chartData.series[0].data = [];
    Object.keys(data.pageCounter).forEach(key => {
        if (key !== 'total') {
            chartData.xAxis.data.push(key);
            chartData.series[0].data.push(data.pageCounter[key]);
        }
    });
}

</script>

<style scoped lang="scss">
:global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
}

.UV-container {

    width: 80%;
    margin: 0 auto;

    .el-statistic {
        --el-statistic-content-font-size: 28px;
    }

    .statistic-card {
        height: 100%;
        padding: 20px;
        border-radius: 4px;
        background-color: var(--el-bg-color-overlay);
    }

    .statistic-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        font-size: 12px;
        color: var(--el-text-color-regular);
        margin-top: 16px;
    }

    .statistic-footer .footer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .statistic-footer .footer-item span:last-child {
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
    }
}

.pv-container {
    width: 80%;
    margin: 0 auto;
}

.green {
    color: var(--el-color-success);
}

.red {
    color: var(--el-color-error);
}
</style>