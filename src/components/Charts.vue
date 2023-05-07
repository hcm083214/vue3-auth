<template>
    <div class="echarts" ref="chartRef" :style="{ width: chartStyle.width + 'px', height: chartStyle.height + 'px' }"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { computed, ref, onMounted, reactive, watch } from 'vue';

const props = defineProps({
    chartData: {
        default: () => ({
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [1],
                    type: 'line',
                    areaStyle: {}
                }
            ]
        })
    },
    chartStyle: {
        default: () => ({
            width: 600,
            height: 300,
        })
    },
    id: {
        type: String,
        default: "0",
        required: true
    }
})
const chartData = reactive(props.chartData)
let chart: any = null;
const chartRef = ref();

onMounted(() => {
    chart = echarts.init(chartRef.value);
    chart.setOption(chartData);
})

watch(props.chartData,()=>{
    chart.setOption(chartData);
})



</script>

<style scoped></style>