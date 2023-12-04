<template>
    <AppActionCard v-if="items.dataCount() <= 0" :type="AlertType.INFO" icon="house" class="mt-6">
        <template #title>No {{ collection }}!</template>
        <template #desc> There are no {{ collection }} in your wallet.</template>
    </AppActionCard>

    <div v-else class="-space-y-14">
        <div
            class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 gap-3"
        >
            <div class="flex flex-col w-full" v-for="item in sortedItems" :key="item.name">
                <component
                    :is="itemComponent"
                    :disabled="disabled"
                    selectable
                    :item="item"
                    :show-owned-badge="showOwnedBadge"
                    :card-redirect="cardRedirect"
                    :has-extension="$slots.cardDetail !== undefined"
                />

                <slot name="cardDetail" v-bind="{ item }" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useAccountStore } from '~/store/account';
    import { AlertType } from '~/types/Alert.utils';
    import { CollectionName } from '~/types/Collection.types';
    import { mapState } from 'pinia';
    import { RouteLocationRaw } from 'vue-router';
    import { computed } from 'vue';
    import { IListable } from '~/types/Listing.types';
    import { NftCard, ParcelCard } from '#components';

    const props = defineProps<{
        disabled?: boolean;
        collection: CollectionName;
        cardRedirect?: (item: IListable) => RouteLocationRaw;
        showOwnedBadge?: boolean;
        customSort: (a: IListable, b: IListable) => -1 | 0 | 1;
    }>();

    const itemComponent = computed(() => {
        switch (props.collection) {
            case CollectionName.PARCELS:
                return ParcelCard;

            default:
                return NftCard;
        }
    });

    const sortedItems = computed(() => {
        return props.customSort && items.dataCount()
            ? items.data().sort((a, b) => props.customSort(a, b))
            : items.data();
    });

    const items = mapState(useAccountStore, {
        data: (store) => store.tokens[props.collection].data,
        dataCount: (store) => store.tokens[props.collection].data?.length,
    });
</script>

<style scoped></style>
