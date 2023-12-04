<template>
    <div
        v-if="betting.data"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6"
    >
        <div class="flex items-center space-x-6">
            <h1 class="font-bold text-md tracking-tight">Bet statistics</h1>
        </div>

        <div v-for="b in betting.data.data.bets" :key="b.optionId" class="mt-5 grid grid-cols-6">
            <div class="text-sm flex items-center space-x-2 col-span-3">
                <div class="bg-indigo-900/20 h-5 w-5 rounded-full flex justify-center items-center relative">
                    <img
                        v-if="getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId)) !== undefined"
                        :src="getParagonTierImage(getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId))?.tier)"
                        class="rounded-full"
                        :style="{
                            height:
                                getPlayerParagonTier(event.data?.getPlayerParagon(b.optionId))?.tier === '2'
                                    ? '95%'
                                    : '105%',
                        }"
                    />
                </div>

                <span class="col-span-3 tracking-tight text-gray-300">
                    {{ event.data.getPlayerNickname(b.optionId) }}
                </span>
            </div>

            <div class="flex items-center justify-center space-x-1 col-span-1">
                <p class="text-xs text-center font-semibold">{{ b.amount }}</p>
                <img :src="htoCurrency" alt="HTO" class="h-3 rounded-full ml-2" />
            </div>

            <div class="flex items-center space-x-1.5 col-span-2">
                <div class="flex flex-col rounded-md py-1 mt-0.5 px-0.5 w-full items-center w-[100px]">
                    <div class="flex items-center space-x-2 w-full">
                        <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                            <div
                                class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                :style="{
                                    width: ((b.amount / betting.data?.betSum) * 100).toFixed(2) + '%',
                                }"
                            />
                        </div>
                    </div>
                </div>
                <p class="text-xs font-semibold tracking-tight text-gray-200 flex items-center">
                    {{ ((b.amount / betting?.data?.betSum) * 100).toFixed(2) }} %
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Betting } from '~/types/Betting.types';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { GamingEvent } from '~/types/Event.types';
    import { Paragons } from '~/types/collections/Paragons.types';
    import htoCurrency from '@/assets/currency/hto.png';
    import { getParagonTierImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        betting: DataWrapper<Betting>;
        event: DataWrapper<GamingEvent>;
        playerParagons: DataWrapper<Paragons[]>;
    }>();

    const getPlayerParagonTier = (mint: string) => {
        return props.playerParagons.data?.find((p) => p.mint === mint);
    };
</script>

<style scoped></style>
