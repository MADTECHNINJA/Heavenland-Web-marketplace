<template>
    <AppAlert v-if="metadata.error()" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

    <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3 lg:gap-y-2 flex-wrap"
    >
        <div class="bg-indigo-930 px-6 py-3 rounded-md text-sm flex flex-col gap-y-2 items-center items-start">
            <span class="text-gray-300">Listed items</span>

            <div class="flex gap-x-1">
                <AppSpinner v-if="!metadata.fetched()" />
                <span v-else class="font-bold">{{ metadata.data().stats.totalListed }}</span>
            </div>
        </div>

        <div class="bg-indigo-930 px-6 py-3 rounded-md text-sm flex flex-col gap-y-2 items-center items-start">
            <span class="text-gray-300">Floor price</span>

            <div class="flex gap-x-1">
                <AppSpinner v-if="!metadata.fetched()" />
                <span v-else class="font-bold">{{ metadata.data().stats.floorPrice }}</span>
                <img :src="htoLogo" alt="Solana" class="rounded-full h-5 ml-1" />
            </div>
        </div>

        <div class="bg-indigo-930 px-6 py-3 rounded-md text-sm flex flex-col gap-y-2 items-center items-start">
            <span class="text-gray-300">Avg. sale price</span>

            <div class="flex gap-x-1">
                <AppSpinner v-if="!metadata.fetched()" />
                <span v-else class="font-bold">{{ metadata.data().stats.averageSalePrice }}</span>
                <img :src="htoLogo" alt="Solana" class="rounded-full h-5 ml-1" />
            </div>
        </div>

        <div class="bg-indigo-930 px-6 py-3 rounded-md text-sm flex flex-col gap-y-2 items-center items-start">
            <span class="text-gray-300">Volume 24h</span>

            <div class="flex gap-x-1">
                <AppSpinner v-if="!metadata.fetched()" />
                <span v-else class="font-bold">{{ metadata.data().stats.volume24h }}</span>
                <img :src="htoLogo" alt="Solana" class="rounded-full h-5 ml-1" />
            </div>
        </div>

        <div class="bg-indigo-930 px-6 py-3 rounded-md text-sm flex flex-col gap-y-2 items-center items-start">
            <span class="text-gray-300">Volume total</span>

            <div class="flex gap-x-1">
                <AppSpinner v-if="!metadata.fetched()" />
                <span v-else class="font-bold">{{ metadata.data().stats.volumeTotal }}</span>
                <img :src="htoLogo" alt="Solana" class="rounded-full h-5 ml-1" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import htoLogo from '@/assets/currency/hto.png';
    import { CollectionMetadata } from '~/types/Collection.types';
    import { DataWrapper } from '~/types/DataWrapper.types';

    defineProps<{
        metadata: DataWrapper<CollectionMetadata>;
    }>();
</script>

<style scoped></style>
