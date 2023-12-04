<template>
    <div class="-space-y-14">
        <div
            class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 gap-3"
        >
            <div class="flex flex-col w-full" v-for="item in items" :key="item.mint">
                <component
                    :is="getItemComponent(item)"
                    :disabled="disabled"
                    selectable
                    :item="item"
                    :card-redirect="cardRedirect"
                    :has-extension="true"
                />

                <slot name="cardDetail" v-bind="{ item }" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { RouteLocationRaw } from 'vue-router';
    import { IStakable } from '~/types/Staking.types';
    import { CollectionName } from '~/types/Collection.types';
    import { StakingCard, StakingParcelCard, StakingMetacityCard } from '#components';

    defineProps<{
        items: IStakable[];
        disabled?: boolean;
        cardRedirect?: (item: IStakable) => RouteLocationRaw;
    }>();

    const getItemComponent = (item: IStakable) => {
        switch (item.cname) {
            case CollectionName.PARCELS:
                return StakingParcelCard;

            case CollectionName.METACITY:
                return StakingMetacityCard;

            default:
                return StakingCard;
        }
    };
</script>

<style scoped></style>
