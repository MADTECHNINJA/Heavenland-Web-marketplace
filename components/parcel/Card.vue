<template>
    <div
        class="bg-indigo-930 relative rounded-t-lg w-full shadow not:disabled:cursor-pointer transition-all"
        :class="[
            { [selectableProps]: selectable && !disabled },
            { 'rounded-b-lg': !hasExtension },
            { 'opacity-50 cursor-auto': disabled },
        ]"
        @click="redirectToDetail"
    >
        <div v-if="isInWallet" class="flex absolute space-y-1 flex-col">
            <ListingOwnedNftBadge class="w-fit relative" />
        </div>

        <div class="relative">
            <div
                class="rounded-t-md aspect-square bg-indigo-940 overflow-hidden w-full"
                :class="{ 'animate-pulse': item.image && !loaded }"
            >
                <img
                    v-if="item.image"
                    v-lazy="{ src: lazyOptions.src, lifecycle: lazyOptions.lifecycle }"
                    :class="{ 'opacity-0': !loaded }"
                    :alt="item.name"
                />

                <div v-else>
                    <FontAwesomeIcon
                        icon="image-slash"
                        class="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2"
                    />

                    <img
                        :src="parcelCollection"
                        class="opacity-[15%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div>

            <div
                v-if="item.isParcelBucket || item.drillThroughAmount > 0 || item.highTrafficAmount > 0"
                class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs drop-shadow-md items-center justify-center"
            >
                <AppTooltip>
                    <template #text>
                        <div class="flex flex-col space-y-2 min-w-[120px]">
                            <div v-if="item.isParcelBucket" class="flex items-center space-x-1.5">
                                <FontAwesomeIcon icon="layer-group" class="text-white" />
                                <span class="whitespace-nowrap">{{ getParcelsCount }}x Parcels</span>
                            </div>

                            <div v-if="item.drillThroughAmount > 0" class="flex items-center space-x-1.5">
                                <FontAwesomeIcon :icon="['far', 'star']" class="text-amber-600" />
                                <span class="whitespace-nowrap">{{ item.drillThroughAmount }}x Drill through</span>
                            </div>

                            <div v-if="item.highTrafficAmount > 0" class="flex items-center space-x-1.5">
                                <img :src="highTrafficIcon" class="h-[11px] w-[16px]" alt="High traffic" />
                                <span class="whitespace-nowrap">{{ item.highTrafficAmount }}x High traffic</span>
                            </div>
                        </div>
                    </template>

                    <div
                        v-if="item.drillThroughAmount || item.highTrafficAmount || item.isParcelBucket"
                        class="flex items-center bg-indigo-900 px-3 py-1 rounded-full space-x-2 min-h-[24px]"
                    >
                        <div v-if="item.isParcelBucket" class="flex items-center">
                            <span class="font-bold mr-1">{{ getParcelsCount }}</span>
                            <FontAwesomeIcon icon="layer-group" class="text-white" />
                        </div>
                        <div v-if="item.drillThroughAmount && item.drillThroughAmount > 0" class="flex items-center">
                            <span v-if="item.drillThroughAmount > 1" class="font-bold mr-1">
                                {{ item.drillThroughAmount }}
                            </span>

                            <FontAwesomeIcon :icon="['far', 'star']" class="text-amber-600" />
                        </div>
                        <div v-if="item.highTrafficAmount && item.highTrafficAmount > 0" class="flex items-center">
                            <span v-if="item.highTrafficAmount > 1" class="font-bold mr-1">
                                {{ item.highTrafficAmount }}
                            </span>

                            <img :src="highTrafficIcon" class="h-[14px]" />
                        </div>
                    </div>
                </AppTooltip>
            </div>
        </div>

        <div class="px-3 py-5 flex flex-col items-center">
            <h2 class="text-sm leading-6 font-semibold text-gray-100">
                <span v-if="item.attributes">{{ item.cluster + item.subzone + ' #' + item.id }}</span>
                <span v-else>{{ item.name }}</span>
            </h2>
            <div v-if="item.coordinates" class="text-sm flex items-center font-medium text-gray-300 mt-1 space-x-3">
                <span>{{ item.coordinates }}</span>
            </div>
        </div>

        <slot v-if="$slots.additionalDetails" name="additionalDetails" v-bind="{ item }" />
    </div>
</template>

<script lang="ts" setup>
    import { RouteLocationRaw, useRouter } from 'vue-router';
    import type { IParcelBase } from '@/types/Parcel.types';
    import { computed, ref, reactive } from 'vue';
    import highTrafficIcon from '@/assets/ht-icon.png';
    import { useAccountStore } from '~/store/account';
    import { useWallet } from 'solana-wallets-vue';
    import { CollectionName } from '~/types/Collection.types';
    import parcelCollection from '@/assets/collections/heavenland-parcels.png';
    import NftService, { ImageResource } from '~/api/_services/NftService';

    const { publicKey } = useWallet();

    const accountStore = useAccountStore();
    const router = useRouter();

    const props = defineProps<{
        item: IParcelBase;
        selectable?: boolean;
        showOwnedBadge?: boolean;
        hasExtension?: boolean;
        disabled?: boolean;
        cardRedirect?: (item: IParcelBase) => RouteLocationRaw;
    }>();

    const selectableProps = 'hover:brightness-125 hover:shadow-lg cursor-pointer transition-shadow';

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const isInWallet = computed(() => {
        return (
            accountStore.tokens[CollectionName.PARCELS].fetched &&
            accountStore.tokens[CollectionName.PARCELS].data?.findIndex((p) => p.mint === props.item.mint) !== -1 &&
            props.showOwnedBadge &&
            hasConnectedWallet.value
        );
    });

    const redirectToDetail = () => {
        if (props.selectable && props.cardRedirect && !props.disabled) {
            router.push(props.cardRedirect(props.item));
        }
    };

    const getParcelsCount = computed(() => {
        return props.item.parcels?.length ?? 0;
    });

    const loaded = ref(false);

    const lazyOptions = reactive({
        src: NftService.getImage({
            address: props.item.image,
            resource: ImageResource.URL,
        }),
        lifecycle: {
            loading: () => {
                loaded.value = false;
            },
            loaded: () => {
                loaded.value = true;
            },
        },
    });
</script>

<style scoped></style>
