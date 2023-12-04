<template>
    <NuxtLink :to="`betting/${betting.data.id}`">
        <div class="flex flex-col">
            <div
                class="flex hover:brightness-125 cursor-pointer bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg py-3.5 px-4 items-center relative"
            >
                <div class="flex flex-col w-full">
                    <div class="flex items-center space-x-2 text-gray-200">
                        <div
                            class="flex space-x-1.5 px-2 items-center justify-center text-xs relative font-medium bg-gradient-to-r from-violet-900/50 via-violet-900/60 to-violet-900/70 rounded-md h-[24px]"
                        >
                            <FontAwesomeIcon icon="headset" class="h-2.5 w-2.5" />
                            <span>Gaming</span>
                        </div>
                        <p class="text-sm text-gray-400 tracking-tight">Speed spinner</p>
                    </div>

                    <div class="flex space-x-2 mt-3">
                        <p class="font-semibold ext-sm tracking-tight">{{ betting.data.info.description }}</p>
                    </div>

                    <div class="flex flex-col mt-4">
                        <div class="flex justify-between w-full">
                            <div class="flex flex-col">
                                <p class="text-sm tracking-tight text-gray-400">Bet type</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200 flex items-center">
                                    {{ capitalize(betting.data.parameters.type) }}
                                </p>
                            </div>

                            <div class="flex flex-col items-center">
                                <p class="text-sm tracking-tight text-gray-400">Bet amount</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200 flex items-center">
                                    {{ formatNumberToDecimal(betting.data.parameters.minBid) }}
                                    <img
                                        v-if="betting.data.parameters.bidCurrency === 'HTO'"
                                        :src="htoCurrency"
                                        alt="HTO"
                                        class="h-4 rounded-full ml-1"
                                    />
                                </p>
                            </div>

                            <div class="flex flex-col items-end">
                                <p class="text-sm tracking-tight text-gray-400">Bet deadline</p>
                                <p class="mt-1 text-sm font-semibold tracking-tight text-gray-200 flex items-center">
                                    {{ formatDateWithTime(betting.data.parameters.startsAt, true) }}
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-3 w-full mt-3.5">
                            <div class="flex space-x-2 rounded-md py-1 px-0.5 w-full items-center">
                                <FontAwesomeIcon icon="timer" class="h-2.5 w-2.5" />
                                <div class="flex items-center space-x-2 w-full">
                                    <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                        <div
                                            class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                            :style="{
                                                width: '25%',
                                            }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--                    <div class="flex justify-between w-full relative">
                        <div
                            v-if="betting.data.results"
                            class="flex flex-col absolute left-1/2 bottom-1/2 -translate-x-1/2"
                        >
                            <p
                                class="mt-0.5 text-md font-semibold tracking-tight bg-gradient-to-r from-indigo-300 to-[#7942c1] text-transparent bg-clip-text"
                            >
                                Event is finished
                            </p>
                        </div>

                        <div
                            v-else-if="now > betting.data.parameters.startsAt"
                            class="flex flex-col absolute left-1/2 bottom-1/2 -translate-x-1/2"
                        >
                            <p
                                class="mt-0.5 text-md font-semibold tracking-tight bg-gradient-to-r from-indigo-300 to-[#7942c1] text-transparent bg-clip-text"
                            >
                                Event in progress
                            </p>
                        </div>
                    </div>-->
                    </div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { capitalize, formatDateWithTime, formatNumberToDecimal } from '~/js/formatting';
    import htoCurrency from '@/assets/currency/hto.png';
    import { Betting } from '~/types/Betting.types';

    const now = ref(Math.floor(Date.now() / 1000));

    setInterval(() => {
        now.value = Math.floor(Date.now() / 1000);
    }, 10000);

    const props = defineProps<{
        betting?: Betting;
    }>();

    const registrationTimeLeftPercentage = computed(() => {
        return (
            100 -
            ((props.betting?.data.parameters.endsAt - now.value) * 100) /
                (props.betting?.data.parameters.endsAt - props.betting?.data.parameters.startsAt)
        );
    });
</script>

<style scoped></style>
