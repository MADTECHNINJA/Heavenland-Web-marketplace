<template>
    <div class="bg-indigo-920 flex-col text-white text-xs justify-center flex items-center px-3 py-3">
        <AppAlert v-if="error" :type="AlertType.ERROR" :text="ErrorMsg.FETCHING_ERROR" />

        <AppSpinner v-else-if="!fetched" />

        <div class="flex flex-col items-center" v-else>
            <AppTooltip :disabled="!isFinished">
                <template #text>
                    <div class="flex items-center space-x-2">
                        <FontAwesomeIcon icon="circle-check" class="text-green-500" />
                        <p>NFT staking finished</p>
                    </div>
                </template>

                <div class="w-[150px] flex items-center justify-center">
                    <FontAwesomeIcon v-if="!isFinished" :icon="['fad', 'coin-vertical']" />
                    <FontAwesomeIcon v-else icon="circle-check" class="text-green-500" />
                    <div class="w-[50px] bg-indigo-900 h-1.5 rounded-full mx-2 overflow-clip">
                        <div
                            class="bg-gradient-to-r h-1.5 rounded-full"
                            :class="[isFinished ? 'from-green-900 to-green-700' : 'from-indigo-700 to-[#b24cb6]']"
                            :style="{ width: stakingPercentage + '%' }"
                        ></div>
                    </div>
                    <span class="font-semibold text-xs">{{ stakingPercentage.toFixed(2) }}%</span>

                    <AppTooltip v-if="hasNftStakeFinished && !isFinished">
                        <template #text>
                            <div class="flex items-center space-x-2">
                                <p>This NFT has {{ finishedStakesCount }} stakings finished</p>
                            </div>
                        </template>

                        <FontAwesomeIcon icon="circle-check" class="text-green-500 ml-2" />
                    </AppTooltip>
                </div>
            </AppTooltip>
            <div class="flex justify-center mt-3">
                <span class="text-gray-300">Staked</span>
                <span class="font-bold ml-2 mr-1"
                    >{{ formatNumberToDecimal(currentStake) }} / {{ formatNumberToDecimal(maxStake) }}</span
                >
                <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
            </div>
        </div>
    </div>
    <div
        class="flex-col bg-gradient-to-r from-indigo-700 to-indigo-920 rounded-b-lg text-white text-xs justify-center flex items-center px-3 mb-1 py-2"
    >
        <div class="flex justify-start">
            <span class="text-gray-200 font-semibold">Estimated reward</span>
            <span class="font-bold ml-2 mr-1">{{ formatNumberToDecimal(reward) }}</span>
            <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { ErrorMsg } from '~/locales/core';
    import { computed } from 'vue';
    import { AlertType } from '~/types/Alert.utils';

    const props = defineProps<{
        error: boolean;
        fetched: boolean;
        reward: number;
        currentStake: number;
        maxStake: number;
        stakings: {
            amount: number;
            tier: number;
            stakedTime: number;
            endTime: number;
            claimedTime: number;
            index: number;
            earned: number;
        }[];
    }>();

    const hasNftStakeFinished = computed(() => finishedStakesCount.value > 0);

    const stakingPercentage = computed(() => {
        return (props.currentStake / props.maxStake) * 100;
    });

    const allStakesCount = computed(() => {
        return props.stakings.length;
    });

    const now = Math.floor(Date.now() / 1000);

    const finishedStakesCount = computed(() => {
        return props.stakings.filter((s) => s.endTime <= now).length;
    });

    const isFinished = computed(() => {
        return finishedStakesCount.value >= allStakesCount.value;
    });
</script>

<style scoped></style>
