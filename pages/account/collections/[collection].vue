<template>
    <NuxtLayout name="account">
        <AppContainer>
            <AppBackButton class="pt-4 lg:pt-0" title="Collections" path="/account" />

            <CollectionOverviewTitle class="justify-center md:justify-start" :amount="collection.count()">
                {{ collectionDetails.name }}
            </CollectionOverviewTitle>

            <main>
                <component class="mt-5" :is="skeletonComponent" v-if="!collection.fetched()" />

                <AppActionCard v-else-if="collection.error()" :type="AlertType.ERROR" class="mt-6">
                    <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }} </template>
                </AppActionCard>

                <NftContainer v-else :collection="collectionId" :card-redirect="cardRedirectTo">
                    <template #cardDetail="{ item }">
                        <ListingBottomListedCard :collection="collectionId" :mint="item.mint" />
                    </template>
                </NftContainer>
            </main>
        </AppContainer>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { useAccountStore } from '~/store/account';
    import { mapState } from 'pinia';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';
    import { computed } from 'vue';
    import { CollectionName } from '~/types/Collection.types';
    import { useRoute } from '#app';
    import { CollectionList } from '~/types/Collection.data';
    import { NftContainerSkeleton, ParcelContainerSkeleton } from '#components';

    const route = useRoute();

    const collectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const collectionDetails = computed(() => {
        return CollectionList.get(collectionId.value);
    });

    const collection = computed(() => {
        return mapState(useAccountStore, {
            data: (store) => store.tokens[collectionId.value].data,
            fetched: (store) => store.tokens[collectionId.value].fetched,
            error: (store) => store.tokens[collectionId.value].error,
            count: (store) => store.tokens[collectionId.value].data?.length,
        });
    });

    const skeletonComponent = computed(() => {
        switch (collectionId.value) {
            case CollectionName.PARCELS:
                return ParcelContainerSkeleton;

            default:
                return NftContainerSkeleton;
        }
    });

    const cardRedirectTo = (item: any) => {
        return {
            name: 'collections-collection-id',
            params: { id: item.mint, collection: collectionId.value },
        };
    };
</script>

<style scoped></style>
