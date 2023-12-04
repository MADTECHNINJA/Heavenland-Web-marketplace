<template>
    <AppAlert small v-if="isLoyaltiesError" :text="ErrorMsg.FETCHING_ERROR" :type="AlertType.ERROR" />

    <div
        v-else-if="!isLoyaltiesFetched"
        class="flex w-full text-xs space-x-1 justify-center text-gray-300 rounded-lg bg-indigo-940 bg-opacity-30 py-3"
        :class="[miniCard ? 'px-3.5' : 'px-6']"
    >
        <AppSpinner :size="4" />
    </div>

    <div
        v-else-if="currentLoyaltyLevel"
        class="flex flex-col items-center w-full rounded-lg bg-indigo-940 bg-opacity-30 pb-3"
    >
        <AppCardTitle v-if="!miniCard" icon="sack-dollar" icon-set="fas" title="Cashback" class="w-full" />

        <div class="flex w-full items-center px-6 py-2 gap-x-2" :class="[miniCard ? 'px-3.5' : 'px-6']">
            <div class="grid grid-cols-11 h-1 w-full gap-x-1">
                <template v-for="loyaltyLevel in loyaltyLevels" :key="loyaltyLevel.cashback">
                    <div
                        v-if="loyaltyLevel.count > 0"
                        :class="[loyaltyLevel.cols]"
                        class="w-full relative bg-indigo-900 grow h-1.5 rounded-full overflow-clip"
                    >
                        <div
                            class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1.5 rounded-full"
                            :class="[loyaltyLevel.from, loyaltyLevel.to]"
                            :style="[
                                {
                                    width:
                                        calculateProgressBarWidth(loyaltyLevel.lowRange, loyaltyLevel.count) * 100 +
                                        '%',
                                },
                            ]"
                        />
                    </div>
                </template>
            </div>

            <p
                class="bg-clip-text text-xs text-transparent mt-0.5 font-semibold bg-gradient-to-r from-pink-400 to-violet-500"
            >
                {{ currentLoyaltyLevel.cashback * 100 }}%
            </p>
        </div>

        <div v-if="!miniCard" class="grid grid-cols-2 gap-x-1.5 mt-1 justify-between w-full px-6">
            <div
                class="flex bg-gradient-to-r from-indigo-700/60 to-indigo-900/60 rounded-lg px-3 py-2 flex-col items-center space-y-0.5"
                :class="nextLoyaltyLevel ? 'col-span-1' : 'col-span-2'"
            >
                <p class="text-xs text-gray-300 font-normal">Cashback</p>
                <p class="flex items-center font-bold text-white text-sm">
                    <span class="mr-1">{{ formatNumberToDecimal(currentLoyaltyLevel.cashback * amount * base) }}</span>
                    <img class="h-4" :src="htoCurrency" alt="Heavenland" />
                </p>
            </div>

            <div
                v-if="nextLoyaltyLevel"
                class="flex col-span-1 bg-gradient-to-r from-indigo-920/80 to-indigo-930/80 rounded-lg px-3 py-2 flex-col items-center space-y-0.5"
            >
                <p class="text-xs text-gray-400 font-normal">Next level</p>
                <p class="flex items-center font-bold text-gray-400 text-sm">
                    <span class="mr-1">{{ formatNumberToDecimal(nextLoyaltyLevel.cashback * amount * base) }}</span>
                    <img class="h-4" :src="htoCurrency" alt="Heavenland" />
                </p>
            </div>
        </div>

        <div class="w-full" :class="[miniCard ? 'px-3.5' : 'px-6']">
            <div class="text-xs text-gray-400 font-normal text-start" :class="[!miniCard && 'mt-3']">
                <p class="mb-1">
                    You own <span class="text-gray-300 font-semibold mx-0.5">{{ loyaltyCount }}</span> Loyalty NFTs.
                </p>
                <p v-if="nextLoyaltyLevel" :class="[miniCard ? 'mt-2 leading-5' : 'leading-5.5']">
                    Get
                    <span class="text-gray-300 font-semibold mx-0.5">
                        {{ nextLoyaltyLevel.count - loyaltyCount }}
                    </span>
                    more for
                    <span class="text-gray-300 font-semibold mx-0.5">{{ nextLoyaltyLevel.cashback * 100 }}%</span>
                    cashback.
                    <NuxtLink to="/collections/loyalties" target="_blank" class="hyperlink"> Buy now</NuxtLink>
                </p>
                <p v-else>
                    You'll receive maximum cashback of
                    <span class="text-gray-300 font-semibold mx-0.5">{{ currentLoyaltyLevel.cashback * 100 }}%</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { useAccountStore } from '~/store/account';
    import { computed } from 'vue';
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import { formatNumberToDecimal } from '~/js/formatting';

    withDefaults(
        defineProps<{
            amount?: number;
            base: number;
            miniCard?: boolean;
        }>(),
        {
            base: 1,
        }
    );

    const accountStore = useAccountStore();

    const isLoyaltiesFetched = computed(() => {
        return accountStore.tokens.loyalties.fetched;
    });

    const isLoyaltiesError = computed(() => {
        return accountStore.tokens.loyalties.error;
    });

    const loyaltyCount = computed(() => {
        if (!accountStore.tokens.loyalties.fetched || accountStore.tokens.loyalties.error) {
            return null;
        }

        return accountStore.tokens.loyalties.data?.length;
    });

    const loyaltyLevels = [
        { count: 0, cashback: 0, cols: 'col-span-0', lowRange: null, from: null, to: null },
        { count: 1, cashback: 0.05, cols: 'col-span-1', lowRange: 0, from: 'from-[#663dbe]', to: 'to-[#723fbc]' },
        { count: 3, cashback: 0.1, cols: 'col-span-1', lowRange: 1, from: 'from-[#7440ba]', to: 'to-[#7e41b5]' },
        { count: 5, cashback: 0.2, cols: 'col-span-2', lowRange: 3, from: 'from-[#7e41b4]', to: 'to-[#8d44b6]' },
        { count: 10, cashback: 0.3, cols: 'col-span-3', lowRange: 5, from: 'from-[#8e44b6]', to: 'to-[#9946b2]' },
        { count: 25, cashback: 0.5, cols: 'col-span-4', lowRange: 10, from: 'from-[#9a46b2]', to: 'to-[#a849b2]' },
    ];

    const currentLoyaltyLevel = computed(() => {
        for (let index = Object.keys(loyaltyLevels).length - 1; index >= 0; index--) {
            if (loyaltyCount.value >= loyaltyLevels[index].count) {
                return loyaltyLevels[index];
            }
        }

        return null;
    });

    const nextLoyaltyLevel = computed(() => {
        if (currentLoyaltyLevel.value === null) {
            return null;
        }

        const index = loyaltyLevels.findIndex((p) => p.cashback === currentLoyaltyLevel.value.cashback);

        return index <= loyaltyLevels.length - 1 ? loyaltyLevels[index + 1] : null;
    });

    const calculateProgressBarWidth = (lowLevel: number | null, count: number | null) => {
        const loyaltiesDiff = loyaltyCount.value - lowLevel < 0 ? 0 : loyaltyCount.value - lowLevel;
        const progressDiff = count - lowLevel;
        const progress = loyaltiesDiff / progressDiff;

        return progress > 1 ? 1 : progress < 0 ? 0 : progress;
    };
</script>

<style scoped></style>
