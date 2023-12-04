<template>
    <LineChart
        :style="[width && `width:${width}px`, height && `height:${height}px`]"
        v-if="loaded"
        :options="options"
        :chartData="data"
    />
    <div v-else>
        <AppSpinner :size="8" class="flex justify-center items-center h-full w-full mt-10 md:mt-40" />
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, reactive } from 'vue';
    import 'chartjs-adapter-moment';
    import { LineChart } from 'vue-chart-3';
    import { Chart, registerables } from 'chart.js';
    Chart.register(...registerables);

    const props = defineProps<{
        data: Array<number>;
        labels: Array<string>;
        height: number | string;
        width: number | string;
    }>();

    onMounted(async () => {
        data.datasets[0].data = [...props.data];
        loaded.value = true;
        data.labels = props.labels;
    });

    const loaded = ref(false);

    const options = reactive({
        responsive: true,
        color: 'red',
        scales: {
            y: {
                ticks: { color: '#D0D5DC' },
            },
            x: {
                type: 'time',

                ticks: {
                    color: '#D0D5DC',
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: false,
                position: 'bottom',
            },
        },
    });

    const data = reactive({
        labels: [],
        datasets: [
            {
                pointRadius: 3,
                hoverRadius: 4,
                tension: 0.1,
                pointHitRadius: 20,
                borderWidth: 4,
                borderColor: (ctx) => {
                    const canvas = ctx.chart.ctx;
                    const gradient = canvas.createLinearGradient(0, 0, 0, 330);
                    gradient.addColorStop(0, '#4537D2');
                    gradient.addColorStop(1, '#b24cb6');
                    return gradient;
                },
            },
        ],
    });
</script>

<style></style>
