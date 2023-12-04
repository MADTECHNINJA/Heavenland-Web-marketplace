<template>
    <AppContainer>
        <AppTitle>{{ collectionDetails.name }}</AppTitle>
        <AppDescriptionText> {{ collectionDetails.description }} </AppDescriptionText>

        <div
            :class="showPhoneFilter ? 'mt-6 mb-3' : 'my-6'"
            class="flex flex-col md:flex-row justify-between items-stretch"
        >
            <CollectionMetadataOverview class="justify-center md:justify-start" :metadata="collectionMetadata" />
            <div class="grid grid-cols-2 mt-6 md:mt-0 gap-x-3 md:block">
                <CollectionSortOptions
                    v-show="collectionMetadata?.data()?.stats?.totalListed"
                    class="md:ml-3"
                    @sort:update="sort"
                />
                <AppButton
                    v-if="collectionMetadata?.data()?.stats?.totalListed"
                    class="block w-full md:hidden"
                    @click="showPhoneFilter = !showPhoneFilter"
                    >{{ !showPhoneFilter ? 'Show filters' : 'Hide filters' }}
                    <FontAwesomeIcon class="ml-2" :icon="showPhoneFilter ? 'chevron-up' : 'chevron-down'" />
                </AppButton>
            </div>
        </div>
        <main>
            <section>
                <CollectionExploreBanner
                    v-if="collectionMetadata?.fetched() && !collectionMetadata?.data()?.stats?.totalListed"
                    :collectionStore="collectionStore"
                    :collectionName="collectionDetails.name"
                    title="It looks like this collection is empty. Check out what else we've got..."
                />
                <div class="md:grid relative grid-cols-8 gap-x-0 md:gap-x-6 gap-y-10">
                    <div
                        :class="showPhoneFilter ? 'block mb-6' : 'hidden md:block'"
                        class="col-span-3 lg:col-span-2 relative"
                    >
                        <ListingFilterSidebarSkeleton v-if="!collectionMetadata.fetched()" />

                        <ListingFilterSidebar
                            class="sticky top-6"
                            v-else-if="collectionMetadata?.data()?.stats?.totalListed"
                            :data="collectionMetadata.data() ?? []"
                            :fetched="collectionMetadata.fetched()"
                            :error="collectionMetadata.error()"
                            @updateFilter="updateFilterQuery"
                            :removeAllFilters="clearSidebarFilters"
                        />
                    </div>
                    <div class="col-span-5 lg:col-span-6">
                        <ListingFilterActive
                            class="mb-3"
                            :data="collectionMetadata.data() ?? []"
                            :fetched="collectionMetadata.fetched()"
                            @updateFilter="updateFilterQuery"
                        />
                        <AppActionCard
                            :type="AlertType.INFO"
                            icon="empty-set"
                            v-if="
                                collectionListings.data() &&
                                !collectionListings.data().length &&
                                collectionMetadata?.data()?.stats?.totalListed
                            "
                        >
                            <template #title>No items!</template>
                            <template #desc>None items were found.</template>
                        </AppActionCard>
                        <ListingContainer
                            v-else
                            :data="collectionListings.data()"
                            :fetched="collectionListings.fetched()"
                            :error="collectionListings.error()"
                            :collection="collectionId"
                        />

                        <div class="text-center p-5" v-if="canLoadNew">
                            <FontAwesomeIcon icon="chevron-down" class="p-2" v-if="!loadingNew" />
                            <AppSpinner v-if="loadingNew" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { onMounted, ref, computed, onUnmounted } from 'vue';
    import { useListingsStore } from '~/store/listings';
    import { useCollection } from '~/composables/useCollection';
    import { CollectionFilters, CollectionName } from '~/types/Collection.types';
    import { CollectionList } from '~/types/Collection.data';
    import { useCollectionStore } from '~/store/collections';
    import { QueryProvider } from '~/types/QueryProvider.types';
    import { sortItems } from '~/js/query';
    import { useRoute } from '#app';
    import { AlertType } from '~/types/Alert.utils';
    import { resetAllFilters } from '~/types/Collection.utils';

    const route = useRoute();
    const listingsStore = useListingsStore();
    const collectionStore = useCollectionStore();

    const collectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const collection = useCollection();

    const clearSidebarFilters = ref(false);

    const collectionDetails = CollectionList.get(collectionId.value);
    const collectionListings = collection.listings(collectionId.value);
    const collectionMetadata = collection.metadata(collectionId.value);

    const showPhoneFilter = ref(false);

    const createQueryProvider = () => {
        return new QueryProvider([
            ['filter[collection]', CollectionList.get(collectionId.value).id],
            ['sort-by[price]', 'asc'],
            ['limit', '24'],
        ]);
    };

    let queryProvider = createQueryProvider();

    queryProvider.setOffset(0);

    const loadingNew = ref(false);
    const infinityProgress = ref(0);

    const updateFilterQuery = async () => {
        const filters = collectionMetadata.data().filters as CollectionFilters[];
        queryProvider = createQueryProvider();

        for (const filter of filters) {
            const filterParams = filter.uiType.getActiveFilters();
            if (filterParams.length) {
                queryProvider.addFilter(filter.filterId, filterParams.join(','));
            }
        }

        await fetchCollectionApi();
    };

    const fetchCollectionApi = async () => {
        queryProvider.setOffset(0);
        collectionListings.clear();
        await listingsStore.fetchCollection(collectionId.value, queryProvider);
    };

    const infinityScroll = async () => {
        if (
            window.innerHeight + window.scrollY >= window.document.body.offsetHeight - 2 &&
            !loadingNew.value &&
            canLoadNew.value
        ) {
            loadingNew.value = true;
            infinityProgress.value += 1;
            queryProvider.setOffset(infinityProgress.value);
            await listingsStore.fetchCollection(collectionId.value, queryProvider, true);
            loadingNew.value = false;
            await infinityScroll();
        }
    };

    const sort = async (option) => {
        await sortItems(queryProvider, option, async () => {
            collectionListings.clear();

            await listingsStore.fetchCollection(collectionId.value, queryProvider);
        });
    };

    const canLoadNew = computed(() => {
        return collectionListings.dataCount() < collectionListings.totalCount();
    });

    const fetchCollection = async () => {
        await listingsStore.fetchCollection(collectionId.value, queryProvider);
        await collectionStore.fetchCollectionInfo(collectionId.value);
    };

    onUnmounted(() => {
        resetAllFilters(collectionMetadata.data()?.filters);
    });

    onMounted(async () => {
        await fetchCollection();
        await infinityScroll();

        window.addEventListener('scroll', () => {
            infinityScroll();
        });
    });
</script>

<style scoped></style>
