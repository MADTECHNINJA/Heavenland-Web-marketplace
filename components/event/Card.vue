<template>
    <NuxtLink :to="`events/${event.data.id}`">
        <div class="flex flex-col">
            <div
                class="flex hover:brightness-125 cursor-pointer bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg py-3.5 px-6 items-center relative"
            >
                <div v-if="event.typeTag" class="flex gap-1 absolute top-2 right-2 z-[2] text-gray-200">
                    <AppTooltip wrap :text="event.typeTag.tooltip">
                        <EventBadge :tag="event.typeTag" />
                    </AppTooltip>
                </div>

                <div class="flex flex-col w-full">
                    <p class="font-bold tracking-tight">{{ event.name }}</p>

                    <div class="flex flex-col mt-4">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <p class="text-sm tracking-tight text-gray-400">Entry fee</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200 flex items-center">
                                    <img
                                        v-if="event.data.parameters.currency === 'HTO'"
                                        :src="htoCurrency"
                                        alt="HTO"
                                        class="h-4 rounded-full mr-1"
                                    />
                                    {{ event.data.parameters.entryFee }}
                                </p>
                            </div>

                            <div class="flex flex-col items-center text-center text-sm tracking-tight">
                                <p class="text-gray-400">Reward pool</p>
                                <p class="mt-1 font-semibold text-gray-200 flex items-center">
                                    <img :src="htoCurrency" alt="HTO" class="h-4 rounded-full mr-1" />
                                    {{ formatNumberToDecimal(event.data.parameters.rewardPool) }}
                                </p>
                            </div>

                            <div class="flex flex-col items-end">
                                <p class="text-sm tracking-tight text-gray-400">Players</p>

                                <div class="flex items-center space-x-1.5 mt-0.5">
                                    <div class="flex flex-col rounded-md py-1 mt-0.5 px-0.5 items-center w-[40px]">
                                        <div class="flex items-center space-x-2 w-full">
                                            <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                                <div
                                                    class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                                    :class="[
                                                        event.data.players.length ===
                                                        event.data.settings.numberOfPlayers
                                                            ? 'from-indigo-700 to-[#b24cb6]'
                                                            : 'from-indigo-700 to-[#b24cb6]',
                                                    ]"
                                                    :style="{
                                                        width:
                                                            (event.data.players.length * 100) /
                                                                event.data.settings.numberOfPlayers +
                                                            '%',
                                                    }"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p class="text-sm font-semibold tracking-tight text-gray-200 flex">
                                        {{ event.data.players.length }} / {{ event.data.settings.numberOfPlayers }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between w-full mt-5 relative">
                            <div class="flex flex-col" :class="{ 'opacity-5': now > event.data.parameters.startsAt }">
                                <p class="text-sm tracking-tight text-gray-400">1. Registration</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200">
                                    {{ formatDateWithTime(event.data.parameters.registrationStartsAt, true) }}
                                </p>
                            </div>

                            <div
                                class="flex flex-col items-center"
                                :class="{ 'opacity-5': now > event.data.parameters.startsAt }"
                            >
                                <p class="text-sm tracking-tight text-gray-400">2. Lock</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200">
                                    {{ formatDateWithTime(event.data.parameters.registrationEndsAt, true) }}
                                </p>
                            </div>

                            <div
                                class="flex flex-col items-end"
                                :class="{ 'opacity-5': now > event.data.parameters.startsAt }"
                            >
                                <p class="text-sm tracking-tight text-gray-400">3. Event start</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200">
                                    {{ formatDateWithTime(event.data.parameters.startsAt, true) }}
                                </p>
                            </div>

                            <div
                                v-if="event.data.results"
                                class="flex flex-col absolute left-1/2 top-2/3 -translate-y-1/2 -translate-x-1/2"
                            >
                                <p
                                    class="mt-0.5 text-md font-semibold tracking-tight bg-gradient-to-r from-indigo-300 to-[#7942c1] text-transparent bg-clip-text"
                                >
                                    Event is finished
                                </p>
                            </div>

                            <div
                                v-else-if="now > event.data.parameters.startsAt"
                                class="flex flex-col absolute left-1/2 top-2/3 -translate-y-1/2 -translate-x-1/2"
                            >
                                <p
                                    class="mt-0.5 text-md font-semibold tracking-tight bg-gradient-to-r from-indigo-300 to-[#7942c1] text-transparent bg-clip-text"
                                >
                                    Event in progress
                                </p>
                            </div>
                        </div>

                        <div
                            class="grid grid-cols-2 gap-3 w-full mt-3"
                            :class="{ 'opacity-5': now > event.data.parameters.startsAt }"
                        >
                            <div class="flex flex-col rounded-md py-1 px-0.5 w-full items-center">
                                <div class="flex items-center space-x-2 w-full">
                                    <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                        <div
                                            class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                            :class="[
                                                registrationTimeLeftPercentage > 100
                                                    ? 'from-indigo-700 to-[#7942c1]'
                                                    : 'from-indigo-700 to-[#7942c1]',
                                            ]"
                                            :style="{
                                                width: registrationTimeLeftPercentage + '%',
                                            }"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col rounded-md py-1 px-0.5 w-full items-center">
                                <div class="flex items-center space-x-2 w-full">
                                    <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                        <div
                                            class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                            :class="[
                                                startTimeLeftPercentage > 100
                                                    ? 'to-indigo-[#6c40c3] from-[#7942c1]'
                                                    : 'to-indigo-[#6c40c3] from-[#7942c1]',
                                            ]"
                                            :style="{
                                                width:
                                                    (registrationTimeLeftPercentage > 100
                                                        ? startTimeLeftPercentage
                                                        : 0) + '%',
                                            }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
    import { EventTags, EventTag, GamingEvent } from '~/types/Event.types';
    import { formatDateWithTime, formatNumberToDecimal } from '~/js/formatting';
    import htoCurrency from '@/assets/currency/hto.png';
    import { Betting } from '~/types/Betting.types';

    const props = defineProps<{
        event: GamingEvent;
        betting?: Betting;
    }>();

    const now = ref(Math.floor(Date.now() / 1000));

    setInterval(() => {
        now.value = Math.floor(Date.now() / 1000);
    }, 10000);

    const getTag = (id: string) => {
        return EventTags[id];
    };

    const registrationTimeLeftPercentage = computed(() => {
        return (
            100 -
            ((props.event.data.parameters.registrationEndsAt - now.value) * 100) /
                (props.event.data.parameters.registrationEndsAt - props.event.data.parameters.registrationStartsAt)
        );
    });

    const startTimeLeftPercentage = computed(() => {
        return (
            100 -
            ((props.event.data.parameters.startsAt - now.value) * 100) /
                (props.event.data.parameters.startsAt - props.event.data.parameters.registrationEndsAt)
        );
    });
</script>

<style scoped></style>
