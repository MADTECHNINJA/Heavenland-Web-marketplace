<template>
    <div
        v-if="!event.fetched"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6 animate-pulse"
    >
        <div class="h-[95px]">
            <div class="p-5 mt-2 flex flex-col items-center">
                <div class="w-[125px] h-2 rounded-full animate-pulse"></div>
                <div class="mt-4 w-[75px] h-1.5 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>

    <div
        v-else-if="event.data && event.data?.getResults()"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 pl-6 pr-9"
    >
        <h1 class="font-bold text-md tracking-tight">Results</h1>

        <div class="grid grid-cols-12 gap-x-3 mt-4">
            <p class="text-sm col-span-1 tracking-tight text-gray-400 font-semibold">#</p>
            <p class="text-sm col-span-6 tracking-tight text-gray-400 font-semibold">Player</p>
            <p class="text-sm col-span-3 tracking-tight text-gray-400 font-semibold text-center">Time</p>
        </div>

        <div class="h-1 border-b border-gray-400 border-opacity-10 mt-1" />

        <div class="flex flex-col space-y-2.5 mt-2">
            <div
                v-for="player in event.data?.getResults()"
                :key="player.position"
                class="grid grid-cols-12 rounded-full relative gap-x-3"
            >
                <div
                    class="col-span-1 h-5 w-5 shadow flex justify-center items-center rounded-md"
                    :class="[
                        {
                            '!text-amber-500': player.position === 1,
                        },
                        {
                            '!text-slate-400': player.position === 2,
                        },
                        {
                            '!text-amber-700': player.position === 3,
                        },
                    ]"
                >
                    <FontAwesomeIcon v-if="[1, 2, 3].includes(player.position)" icon="trophy" class="h-3.5 w-3.5" />
                </div>

                <div class="text-xs flex items-center space-x-2 col-span-6 mt-0.5">
                    <div class="bg-indigo-900/20 h-4 w-4 rounded-full flex justify-center items-center relative">
                        <img
                            v-if="getPlayerParagonTier(getPlayerDetails(player.playerId).paragonAddress) !== undefined"
                            :src="
                                getParagonTierImage(
                                    getPlayerParagonTier(getPlayerDetails(player.playerId).paragonAddress)?.tier
                                )
                            "
                            class="rounded-full"
                        />
                    </div>
                    <span>{{ getPlayerDetails(player.playerId).nickname }}</span>
                </div>
                <p class="text-xs col-span-3 mt-0.5 text-center">{{ player.time }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { GamingEvent } from '~/types/Event.types';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { Paragons } from '~/types/collections/Paragons.types';
    import { getParagonTierImage } from '~/types/Paragon.utils';
    import { formatDateWithTime } from '../../js/formatting';

    const props = defineProps<{
        event: DataWrapper<GamingEvent | null>;
        playerParagons: DataWrapper<Paragons[]>;
    }>();

    const getPlayerParagonTier = (mint: string) => {
        return props.playerParagons.data?.find((p) => {
            return p.mint === mint;
        });
    };

    const getPlayerDetails = (playerId: string) => {
        return props.event.data?.data?.players?.find((p) => p.id === playerId);
    };
</script>

<style scoped></style>
