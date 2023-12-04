<template>
    <div class="flex flex-col gap-y-4">
        <div v-for="(paragon, _, index) in data" :key="index" class="text-xs flex flex-col">
            <div class="items-center flex">
                <AppSpinner v-if="paragon.state === ParallelDataState.PROCESSING" class="h-3 w-3 mr-1.5" />
                <FontAwesomeIcon
                    v-else
                    :icon="['far', getIcon(paragon.state)]"
                    class="h-3.5 w-3.5 mr-2"
                    :class="[getIconColor(paragon.state)]"
                />
                <span class="w-fit text-gray-300"> {{ Number(index) + 1 }}/{{ Object.keys(data).length }} </span>
                <span class="font-semibold text-gray-100 ml-1.5">
                    {{ paragon?.breedingParagons ? 'Breeding' : 'Fusing' }}
                </span>

                <NuxtLink v-if="paragon?.link" :to="paragon.link.href" target="_blank">
                    <img :src="solscanLogo" alt="Solscan" class="mr-1 ml-1.5 h-3 w-3 -mt-0.5 inline-block" />
                    <span class="hyperlink">{{ paragon.link.name }}</span>
                </NuxtLink>
            </div>
            <div v-if="paragon.name !== '11111111111111111111111111111111'" class="mt-2 flex ml-5 items-center">
                <NuxtLink :to="'https://solscan.io/token/' + paragon.name" target="_blank">
                    <img :src="solscanLogo" alt="Solscan" class="mr-0.5 mb-0.5 h-3 w-3 inline-block" />
                </NuxtLink>

                <div class="inline-block mr-1">
                    <p class="text-gray-300">
                        <span class="text-gray-100 ml-1.5">
                            {{ formatAddress(paragon.name) }}
                        </span>
                    </p>
                </div>
            </div>
            <div class="mt-2 ml-5" v-for="item in paragon?.breedingParagons" :key="item">
                <div class="flex items-center">
                    <NuxtLink :to="'https://solscan.io/account/' + item" target="_blank">
                        <img :src="solscanLogo" alt="Solscan" class="mr-0.5 mb-0.5 h-3 w-3 inline-block" />
                    </NuxtLink>

                    <div class="inline-block">
                        <p class="text-gray-300">
                            <span class="text-gray-100 ml-1.5">
                                {{ formatAddress(item) }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import solscanLogo from '@/assets/logo/solscan.png';
    import { NotificationClaimParagons } from '~/types/Notification.types';
    import { ParallelDataState } from '~/types/Notification.types';
    import { formatAddress } from '@/js/formatting';

    defineProps<{
        data: NotificationClaimParagons;
    }>();

    const getIcon = (state: ParallelDataState) => {
        switch (state) {
            case ParallelDataState.FINISHED:
                return 'circle-check';

            case ParallelDataState.ERROR:
                return 'circle-times';

            default:
                return 'circle-dashed';
        }
    };

    const getIconColor = (state: ParallelDataState) => {
        switch (state) {
            case ParallelDataState.FINISHED:
                return 'text-green-500';

            case ParallelDataState.ERROR:
                return 'text-red-500';

            default:
                return 'text-gray-500';
        }
    };
</script>

<style scoped></style>
