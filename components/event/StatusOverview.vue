<template>
    <div
        v-if="!e.fetched"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6 animate-pulse"
    >
        <div class="h-[165px]">
            <div class="p-5 mt-2 flex flex-col items-center">
                <div class="w-[125px] h-2 rounded-full animate-pulse"></div>
                <div class="mt-4 w-[75px] h-1.5 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>

    <div
        v-else-if="e.data"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6"
    >
        <h1 class="font-bold text-md tracking-tight">Event stage</h1>

        <div class="flex md:flex-row flex-col mt-3 space-x-6">
            <div class="flex justify-center md:justify-start items-center gap-x-1.5">
                <div class="flex flex-col" v-for="(_, name, index) in EventStages" :key="name">
                    <AppTooltip>
                        <template #text> {{ EventStages[name].tooltip }}</template>

                        <div
                            class="font-semibold text-sm bg-gradient-to-r rounded-md flex justify-center items-center select-none"
                            :class="[
                                name === e.data?.currentStage[0] ? 'opacity-100' : 'opacity-50',
                                name === e.data?.currentStage[0] ? 'w-12 h-12' : 'w-8 h-8',
                                name === EventStage.FINISHED
                                    ? 'from-green-500/60 to-green-800'
                                    : 'from-violet-900/50 via-violet-900/60 to-violet-900/70',
                            ]"
                        >
                            {{ name }}
                        </div>

                        <div class="flex items-center justify-center space-x-0.5 mt-1">
                            <div
                                v-for="i in 5"
                                :key="i"
                                class="bg-white/10 h-1.5 rounded-full overflow-clip"
                                :class="[name === e.data?.currentStage[0] ? 'w-1.5 opacity-100' : 'w-1 opacity-50']"
                            >
                                <div
                                    :class="[
                                        i <= index + 1 ? 'opacity-100' : 'opacity-5',

                                        name === EventStage.FINISHED
                                            ? 'from-green-500/60 to-green-800'
                                            : 'from-violet-900 to-violet-900',
                                    ]"
                                    class="transition-all bg-gradient-to-r h-1.5 rounded-full"
                                />
                            </div>
                        </div>
                    </AppTooltip>
                </div>
            </div>

            <div class="flex flex-col md:mt-1 mt-6">
                <p class="text-sm text-gray-400 text-center tracking-normal md:text-start">Current stage</p>
                <p
                    class="mt-1 text-sm justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
                >
                    {{ e.data?.currentStage[1].tooltip }}
                </p>
            </div>
        </div>

        <div
            v-if="nextStageTimer !== null"
            class="text-sm flex md:flex-row md:space-y-0 space-y-1.5 flex-col mt-6 border border-gray-100/10 rounded-lg px-6 py-3 justify-center md:justify-start font-semibold tracking-tight text-gray-200 flex items-center"
        >
            <span class="mr-1.5 font-normal text-gray-400">{{ nextStageTitle }}</span>

            <VueCountdown
                :time="nextStageTimeout"
                v-slot="{ days, hours, minutes, seconds }"
                :now="() => Date.now() / 1000"
                tag="div"
            >
                <span class="inline-block w-[20px] text-center">{{ days > 9 ? days : '0' + days }}</span
                >:<span class="inline-block w-[20px] text-center">{{ hours > 9 ? hours : '0' + hours }}</span
                >:<span class="inline-block w-[20px] text-center">{{ minutes > 9 ? minutes : '0' + minutes }}</span
                >:<span class="inline-block w-[20px] text-center">{{ seconds > 9 ? seconds : '0' + seconds }}</span>
            </VueCountdown>

            <span class="ml-1.5 font-normal text-gray-400">({{ formatDateWithTime(nextStageTimer, true) }})</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { computed } from 'vue';
    import { EventStage, EventStages, GamingEvent } from '~/types/Event.types';
    import VueCountdown from '@chenfengyuan/vue-countdown';
    import { formatDateWithTime } from '~/js/formatting';

    const props = defineProps<{
        e: DataWrapper<GamingEvent | null>;
    }>();

    const nextStageTitle = computed(() => {
        switch (props.e.data?.currentStage[0]) {
            case EventStage.CREATED:
                return 'Registration starts in';

            case EventStage.REGISTRATION:
                return 'Registration closes in';

            case EventStage.LOCKED:
                return 'Event starts in';

            default:
                return null;
        }
    });

    const nextStageTimer = computed(() => {
        if (props.e.data === null) {
            return null;
        }

        if (props.e.data.isFinished || props.e.data.hasStarted) {
            return null;
        } else if (props.e.data.isRegistrationFinished) {
            return props.e.data.data.parameters.startsAt;
        } else if (props.e.data.isRegistrationStarted) {
            return props.e.data.data.parameters.registrationEndsAt;
        } else {
            return props.e.data.data.parameters.registrationStartsAt;
        }
    });

    const nextStageTimeout = computed(() => (!nextStageTimer.value ? 0 : nextStageTimer.value * 1000) - Date.now());
</script>

<style scoped></style>
