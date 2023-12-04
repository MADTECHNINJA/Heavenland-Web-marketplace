<template>
    <div class="space-y-12">
        <AppActionCard v-if="error" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }} </template>
        </AppActionCard>

        <component v-else-if="!fetched" :is="skeletonComponent" />

        <div v-else>
            <div class="overflow-hidden">
                <div
                    class="relative flex flex-row items-start gap-x-3 gap-y-6 transition-transform"
                    :class="{
                        'flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4':
                            router.currentRoute.value.path.includes('/collections'),
                    }"
                    ref="parcelCollectionDiv"
                    :style="{
                        transform: 'translateX(calc(-' + parcelCollectionMove.toString() + 'px))',
                    }"
                >
                    <NuxtLink
                        v-for="(listing, index) in listings"
                        :key="listing.nft.mint"
                        :to="collection + '/' + listing.nft.mint"
                        class="relative flex flex-col w-full"
                        :class="{
                            'flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.75rem)] md:flex-[0_0_calc((100%/3)-0.75rem)] lg:flex-[0_0_calc((100%/4)-0.75rem)] xl:flex-[0_0_calc((100%/6)-0.75rem)]':
                                router.currentRoute.value.path === '/',
                        }"
                        :id="'parcelShow-' + index"
                    >
                        <CollectionPriceCard :collection="collection" :listing="listing" />
                    </NuxtLink>
                </div>
            </div>

            <div
                class="flex justify-between text-2xl p-5"
                v-if="router.currentRoute.value.path === '/' && parcelCollectionChildCount > maxInCollection"
            >
                <FontAwesomeIcon
                    icon="chevron-left"
                    class="select-none opacity-0"
                    @click="parcelContainerMove('left')"
                    :class="{ 'opacity-100 cursor-pointer': parcelCollectionTranslate > 0 }"
                />
                <FontAwesomeIcon
                    icon="chevron-right"
                    class="select-none opacity-0"
                    @click="parcelContainerMove('right')"
                    :class="{
                        'opacity-100 cursor-pointer':
                            parcelCollectionTranslate < parcelCollectionChildCount - maxInCollection,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';
    import { useRouter } from '#app';
    import { Listing } from '~/types/Listing.types';
    import { computed, ref, onMounted, onUpdated } from 'vue';
    import breakpoints from '@/plugins/breakpoints.client';
    import { CollectionName } from '~/types/Collection.types';
    import { ParcelContainerSkeleton, NftContainerSkeleton } from '#components';
    import { CollectionFactory } from '~/types/CollectionFactory.types';

    const router = useRouter();

    const props = defineProps<{
        fetched: boolean;
        error: boolean;
        data: Listing[] | null;
        collection: CollectionName;
    }>();

    const skeletonComponent = computed(() => {
        switch (props.collection) {
            case CollectionName.PARCELS:
                return ParcelContainerSkeleton;

            default:
                return NftContainerSkeleton;
        }
    });

    const listings = computed(() => {
        return CollectionFactory.typeListingArray(props.collection, props.data);
    });

    const parcelCollectionDiv = ref(null);
    const parcelCollectionTranslate = ref(0);
    const parcelCollectionChildCount = ref(0);
    const parcelCollectionMove = ref(0);

    const maxInCollection = ref(1);

    const recalculateMaxInCollection = () => {
        switch (breakpoints().breakpoints.is) {
            case 'sm':
                maxInCollection.value = 2;
                break;
            case 'md':
                maxInCollection.value = 3;
                break;
            case 'lg':
                maxInCollection.value = 4;
                break;
            case 'xl':
                maxInCollection.value = 6;
                break;
            default:
                maxInCollection.value = 1;
        }
    };

    const parcelContainerMove = (side) => {
        recalculateMaxInCollection();

        parcelCollectionChildCount.value = parcelCollectionDiv.value.children.length;

        if (
            side === 'right' &&
            parcelCollectionTranslate.value < parcelCollectionChildCount.value - maxInCollection.value
        )
            parcelCollectionTranslate.value += 1;
        else if (side === 'left' && parcelCollectionTranslate.value > 0) parcelCollectionTranslate.value += -1;
        parcelCollectionMove.value = window.document.getElementById(
            'parcelShow-' + parcelCollectionTranslate.value
        ).offsetLeft;
    };

    onMounted(() => {
        window.addEventListener('resize', () => {
            recalculateMaxInCollection();
            parcelCollectionTranslate.value = 0;
            parcelCollectionMove.value = 0;
        });
    });

    onUpdated(() => {
        if (props.fetched) {
            recalculateMaxInCollection();
            parcelCollectionChildCount.value = parcelCollectionDiv.value.children.length;
        }
    });
</script>

<style scoped></style>
