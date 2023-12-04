<template>
    <section class="rounded-lg w-full grid grid-cols-3 gap-3">
        <div
            class="bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 col-span-1 rounded-lg p-4 flex flex-col text-sm"
        >
            <span>Stake available</span>

            <div class="flex items-center">
                <span class="text-lg font-bold mr-1">{{ stakeLimitAvailable }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>

        <div
            class="col-span-1 bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg p-4 flex flex-col text-sm"
        >
            <span>Current stake</span>

            <div class="flex items-center">
                <span class="text-lg font-bold mr-1">{{ currentStake }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>

        <div
            class="col-span-1 bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg p-4 flex flex-col text-sm"
        >
            <span>Max stake</span>

            <div class="flex items-center">
                <span class="text-lg font-bold mr-1">{{ stakeLimitTotal }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';

    const props = defineProps<{
        currentStake: number;
        maxStake: number;
    }>();

    const stakingPercentage = computed(() => {
        return (props.currentStake / props.maxStake) * 100;
    });
</script>

<style scoped></style>
