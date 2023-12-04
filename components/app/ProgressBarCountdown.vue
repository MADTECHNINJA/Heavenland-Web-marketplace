<template>
    <div class="flex flex-col pt-1">
        <AppTooltip
            :text="
                progress > 0 && countdown.year === 0
                    ? `${countdown.day} days ${countdown.hour} hours ${countdown.minute} minutes`
                    : 'Operation is done. <br/> <br/> Confirmation process may takes a few minutes.'
            "
        >
            <div class="flex justify-center flex-col rounded-md px-0.5 items-center w-[200px]">
                <div class="flex items-center space-x-2 w-full">
                    <div class="w-full relative bg-indigo-900 grow h-1.5 rounded-full overflow-clip">
                        <div
                            class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1.5 rounded-full"
                            :class="[
                                progress === 0 || countdown.year < 0
                                    ? 'from-green-900 to-green-700'
                                    : 'from-indigo-700 animate-pulse to-[#b24cb6]',
                            ]"
                            :style="{ width: 100 - (progress * 100) / total + '%' }"
                        ></div>
                    </div>
                </div>

                <span class="text-sm text-gray-300 font-semibold mt-2">{{
                    100 - (progress * 100) / total < 100
                        ? (100 - (progress * 100) / total).toFixed(2) + '%'
                        : (100 - (progress * 100) / total).toFixed(0) + '%'
                }}</span>
            </div>
        </AppTooltip>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onBeforeMount, onBeforeUnmount, reactive } from 'vue';

    const props = defineProps<{
        enterTime: number;
        futureTime: number;
    }>();

    const countdown = reactive({
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
    });

    const futureTime = ref(new Date(parseInt(`${props.futureTime}000`)));
    const enterTime = ref(new Date(parseInt(`${props.enterTime}000`)));

    const getDateDiff = (date1: Date, date2: Date) => {
        return new Date(date2.getTime() - date1.getTime()).getTime();
    };

    const total = computed(() => {
        return getDateDiff(enterTime.value, futureTime.value);
    });

    const progress = computed(() => {
        return getDateDiff(now.value, futureTime.value) > 0 ? getDateDiff(now.value, futureTime.value) : 0;
    });

    const getExact = (date1: Date, date2: Date) => {
        const diff = new Date(date2.getTime() - date1.getTime());
        countdown.year = diff.getUTCFullYear() - 1970;
        countdown.month = diff.getUTCMonth();
        countdown.day = diff.getUTCDate() - 1;
        countdown.hour = diff.getUTCHours();
        countdown.minute = diff.getUTCMinutes();
        countdown.second = diff.getUTCSeconds();
    };

    const now = ref(new Date());

    const timer = ref(null);
    const progressTimer = ref(null);

    const getDiff = () => {
        getExact(new Date(), futureTime.value);
    };

    const setNow = () => {
        now.value = new Date();
    };

    onBeforeMount(() => {
        getDiff();
        timer.value = setInterval(getDiff, 1000);
        progressTimer.value = setInterval(setNow, 5000);
    });

    onBeforeUnmount(() => {
        clearInterval(timer.value);
        clearInterval(progressTimer.value);
    });
</script>

<style></style>
