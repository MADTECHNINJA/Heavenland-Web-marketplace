<template>
    <div
        v-if="!event.fetched"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6 animate-pulse"
    >
        <div class="h-[110px]">
            <div class="p-5 mt-2 flex flex-col items-center">
                <div class="w-[125px] h-2 rounded-full animate-pulse"></div>
                <div class="mt-4 w-[75px] h-1.5 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>

    <div v-else class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg">
        <div
            class="w-full justify-center md:justify-start space-x-1.5 font-semibold items-center px-6 text-amber-500 bg-amber-600 bg-opacity-10 text-xs py-2.5 rounded-t-lg flex"
        >
            <FontAwesomeIcon :icon="['fad', 'hourglass-half']" class="cursor-not-allowed h-2.5 w-2.5" />

            <span>Manual registrations allowed only</span>
        </div>

        <div class="pt-4 pb-6 px-5">
            <div class="flex justify-center md:justify-start items-center space-x-6">
                <h1 class="font-bold text-md tracking-tight">Players</h1>

                <div class="flex space-x-6 items-center">
                    <div class="flex items-center space-x-1.5">
                        <div
                            class="flex justify-center md:justify-start flex-col rounded-md py-1 px-0.5 items-center w-[40px]"
                        >
                            <div class="flex justify-center md:justify-start flex-wrap items-center gap-2 w-full">
                                <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                    <div
                                        class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                        :class="[
                                            event.data.data.players.length === event.data.data.settings.numberOfPlayers
                                                ? 'from-indigo-700 to-[#b24cb6]'
                                                : 'from-indigo-700 to-[#b24cb6]',
                                        ]"
                                        :style="{
                                            width:
                                                (event.data.data.players.length * 100) /
                                                    event.data.data.settings.numberOfPlayers +
                                                '%',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                        <p class="text-sm font-semibold tracking-tight text-gray-200 flex items-center">
                            {{ event.data.data.players.length }} / {{ event.data.data.settings.numberOfPlayers }}
                        </p>
                    </div>
                </div>
            </div>

            <AppSpinner v-if="!playerParagons.fetched" class="mt-6 flex justify-center md:justify-start" size="5" />

            <div v-else-if="playerParagons.data" class="flex flex-col mt-6">
                <div class="flex justify-center md:justify-start flex-wrap gap-2">
                    <div
                        v-for="player in event.data.data.players"
                        :key="player.id"
                        class="bg-indigo-900/20 h-8 w-8 rounded-full flex justify-center items-center relative"
                    >
                        <AppTooltip :text="player.nickname">
                            <img
                                :src="getParagonTierImage(getPlayerParagonTier(player.paragonAddress)?.tier)"
                                class="rounded-full"
                                :style="{
                                    height: getPlayerParagonTier(player.paragonAddress)?.tier === '2' ? '95%' : '105%',
                                }"
                            />
                        </AppTooltip>
                    </div>

                    <div
                        v-for="i in event.data.data.settings.numberOfPlayers - event.data.data.players.length"
                        :key="i"
                        class="h-8 w-8 bg-indigo-900/20 rounded-full"
                    ></div>
                </div>
            </div>

            <!--          TODO  <p
                v-if="event.data.data.results || event.data.isRegistrationFinished"
                class="text-sm tracking-tight text-center md:text-justify text-gray-300 mt-6 leading-6"
            >
                The registration for this event has been terminated.
            </p>

            <div v-else>
                <p class="text-sm leading-6 tracking-tight text-center md:text-justify text-gray-300 mt-6">
                    This event still offers free seats. Book your seat to participate in this event.
                </p>

                <div class="flex space-x-1 text-sm tracking-tight text-center md:text-justify text-gray-300 mt-1">
                    <span>Entry fee for this event is set to</span>

                    <div class="flex items-center space-x-1">
                        <b>{{ event.data.data.parameters.entryFee }}</b>
                        <img
                            v-if="event.data.data.parameters.currency === 'HTO'"
                            :src="htoCurrency"
                            alt="HTO"
                            class="h-4 rounded-full mr-1"
                        />
                    </div>
                </div>
            </div>-->

            <!-- TODO <div v-if="!event.data.data.results && !event.data.isRegistrationFinished" class="mt-6">
                <AppButton disabled>Participate...</AppButton>
            </div>-->
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { GamingEvent } from '~/types/Event.types';
    import htoCurrency from '@/assets/currency/hto.png';
    import { getParagonTierImage } from '~/types/Paragon.utils';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { Paragons } from '~/types/collections/Paragons.types';

    const props = defineProps<{
        event: DataWrapper<GamingEvent | null>;
        playerParagons: DataWrapper<Paragons[]>;
    }>();

    const getPlayerParagonTier = (mint: string) => {
        return props.playerParagons.data?.find((p) => {
            return p.mint === mint;
        });
    };
</script>

<style scoped></style>
