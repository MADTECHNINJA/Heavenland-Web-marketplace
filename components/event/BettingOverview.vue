<template>
    <div class="flex flex-col relative bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg">
        <div
            class="w-full justify-center md:justify-start space-x-1.5 font-semibold items-center px-6 text-amber-500 bg-amber-600 bg-opacity-10 text-xs py-2.5 rounded-t-lg flex"
        >
            <FontAwesomeIcon :icon="['fad', 'hourglass-half']" class="cursor-not-allowed h-2.5 w-2.5" />

            <span>Coming soon</span>
        </div>

        <div class="absolute z-10 rounded-lg top-0 bottom-0 right-0 left-0 items-center justify-center flex"></div>

        <div class="py-4 px-5 opacity-[25%]">
            <h1 class="font-bold text-md tracking-tight">Betting</h1>

            <div class="flex items-center space-x-2 mt-4">
                <FontAwesomeIcon :icon="['fad', 'money-check-pen']" class="h-5 w-5" />
                <p class="text-sm tracking-tight text-center md:text-justify text-gray-300">
                    This event includes 2 betting options.
                </p>
            </div>

            <div
                class="grid grid-cols-3 text-sm text-gray-300 bg-black/10 border border-gray-400 border-opacity-20 rounded-lg px-3 py-2 mt-3"
            >
                <div class="flex items-center space-x-2 col-span-2">
                    <FontAwesomeIcon icon="star" class="h-2.5 w-2.5 text-amber-500" />
                    <p class="text-sm tracking-tight text-gray-300">Who is going to win this time?</p>
                </div>

                <div class="flex text-sm items-center justify-end col-span-1 text-end mt-1 text-gray-300">
                    100 - 100.000
                    <img :src="htoCurrency" alt="HTO" class="h-3.5 rounded-full ml-1" />
                </div>

                <div class="flex items-center space-x-2 col-span-2">
                    <FontAwesomeIcon icon="star" class="h-2.5 w-2.5 text-amber-500" />
                    <p class="text-sm tracking-tight text-gray-300">What's the final time going to be?</p>
                </div>

                <div class="flex text-sm items-center justify-end col-span-1 text-end mt-1 text-gray-300">
                    200 - 50.000
                    <img :src="htoCurrency" alt="HTO" class="h-3.5 rounded-full ml-1" />
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 w-full mt-2">
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

            <div class="mt-2">
                <AppSecondaryButton @click="redirectToBetting">Display all betting options</AppSecondaryButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { GamingEvent } from '~/types/Event.types';
    import { useRouter } from '#app';

    const router = useRouter();

    const props = defineProps<{
        event: DataWrapper<GamingEvent | null>;
    }>();
    const redirectToBetting = () => {
        const eventId = props.event.data?.data?.id;

        if (eventId) {
            router.push({
                path: '/betting',
                query: {
                    event: eventId,
                },
            });
        }
    };
</script>

<style scoped></style>
