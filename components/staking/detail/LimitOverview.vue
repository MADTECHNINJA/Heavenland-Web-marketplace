<template>
    <section class="rounded-lg w-full grid grid-cols-3 gap-3">
        <div class="bg-gradient-to-r from-indigo-800 to-indigo-920 col-span-1 rounded-lg p-4 flex flex-col text-sm">
            <span>Stake available</span>

            <div class="flex items-center justify-center md:justify-start mt-1">
                <span class="font-bold mr-1">{{ formatNumberToDecimal(available) }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>

        <div class="col-span-1 bg-indigo-930 rounded-lg p-4 flex flex-col text-sm">
            <span>Current stake</span>

            <div class="flex items-center justify-center md:justify-start mt-1">
                <span class="font-bold mr-1">{{ formatNumberToDecimal(current) }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>

        <div class="col-span-1 bg-indigo-930 rounded-lg p-4 flex flex-col text-sm">
            <span>Max stake</span>

            <div class="flex items-center justify-center md:justify-start mt-1">
                <span class="font-bold mr-1">{{ formatNumberToDecimal(max) }}</span>
                <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { computed } from 'vue';

    const props = defineProps<{
        current: number;
        max: number;
    }>();

    const available = computed(() => {
        return props.max - props.current;
    });
</script>

<style scoped></style>
