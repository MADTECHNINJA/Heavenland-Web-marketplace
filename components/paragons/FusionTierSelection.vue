<template>
    <div>
        <AppCardTitle title="Tier selection" icon="circle-dashed" />
        <div class="flex flex-col md:flex-row md:items-start items-center justify-between px-6 py-3">
            <div class="md:mr-2">
                <div class="flex items-center space-x-1 mt-2">
                    <p class="text-sm text-gray-300">
                        Select paragon tier for fusing. You must own at least 5 paragons of this tier to start the
                        fusing.
                    </p>
                </div>
            </div>

            <AppButton class="mt-4 md:mt-0" :disabled="!selectedTier" @click="nextStep">Continue...</AppButton>
        </div>

        <AppActionCard transparent v-if="paragonCollections.error()" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }}</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!paragonCollections.fetched()" :type="AlertType.LOADING" icon="empty-set">
            <template #title>Loading wallet...</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!hasParagons" :type="AlertType.INFO" icon="empty-set">
            <template #title>No paragons</template>
            <template #desc>Fusion requires Paragon NFTs. You don't have any Paragon NFT in your wallet.</template>
        </AppActionCard>

        <ParagonTierPicker
            :class="hasParagons && 'mb-6 mt-3'"
            v-model="selectedTier"
            v-if="paragonCollections.fetched() && !paragonCollections.error() && hasParagons"
            :quantity="5"
            :paragons="paragonCollections.data()"
            @select="onTierSelected"
        />
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { mapState } from 'pinia';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';

    const emits = defineEmits<{
        (e: 'update:tier', paragonMint: string): void;
        (e: 'next'): void;
    }>();

    defineProps<{
        tier: string;
        paragons: IParagonBase[];
    }>();

    const selectedTier = ref('');

    const paragonCollections = mapState(useAccountStore, {
        fetched: (store) => store.tokens.paragons.fetched,
        error: (store) => store.tokens.paragons.error,
        data: (store) => store.tokens.paragons.data,
    });

    const hasParagons = computed(() => {
        return paragonCollections.data()?.length > 0 ?? false;
    });

    const nextStep = () => {
        emits('next');
    };

    const onTierSelected = () => {
        emits('update:tier', selectedTier.value);
    };
</script>
