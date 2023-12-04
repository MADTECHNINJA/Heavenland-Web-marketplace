<template>
    <AppActionCard v-if="items.dataCount() <= 0" :type="AlertType.INFO" icon="house" class="mt-6">
        <template #title>No Parcels!</template>
        <template #desc> There are no Heavenland Parcels in your wallet.</template>
    </AppActionCard>

    <div v-else class="-space-y-14">
        <div
            class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 gap-x-3 gap-y-9"
        >
            <div class="flex flex-col w-full" v-for="item in sortedItems" :key="item.name">
                <ParcelCard
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
    import { ParcelCard } from '#components';
    import { RouteLocationRaw } from 'vue-router';
    import { IParcelBase } from '~/types/Parcel.types';
    import { ISolamidsBase } from '~/types/Solamids.types';
    import { computed } from 'vue';

    const props = defineProps<{
        collection: CollectionName;
        cardRedirect?: (item: IParcelBase) => RouteLocationRaw;
        disabled?: boolean;
        showOwnedBadge?: boolean;
        customSort: (a: ISolamidsBase, b: ISolamidsBase) => -1 | 0 | 1;
    }>();

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
