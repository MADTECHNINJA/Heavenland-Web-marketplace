<template>
    <div
        class="bg-clip-text text-lg text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        v-if="props.futureDate"
    >
        {{ countdown.day }} : {{ countdown.hour }} : {{ countdown.minute }} : {{ countdown.second }}
    </div>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount, reactive } from 'vue';

    const props = defineProps<{
        futureDate: number;
    }>();

    const futureDate = ref(new Date(parseInt(`${props.futureDate}000`)));

    const timer = ref(null);
    const countdown = reactive({
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
    });

    const getDateDiff = (date1: Date, date2: Date) => {
        const diff = new Date(date2.getTime() - date1.getTime());
        countdown.year = diff.getUTCFullYear() - 1970;
        countdown.month = diff.getUTCMonth();
        countdown.day = diff.getUTCDate() < 10 ? `0${diff.getUTCDate() - 1}` : diff.getUTCDate() - 1;
        countdown.hour = diff.getUTCHours() < 10 ? `0${diff.getUTCHours()}` : diff.getUTCHours();
        countdown.minute = diff.getUTCMinutes() < 10 ? `0${diff.getUTCMinutes()}` : diff.getUTCMinutes();
        countdown.second = diff.getUTCSeconds() < 10 ? `0${diff.getUTCSeconds()}` : diff.getUTCSeconds();
    };

    const getDiff = () => {
        getDateDiff(new Date(), futureDate.value);
    };

    onBeforeMount(() => {
        getDiff();
        timer.value = setInterval(getDiff, 1000);
    });

    onBeforeUnmount(() => {
        clearInterval(timer.value);
    });
</script>

<style></style>
