<template>
    <component :is="listingComponent" selectable :item="listing.nft" has-extension :show-owned-badge="true" />

    <div class="bg-indigo-920 text-white rounded-b-md text-xs justify-center flex items-center px-3 mb-1 py-2.5">
        Price <span class="font-bold ml-1 mr-1">{{ formatNumberToDecimal(listing.price) }}</span>
        <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { computed } from 'vue';
    import { CollectionName } from '~/types/Collection.types';
    import { ParcelCard, NftCard } from '#components';
    import { formatNumberToDecimal } from '~/js/formatting';

    const props = defineProps<{
        collection: CollectionName;
        listing: any;
    }>();

    const listingComponent = computed(() => {
        switch (props.collection) {
            case CollectionName.PARCELS:
                return ParcelCard;

            default:
                return NftCard;
        }
    });
</script>

<style scoped></style>
