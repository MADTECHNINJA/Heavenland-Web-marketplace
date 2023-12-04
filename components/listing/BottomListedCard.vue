<template>
    <div
        class="text-white rounded-b-md text-xs justify-center flex items-center px-3 mb-1 pt-2 pb-2"
        :class="[getListedItem ? 'bg-indigo-920' : 'bg-indigo-930']"
    >
        <template v-if="getListedItem"
            >Listed for <span class="font-bold ml-1 mr-1">{{ getListedItem.price }}</span>
            <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
        </template>
        <template v-else>Not listed </template>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { useAccountStore } from '~/store/account';
    import { computed, ComputedRef } from 'vue';
    import { CollectionName } from '~/types/Collection.types';
    import { Listing } from '~/types/Listing.types';

    const props = defineProps<{
        mint: string;
        collection: CollectionName;
    }>();

    const accountStore = useAccountStore();

    const getListedItem: ComputedRef<Listing | undefined> = computed(() => {
        return accountStore.listedTokens[props.collection]?.data?.items?.find((p) => props.mint === p.nft.mint);
    });
</script>

<style scoped></style>
