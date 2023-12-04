<template>
    <div class="flex items-center space-x-3">
        <AppTooltip>
            <template #text>
                <div class="flex items-center space-x-2">{{ e.currentStage[1].tooltip }}</div>
            </template>

            <div class="flex space-y-1 flex-col">
                <div
                    :class="[badgeColor]"
                    class="flex items-center font-medium rounded-md justify-center h-[24px] px-2 bg-gradient-to-r text-xs"
                >
                    {{ e.currentStage[0] }}
                </div>

                <div class="flex items-center space-x-0.5">
                    <div v-for="i in 5" :key="i" class="w-full bg-white/10 grow h-1.5 rounded-full overflow-clip">
                        <div
                            :class="i * 20 <= indicatorProgress && indicatorColor"
                            class="transition-all bg-gradient-to-r h-1.5 rounded-full w-100"
                        />
                    </div>
                </div>
            </div>
        </AppTooltip>

        <div v-if="nextStageTimer() !== null" class="flex items-center text-xs space-x-1 mb-1.5">
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
        </div>

        <div v-else-if="e.isFinished" class="flex items-center text-xs space-x-1 mb-1.5">
            <span>Finished</span>
        </div>

        <div v-else-if="e.hasStarted" class="flex items-center text-xs space-x-1 mb-1.5">
            <span>Started</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { GamingEvent } from '~/types/Event.types';
    import { computed, ref } from 'vue';
    import VueCountdown from '@chenfengyuan/vue-countdown';

    const props = defineProps<{
        e: GamingEvent;
    }>();

    const nextStageTimer = () => {
        if (props.e.isFinished || props.e.hasStarted) {
            return null;
        } else if (props.e.isRegistrationFinished) {
            return props.e.data.parameters.startsAt;
        } else if (props.e.isRegistrationStarted) {
            return props.e.data.parameters.registrationEndsAt;
        } else {
            return props.e.data.parameters.registrationStartsAt;
        }
    };

    const nextStageTimeout = (nextStageTimer() ?? 0) * 1000 - Date.now();

    const badgeColor = computed(() => {
        if (props.e.isFinished) {
            return 'from-green-500/60 to-green-800';
        } else {
            return 'from-violet-900/50 via-violet-900/60 to-violet-900/70';
        }
    });

    const indicatorColor = computed(() => {
        if (props.e.isFinished) {
            return 'from-green-500/70 to-green-900';
        } else {
            return 'from-violet-700/70 to-violet-700/90';
        }
    });

    const indicatorProgress = computed(() => {
        if (props.e.isFinished) {
            return '100';
        } else if (props.e.hasStarted) {
            return '80';
        } else if (props.e.isRegistrationFinished) {
            return '60';
        } else if (props.e.isRegistrationStarted) {
            return '40';
        } else {
            return '20';
        }
    });
</script>

<style scoped></style>
