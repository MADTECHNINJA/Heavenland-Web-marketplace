<template>
    <div
        v-if="!event.fetched"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6 animate-pulse"
    >
        <div class="h-[210px]">
            <div class="p-5 mt-2 flex flex-col items-center">
                <div class="w-[125px] h-2 rounded-full animate-pulse"></div>
                <div class="mt-4 w-[75px] h-1.5 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>

    <div
        v-else-if="event.data"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6"
    >
        <h1 class="font-bold text-md tracking-tight text-center md:text-start">Game overview</h1>

        <div class="grid grid-cols-3 mt-4 gap-x-3 gap-y-6">
            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400 text-center md:text-start">ID</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ event.data.data.id }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400 text-center md:text-start">Mini game</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start text-center md:text-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ event.data.data.title }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400">Number of players</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ event.data.data.settings.numberOfPlayers }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400">Map</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ event.data.data.settings.map }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400">Number of laps</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ event.data.data.settings.numberOfLaps }}
                </p>
            </div>

            <div class="flex flex-col">
                <p class="text-sm tracking-tight text-gray-400">Reward pool</p>
                <p
                    class="text-sm mt-1 justify-center md:justify-start space-x-1 font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    <span>{{ formatNumberToDecimal(event.data.data.parameters.rewardPool) }}</span>
                    <img
                        v-if="event.data.data.parameters.currency === 'HTO'"
                        :src="htoCurrency"
                        alt="HTO"
                        class="h-4 rounded-full mr-1"
                    />
                </p>
            </div>

            <div>
                <AppSecondaryButton icon="arrow-up-right-from-square" :external="event.data.data.policyLink">
                    Game policy
                </AppSecondaryButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { GamingEvent } from '~/types/Event.types';
    import { formatNumberToDecimal } from '~/js/formatting';
    import htoCurrency from '@/assets/currency/hto.png';
    import { DataWrapper } from '~/types/DataWrapper.types';

    defineProps<{
        event: DataWrapper<GamingEvent | null>;
    }>();
</script>

<style scoped></style>
