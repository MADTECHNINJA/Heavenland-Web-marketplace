<template>
    <AppContainer>
        <AppBackButton class="pt-4 lg:pt-0" :title="collectionDetails.name + ' collection'" />

        <AppTitle class="mb-6 md:text-center text-white lg:text-left">{{ collectionDetails.unit }}</AppTitle>

        <ListingDetailSkeleton
            v-if="!item.fetched || !apiListing.fetched || listingLoading.value || refetchingValues"
        />

        <AppActionCard v-else-if="!item" class="mt-6" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }} </template>
        </AppActionCard>

        <div v-else class="flex flex-col">
            <div class="flex flex-col space-x-0 lg:space-x-5 lg:flex-row justify-between">
                <div class="relative max-w-md w-full self-center lg:self-auto">
                    <div
                        class="aspect-square relative overflow-hidden md:max-w-md w-full mx-auto mb-5 lg:mb-0 rounded-md"
                        :class="{ 'animate-pulse': item.data?.image && !loaded }"
                    >
                        <img
                            v-if="item.fetched && item.data.image"
                            class="rounded-md aspect-square max-h-full md:max-w-md mx-auto mb-5 lg:mb-0"
                            v-lazy="{ src: item.data.image, lifecycle: lazyOptions.lifecycle }"
                            :class="{ 'opacity-0': !loaded }"
                            :alt="item.data.name"
                        />

                        <div v-else>
                            <FontAwesomeIcon
                                icon="image-slash"
                                class="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
                            />

                            <img
                                :src="collectionImgBg"
                                alt="Collection cover"
                                class="opacity-[15%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                    <!--                    <ListingDetailPriceHistory
                        :data="[20, 40, 500]"
                        title="Price History"
                        :labels="[1643454633, 1656477433, 1656477433]"
                    />-->
                </div>

                <div class="w-full">
                    <ListingDetailHeader
                        :fetched="item.fetched"
                        :error="item.error"
                        :data="item.data"
                        :collection="collectionId"
                    />

                    <ListingDetailOverview
                        :fetched="item.fetched"
                        :error="item.error"
                        :data="item.data"
                        :api-listing="apiListing"
                    />

                    <div class="lg:flex w-full space-x-3">
                        <ListingDetailOptions
                            :class="[
                                (hasWalletConnected && isInWallet && hasStaking) || !isInWallet ? 'lg:w-3/5' : 'w-full',
                            ]"
                            @update="onListingUpdate"
                            :item="item.data"
                            :fetched="item.fetched"
                            :error="item.error"
                            :api-listing="apiListing"
                            :loading="listingLoading"
                        />
                        <div v-if="hasWalletConnected && isInWallet && hasStaking" class="lg:w-2/5">
                            <StakingInfoCard :parcel-id="mintId" />
                        </div>

                        <div v-if="!isInWallet" class="lg:w-2/5">
                            <CashbackOperationOverview :amount="apiListing.data.price" :base="0.02" />
                        </div>
                    </div>

                    <div v-if="hasWalletConnected && isParagon" class="w-full mt-6">
                        <ParagonsInfoCard :pfp="stampedPfp" :paragon="item.data" />
                    </div>

                    <ListingAttributesOverview
                        :fetched="item.fetched"
                        :error="item.error"
                        :data="item.data"
                        :collection="collectionId"
                    />
                </div>
            </div>

            <ParcelDetailBucketContent
                v-if="item.data && item.data.type === EParcelSymbol.PARCEL_BUCKET"
                :parcel-bucket="item.data"
                class="mt-6"
            />

            <ListingItemActivity :activities="nftActivities" class="mt-6" />
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { useRoute } from 'vue-router';
    import { useAccountStore } from '~/store/account';
    import { EParcelSymbol } from '~/types/Parcel.types';
    import { computed, onMounted, reactive, ref } from 'vue';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { ActivityResponse } from '~/types/Activity.types';
    import { API } from '~/api';
    import { CollectionName } from '~/types/Collection.types';
    import { CollectionList } from '~/types/Collection.data';
    import { QueryProvider } from '~/types/QueryProvider.types';
    import { useWallet } from 'solana-wallets-vue';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';
    import { Listing } from '~/types/Listing.types';
    import { useCollectionStore } from '~/store/collections';
    import { ITokenMetadata, Metaplex } from '~/js/metaplex';
    import { INftBase } from '~/types/Nft.types';
    import { CollectionFactory } from '~/types/CollectionFactory.types';
    import { getNftAttribute } from '~/types/Nft.utils';

    const route = useRoute();
    const accountStore = useAccountStore();
    const collectionStore = useCollectionStore();

    const refetchingValues = ref(false);

    const collectionImgBg = computed(() => {
        return CollectionFactory.getCollectionCover(collectionDetails.value.id);
    });

    const hasWalletConnected = computed(() => {
        return publicKey.value;
    });

    const isInWallet = computed(() => {
        return accountStore.tokens[collectionId.value].data?.findIndex((p) => p.mint === route.params.id) !== -1;
    });

    const collectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const stampedPfp = computed(() => {
        return getNftAttribute(item.value?.data, 'PFP Mint');
    });

    const isParagon = computed(() => {
        return item.value.data.cname === CollectionName.PARAGONS;
    });

    const hasStaking = computed(() => {
        return CollectionList.get(collectionId.value).featureFlags?.allowStaking;
    });

    const mintId = computed(() => {
        return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    });

    const collectionDetails = computed(() => {
        return CollectionList.get(collectionId.value as CollectionName);
    });

    const apiListing = ref(new DataWrapper<Listing>());
    const item = ref(new DataWrapper<INftBase>());

    const getItem = async () => {
        if (apiListing.value.data) {
            item.value.setData(CollectionFactory.typeListing(collectionId.value, apiListing.value.data).nft);
        }

        const walletNft = (accountStore.tokens[collectionId.value].data as INftBase[])?.find(
            (p) => p.mint === route.params.id
        );

        if (walletNft) {
            item.value.setData(walletNft);
            return;
        }

        const tokenMetadata: ITokenMetadata = (await Metaplex.getInstance().retrieveRequestItems([mintId.value]))?.[0];
        item.value.setData(CollectionFactory.createInstance(collectionId.value, tokenMetadata));
    };

    const loaded = ref(false);
    const lazyOptions = reactive({
        lifecycle: {
            loading: () => {
                loaded.value = false;
            },
            loaded: () => {
                loaded.value = true;
            },
        },
    });

    const nftActivities = ref(new DataWrapper<ActivityResponse[]>());
    const listingLoading = ref(false);

    const fetchListingInformation = async () => {
        try {
            listingLoading.value = true;

            const query = new QueryProvider([
                ['filter[collection]', CollectionList.get(collectionId.value as CollectionName).id],
                ['filter[token]', mintId.value],
            ]);

            const response = await API.ListingService.getListings(collectionId.value as CollectionName, query);

            if (response?.items?.length > 0) {
                apiListing.value.setData(response.items[0]);
            } else {
                apiListing.value.setData(null);
            }

            listingLoading.value = false;
        } catch (e: any) {
            apiListing.value.setError(e);

            listingLoading.value = false;
        }
    };

    const fetchListingActivities = async () => {
        try {
            const queryProvider = new QueryProvider([
                ['filter[token]', mintId.value],
                ['sort-by[date]', 'desc'],
            ]);

            const activities = await API.ActivityService.getActivities(queryProvider);

            if (activities) {
                nftActivities.value.setData(activities.items);
            } else {
                nftActivities.value.setError();
            }
        } catch (e: any) {
            nftActivities.value.setError();
        }
    };

    const { publicKey } = useWallet();

    const onListingUpdate = async (finish: () => void) => {
        refetchingValues.value = true;

        await fetchListingActivities();
        await accountStore.fetchWalletActivity(publicKey.value);
        await fetchListingInformation();
        await accountStore.refetchTokens(collectionId.value, publicKey.value);
        await collectionStore.fetchCollectionInfo(collectionId.value);
        await getItem();

        refetchingValues.value = false;

        if (finish) {
            finish();
        }
    };

    onMounted(async () => {
        await fetchListingInformation();
        await fetchListingActivities();
        await getItem();
    });
</script>

<style scoped></style>
