<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 lg:gap-y-0 gap-x-3 mt-6 relative">
        <div class="relative col-span-3">
            <div class="absolute h-[200px] z-[5] opacity-[15%] right-0 bottom-0">
                <img :src="paragonOwnershipImg" class="h-[200px]" />
            </div>

            <div
                class="relative block h-full w-full overflow-hidden bg-indigo-930 rounded-lg text-start focus:outline-none"
            >
                <div
                    class="bg-gradient-to-r from-indigo-930 to-indigo-940 py-2 px-4 rounded-t-lg flex items-center space-x-2"
                >
                    <FontAwesomeIcon :icon="['fad', 'circle-dashed']" class="h-3 w-3 text-white" />
                    <p class="text-sm font-semibold tracking-tight text-gray-200">My paragons</p>
                </div>

                <div class="grid grid-cols-6">
                    <div class="flex py-4 px-3 col-span-6 lg:col-span-4 lg:col-span-5 xl:col-span-4">
                        <template v-for="i in 6" :key="i">
                            <div class="flex grow flex-col items-center relative h-16 md:h-20">
                                <img
                                    v-if="!fetched || error"
                                    :src="getParagonEmptyTierImage(0)"
                                    class="h-16 w-16 sm:h-20 sm:w-20 animate-pulse absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 aspect-square opacity-60"
                                />
                                <img
                                    v-else-if="isTierOwned(i - 1)"
                                    :src="getParagonTierImage(i - 1)"
                                    class="h-16 sm:h-20 absolute top-1/2 left-1/2 -translate-y-1/2 aspect-auto -translate-x-1/2"
                                />
                                <img
                                    v-else
                                    :src="getParagonEmptyTierImage(i - 1)"
                                    class="h-16 sm:h-20 absolute top-1/2 left-1/2 -translate-y-1/2 aspect-auto -translate-x-1/2 opacity-60"
                                />
                                <div
                                    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center"
                                >
                                    <AppSpinner v-if="!fetched || error" />
                                    <p v-else class="text-xs text-center font-medium select-none">
                                        {{ getParagonTierCount(i - 1) }}
                                    </p>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { computed } from 'vue';
    import { getParagonEmptyTierImage, getParagonTierImage } from '~/types/Paragon.utils';
    import paragonOwnershipImg from '@/assets/paragons/ownership.png';

    const props = defineProps<{
        paragons: IParagonBase[];
        fetched: boolean;
        error: boolean;
    }>();

    const getParagonTierCount = (tier: number) => {
        return paragonTiers.value.find((t) => t[0] === tier.toString())?.[1] ?? 0;
    };

    const paragonTiers = computed<IParagonBase[]>(() => {
        return props.paragons
            .reduce((acc, item) => {
                const tierIndex = acc.findIndex(([tier, _]) => tier === item.tier);

                if (tierIndex === -1) {
                    acc.push([item.tier, 1]);
                } else {
                    acc[tierIndex][1]++;
                }

                return acc;
            }, [])
            .sort((a, b) => (a[0] > b[0] ? 1 : -1));
    });

    const isTierOwned = (tier: number) => {
        return paragonTiers.value.find((p) => p[0] === tier.toString());
    };
</script>

<style scoped></style>
