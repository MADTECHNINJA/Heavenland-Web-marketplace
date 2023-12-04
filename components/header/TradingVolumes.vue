<template>
    <AppAlert v-if="marketplaceStats.error()" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

    <div v-else class="lg:flex lg:space-x-3">
        <div
            id="tradingVolumesDiv2"
            class="lg:bg-indigo-930 px-3 h-[36px] items-center rounded-lg text-gray-300-600 text-xs font-semibold justify-center lg:justify-start lg:flex hidden"
        >
            <span class="mr-2 text-gray-400">Volume 24h</span>
            <AppSpinner v-if="!marketplaceStats.fetched()" />
            <span v-else class="text-gray-100 font-bold">{{ marketplaceStats.data().volume24h }}</span>
            <img :src="htoLogo" alt="Solana" class="rounded-full h-4 mx-1 mb-0.5" draggable="false" />

            <span class="ml-4 mr-2 text-gray-400">Volume total</span>
            <AppSpinner v-if="!marketplaceStats.fetched()" />
            <span v-else class="text-gray-100 font-bold">{{ marketplaceStats.data().volumeTotal }}</span>
            <img :src="htoLogo" alt="Solana" class="rounded-full h-4 mx-1 mb-0.5" draggable="false" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import htoLogo from '@/assets/currency/hto.png';
    import { onMounted } from 'vue';
    import { useStatsStore } from '~/store/stats';
    import { mapState } from 'pinia';

    const statsStore = useStatsStore();

    const marketplaceStats = mapState(useStatsStore, {
        fetched: (store) => store.marketplace.fetched,
        error: (store) => store.marketplace.error,
        data: (store) => store.marketplace.data,
    });

    onMounted(statsStore.fetchMarketplaceStats);
</script>

<style scoped></style>
