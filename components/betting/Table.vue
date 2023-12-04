<template>
    <table class="w-full bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg">
        <thead class="text-sm tracking-tight font-semibold">
            <tr>
                <td class="pl-6 pr-3 pt-3 pb-2">Betting</td>
                <td class="pl-3 pr-6 pb-3 pt-3">Event</td>
                <td class="pl-3 pr-6 pb-3 pt-3">Bid range</td>
                <td class="pl-3 pr-6 pb-3 pt-3">Total bet</td>
                <td class="pl-3 pr-6 pb-3 pt-3" colspan="2">Bet deadline</td>
            </tr>
        </thead>

        <tbody class="tracking-tight text-gray-300">
            <tr
                v-for="b in betting"
                :key="b.data.id"
                class="py-1 text-sm hover:bg-white/5 cursor-pointer hover:last-child:rounded-lg"
                @click="$router.push('/betting/' + b.data.id)"
            >
                <td class="pl-6 pr-3 pt-2 pb-3">{{ b.data.info.title }}</td>

                <td class="px-3 pt-2 pb-3">{{ b.data.gamingEvent.id }}</td>

                <td class="pl-3 pr-6 pt-2 pb-3">
                    <div class="flex items-center space-x-1">
                        <div class="flex items-center space-x-1">
                            <span>{{ formatNumberToDecimal(b.data.parameters.minBid) }}</span>
                            <img :src="htoCurrency" alt="HTO" class="h-4 rounded-full mr-1" />
                        </div>
                        <span>-</span>
                        <div class="flex items-center">
                            <span>{{ formatNumberToDecimal(b.data.parameters.maxBid) }}</span>
                            <img :src="htoCurrency" alt="HTO" class="h-4 rounded-full mr-1" />
                        </div>
                    </div>
                </td>

                <td class="px-3 pt-2 pb-3">
                    <div class="flex items-center space-x-1">
                        <span>{{ formatNumberToDecimal(1000) }}</span>
                        <img :src="htoCurrency" alt="HTO" class="h-4 rounded-full mr-1" />
                    </div>
                </td>

                <td class="pl-3 pr-6 pt-2 pb-3">
                    <div class="flex items-center space-x-2 mt-0.5">
                        <FontAwesomeIcon icon="timer" class="h-2.5 w-2.5" />

                        <div class="flex flex-col rounded-md py-1 mt-0.5 px-0.5 w-full items-center w-[75px]">
                            <div class="flex items-center space-x-2 w-full">
                                <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                    <div
                                        class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                        :style="{
                                            width: '30%',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>

                        <span>{{ formatDateWithTime(b.data.parameters.startsAt, true) }}</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
    import { formatDateWithTime, formatNumberToDecimal } from '~/js/formatting';
    import htoCurrency from '@/assets/currency/hto.png';
    import { Betting } from '~/types/Betting.types';

    defineProps<{
        betting: Betting[];
    }>();
</script>

<style scoped></style>
