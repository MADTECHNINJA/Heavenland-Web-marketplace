<template>
    <div>
        <AppCardTitle title="Paragons" icon="circle-dashed" />
        <div class="flex flex-col md:flex-row md:items-start items-center justify-between px-6 py-3">
            <div>
                <div class="flex items-center space-x-1 mt-2">
                    <p class="text-sm text-gray-300">Select one of your Paragons NFTs for stamping.</p>
                </div>
            </div>

            <AppButton class="mt-4 md:mt-0" :disabled="!paragon" @click="nextStep">Continue...</AppButton>
        </div>

        <AppActionCard transparent v-if="paragonCollections.error()" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }}</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!paragonCollections.fetched()" :type="AlertType.LOADING" icon="empty-set">
            <template #title>Loading wallet...</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!hasParagons" :type="AlertType.INFO" icon="empty-set">
            <template #title>No Paragons</template>
            <template #desc>Stamping requires a paragon NFT. You don't have any paragon in your wallet. </template>
        </AppActionCard>

        <div v-else-if="hasParagons">
            <div class="flex flex-col md:flex-row justify-center md:justify-start items-center px-6 mt-3 mb-4 md:mb-6">
                <ParagonsSortingComponent
                    class="mb-4 md:mb-0"
                    @reverse="reverse = $event"
                    @selected="sortingPriority = $event"
                    :paragons="activeParagons"
                />

                <div class="mx-3 h-7 border hidden md:block border-gray-400 opacity-20" />

                <AppParagonTierFilter
                    v-if="sortedParagonCollections?.length"
                    :paragons="sortedParagonCollections"
                    @change="changeParagonsTierFilter"
                />
            </div>

            <ParagonContainer
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 mt-3 mb-6"
                v-if="sortedParagonCollections?.length === paragonCollections.data()?.length"
            >
                <ParagonOperationCard
                    v-for="p in activeParagons"
                    :nft="p"
                    :key="p.id"
                    :selected="paragon?.mint === p.mint"
                    @select="selectParagon"
                />
            </ParagonContainer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { mapState } from 'pinia';
    import { sortArrayByTags } from '~/types/Paragon.utils';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { INftBase } from '~~/types/Nft.types';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';

    const emits = defineEmits<{
        (e: 'update:paragon', paragonSelected: IParagonBase): void;
        (e: 'next'): void;
    }>();

    const sortingPriority = ref(null);
    const reverse = ref(null);
    const activeParagonsFilter = ref('all');

    defineProps<{
        paragon: INftBase;
    }>();

    const selectParagon = (value: INftBase) => {
        emits('update:paragon', value);
    };

    const paragonCollections = mapState(useAccountStore, {
        fetched: (store) => store.tokens.paragons.fetched,
        error: (store) => store.tokens.paragons.error,
        data: (store) => store.tokens.paragons.data,
    });

    const sortedParagonCollections = computed(() => {
        if (sortingPriority.value?.length) {
            return sortArrayByTags(sortingPriority.value, paragonCollections.data(), reverse.value);
        } else {
            return paragonCollections.data()?.sort((a, b) => {
                return a.tier > b.tier ? 1 : a.tier === b.tier && a.score < b.score ? 1 : -1;
            });
        }
    });

    const changeParagonsTierFilter = (tier: string) => {
        activeParagonsFilter.value = tier;
    };

    const activeParagons = computed(() => {
        if (activeParagonsFilter.value === 'all') {
            return sortedParagonCollections.value;
        } else {
            return sortedParagonCollections.value.filter((p) => activeParagonsFilter.value === p.tier);
        }
    });

    const hasParagons = computed(() => {
        if (!activeParagons.value) {
            return null;
        }
        return Object.values(activeParagons.value)?.length > 0 ?? false;
    });

    const nextStep = () => {
        emits('next');
    };
</script>
