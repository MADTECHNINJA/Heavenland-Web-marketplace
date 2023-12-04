<template>
    <AppCardTitle class="my-4" :title="title" icon="chart-line" />
    <AppLineChart class="mb-4" :labels="dateLabels" :data="data" />
</template>

<script setup lang="ts">
    import { newDate } from '~/js/formatting';
    import { onMounted, reactive } from 'vue';
    const props = defineProps<{
        data: Array<number>;
        title: string;
        labels: Array<number>;
    }>();

    let dateLabels = reactive([]);
    onMounted(() => {
        props.labels.forEach((label) => {
            dateLabels.push(newDate(label, true));
        });
    });
</script>

<style></style>
