<template>
    <div
        class="flex relative w-full md:max-w-md md:flex-row overflow-hidden flex-col grid-cols-3 md:px-0 bg-gradient-to-r from-indigo-920 to-indigo-930 rounded-lg"
    >
        <div class="flex flex-col w-full col-span-2 px-6 md:pr-3 py-3">
            <div class="text-sm w-full md:relative left-4 md:left-auto flex md:justify-between font-semibold">
                Staked

                <div
                    class="flex text-md left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 absolute md:relative items-center"
                >
                    <span class="font-bold ml-2 mr-1">{{ formatNumberToDecimal(stakeRecord.amount) }}</span>
                    <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
                </div>
            </div>

            <div class="flex flex-col justify-between mt-6 md:mt-4 space-y-3 md:space-y-1">
                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>Start</span>

                    <span class="md:ml-2 mt-1 md:mt-0 font-semibold">{{ formatDateWithTime(stakeRecord.start) }}</span>
                </div>

                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>End</span>

                    <span class="md:ml-2 mt-1 md:mt-0 font-semibold">{{ formatDateWithTime(stakeRecord.end) }}</span>
                </div>

                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>Last claim</span>

                    <span
                        v-if="stakeRecord.start === stakeRecord.lastClaimed"
                        class="md:ml-2 mt-1 md:mt-0 font-semibold"
                        >--</span
                    >
                    <span v-else class="md:ml-2 mt-1 md:mt-0 font-semibold">{{
                        formatDateWithTime(stakeRecord.lastClaimed)
                    }}</span>
                </div>
            </div>
        </div>

        <div
            class="col-span-1 w-full flex-row md:flex-col text-white justify-center flex items-center px-6 md:pl-0 md:pr-6 py-2 md:py-4"
        >
            <img
                :src="htoCoin"
                alt="HTO Coin"
                class="absolute bottom-0 object-contain h-full -top-3 right-0 opacity-[0.15]"
            />
            <div class="absolute top-2.5 md:top-3 right-4 w-full md:w-auto flex flex-col md:justify-between md:h-full">
                <p class="text-gray-400 text-sm tracking-tight text-right font-semibold">Preview</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import htoCoin from '@/assets/hto-coin.png';
    import { formatDateWithTime } from '~/js/formatting';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { computed } from 'vue';

    const props = defineProps<{
        stakeRecord: {
            amount: number;
            start: number;
            end: number;
            lastClaimed: number;
        };
    }>();

    const timerStakeFinished = computed(() => {
        const now = Math.floor(Date.now());

        const stakeTimeNow = props.stakeRecord.end - now;
        const stakeTime = props.stakeRecord.end - props.stakeRecord.start;
        const stakeTimeFinished = stakeTimeNow / stakeTime;

        return now > props.stakeRecord.end ? 100 : (1 - stakeTimeFinished) * 100;
    });
</script>

<style scoped></style>
