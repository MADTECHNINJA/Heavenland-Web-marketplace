<template>
    <div class="bg-gradient-to-r from-indigo-930 lg:mt-5 xl:mt-0 to-indigo-940 px-6 pt-4 pb-5 rounded-lg text-start">
        <p class="mb-6 text-sm font-semibold text-center md:text-start">Upcoming events</p>

        <ol class="relative border-l border-gray-500">
            <li class="mb-6 last:mb-0 ml-4" v-for="event in timeline" :key="event.increasedOn">
                <div class="absolute w-2 h-2 bg-gray-300 rounded-full mt-1.5 -left-1 border border-white"></div>

                <p class="text-sm pt-1 leading-none text-gray-300 font-semibold">
                    {{ event.name }}
                </p>

                <p class="mt-2 mb-2 text-xs font-normal leading-none text-gray-400">
                    {{ event.increasedOn }}
                </p>
                <div
                    v-if="event.type === EventType.RELEASE_RATE"
                    class="flex mt-1 items-center text-xs text-gray-300 font-semibold"
                >
                    <span class="mr-1">{{ event.data }}</span>
                    <img v-if="!event.tba" :src="htoCurrency" class="h-4 rounded-full inline-block" />
                    <span v-if="!event.tba" class="ml-1">/ hour</span>
                </div>
                <div
                    v-else-if="event.type === EventType.CHL"
                    class="flex mt-1 items-center text-xs text-gray-300 font-semibold"
                >
                    New value: {{ event.data }}
                </div>
            </li>
        </ol>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';

    const EventType = {
        RELEASE_RATE: 0,
        CHL: 1,
    };

    const timeline = [
        {
            type: EventType.RELEASE_RATE,
            name: 'HTO release rate increase',
            data: '876.12',
            increasedOn: 'April 20',
        },
    ];
</script>

<style scoped></style>
