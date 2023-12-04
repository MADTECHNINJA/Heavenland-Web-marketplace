<template>
    <div>
        <AppCardTitle title="Profile picture" icon="image" />

        <div class="flex flex-col md:flex-row items-start justify-between px-6 py-3">
            <div class="md:mr-2">
                <div class="flex items-center space-x-1 mt-2">
                    <p class="text-sm text-gray-300">Select one of your PFPs for stamping.</p>
                </div>
            </div>

            <div class="flex justify-between w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9">
                <AppSecondaryButton icon="chevron-left" @click="previousStep">Back</AppSecondaryButton>
                <AppButton :disabled="!pfp" @click="nextStep">Continue...</AppButton>
            </div>
        </div>

        <AppActionCard transparent v-if="paragonCollections.error()" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }}</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!paragonCollections.fetched()" :type="AlertType.LOADING" icon="empty-set">
            <template #title>Loading wallet...</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!hasPfps" :type="AlertType.INFO" icon="empty-set">
            <template #title>No PFPs</template>

            <template #desc>Stamping requires a PFP NFT. You don't have any PFP in your wallet. </template>
        </AppActionCard>

        <template v-if="isPfpsFetched && hasPfps">
            <AppCollectionFilter
                class="px-6 mb-4"
                :collections="ownedCollections"
                @change="changePfpCollectionFilter"
            />

            <ParagonContainer
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 mt-3 mb-6"
                v-if="pfpCollections"
            >
                <template v-for="collection in pfpCollections" :key="collection">
                    <ParagonOperationCard
                        v-for="nft in collection.data"
                        :nft="nft"
                        :key="nft.mint"
                        :selected="pfp?.mint === nft.mint"
                        @select="onSelected"
                    />
                </template>
            </ParagonContainer>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { INftBase } from '~~/types/Nft.types';
    import { mapState } from 'pinia';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';

    defineProps<{
        pfp: INftBase;
    }>();

    const emits = defineEmits<{
        (e: 'update:pfp', pfp: INftBase): void;
        (e: 'return'): void;
        (e: 'next'): void;
    }>();

    const onSelected = (value: INftBase) => {
        emits('update:pfp', value);
    };

    const isPfpsFetched = computed(() => {
        for (const [_, tokens] of Object.entries(accountStore.getStampingPfpTokenCollections)) {
            if (!(tokens as DataWrapper<any>).fetched) {
                return false;
            }
        }
        return true;
    });

    const paragonCollections = mapState(useAccountStore, {
        fetched: (store) => store.tokens.paragons.fetched,
        error: (store) => store.tokens.paragons.error,
        data: (store) => store.tokens.paragons.data,
    });

    const ownedCollections = computed(() => {
        return Object.values(accountStore.getStampingPfpTokenCollections)
            .filter((item) => {
                if (item?.data?.length > 0) {
                    return item;
                }
                return;
            })
            .map((item) => item?.data[0]?.cname)
            .sort((a, b) => (a > b ? 1 : -1));
    });

    const accountStore = useAccountStore();

    const activePfpCollectionFilter = ref('all');

    const pfpCollections = computed(() => {
        if (activePfpCollectionFilter.value === 'all') {
            return accountStore.getStampingPfpTokenCollections;
        } else {
            return [accountStore.getStampingPfpTokenCollections[activePfpCollectionFilter.value]];
        }
    });

    const changePfpCollectionFilter = (cname: string) => {
        activePfpCollectionFilter.value = cname;
    };

    const hasPfps = computed(() => {
        for (const [_, tokens] of Object.entries(accountStore.getStampingPfpTokenCollections)) {
            if ((tokens as DataWrapper<any>)?.data?.length > 0) {
                return true;
            }
        }
        return false;
    });

    const previousStep = () => {
        emits('return');
    };

    const nextStep = () => {
        emits('next');
    };
</script>

<style scoped></style>
