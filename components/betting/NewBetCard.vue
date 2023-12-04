<template>
    <div
        v-if="betting.data && event.data"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6"
    >
        <h1 class="font-bold text-md tracking-tight">New bet</h1>

        <nav aria-label="Progress" class="mt-4">
            <ol role="list" class="overflow-hidden">
                <li class="relative">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <span
                            class="relative top-1.5 z-10 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300"
                        />

                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm text-gray-300">{{ betting.data.data.info.description }}</span>

                            <div class="mt-3 mb-9 grid grid-cols-3 w-full gap-2">
                                <div v-for="b in betting.data.data.bets" :key="b.optionId">
                                    <div
                                        @click="selectBetOption(b.optionId)"
                                        class="text-xs cursor-pointer flex items-center space-x-2 bg-black/10 border border-gray-400 border-opacity-20 rounded-full px-3 py-1.5"
                                        :class="{
                                            'border-indigo-500 border-opacity-100': selectedBetOption === b.optionId,
                                        }"
                                    >
                                        <div
                                            class="bg-indigo-900/20 h-4 w-4 rounded-full flex justify-center items-center relative"
                                        >
                                            <img
                                                v-if="
                                                    getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId)) !==
                                                    undefined
                                                "
                                                :src="
                                                    getParagonTierImage(
                                                        getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId))
                                                            ?.tier
                                                    )
                                                "
                                                class="rounded-full"
                                                :style="{
                                                    height:
                                                        getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId))
                                                            ?.tier === '2'
                                                            ? '95%'
                                                            : '105%',
                                                }"
                                            />
                                        </div>

                                        <span class="col-span-3">{{ event.data?.getPlayerNickname(b.optionId) }}</span>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </a>
                </li>

                <li class="relative">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <span
                            class="relative top-1.5 z-10 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300"
                        />
                        <span class="ml-4 flex min-w-0 flex-col">
                            <p class="text-sm text-gray-300">
                                <span>Select bet amount</span>
                            </p>
                            <div
                                class="w-full min-w-[350px] mt-3 mb-9 bg-black/10 border border-gray-400 border-opacity-20 rounded-md px-3 py-1.5"
                            >
                                <AppSlider
                                    range
                                    v-model="betAmount"
                                    :min="betting.data.data.parameters.minBid"
                                    :max="betting.data.data.parameters.maxBid"
                                    :step="100"
                                >
                                    <template #min="{ min }">
                                        <div class="flex items-center">
                                            <span>{{ formatNumberToDecimal(min) }}</span>
                                            <img :src="htoCurrency" alt="HTO" class="h-3 rounded-full ml-1" />
                                        </div>
                                    </template>

                                    <template #max="{ max }">
                                        <div class="flex items-center">
                                            <span>{{ formatNumberToDecimal(max) }}</span>
                                            <img :src="htoCurrency" alt="HTO" class="h-3.5 rounded-full ml-1" />
                                        </div>
                                    </template>

                                    <template #value="{ value }">
                                        <div class="flex items-center">
                                            <span>{{ formatNumberToDecimal(value) }}</span>
                                            <img :src="htoCurrency" alt="HTO" class="h-3 rounded-full ml-1" />
                                        </div>
                                    </template>
                                </AppSlider>
                            </div>
                        </span>
                    </a>
                </li>

                <li class="pb-2">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <span
                            class="relative top-1.5 z-10 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300"
                        />
                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm text-gray-300">Confirm your bet</span>

                            <div class="mt-3">
                                <AppButton small>Bet...</AppButton>
                            </div>
                        </span>
                    </a>
                </li>
            </ol>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { Betting } from '~/types/Betting.types';
    import htoCurrency from '@/assets/currency/hto.png';
    import { GamingEvent } from '~/types/Event.types';
    import { formatDateWithTime, formatNumberToDecimal } from '~/js/formatting';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { Paragons } from '~/types/collections/Paragons.types';
    import { getParagonTierImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        event: DataWrapper<GamingEvent | null>;
        betting: DataWrapper<Betting | null>;
        playerParagons: DataWrapper<Paragons[]>;
    }>();

    const betAmount = ref(100);
    const selectedBetOption = ref('');

    const getPlayerParagonTier = (mint: string) => {
        return props.playerParagons.data?.find((p) => p.mint === mint);
    };

    const selectBetOption = (optionId: string) => {
        selectedBetOption.value = optionId;
    };
</script>

<style scoped></style>
