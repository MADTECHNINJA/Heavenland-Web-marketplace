<template>
    <AppActionCard v-if="!stakedTokens.length" :type="AlertType.INFO" icon="coin-vertical" icon-set="fad">
        <template #title>No active stakes!</template>
        <template #desc>
            There are no active stakes associated with your wallet.<br />Begin to stake by selecting one of your parcels
            below.</template
        >
    </AppActionCard>

    <div v-else class="-space-y-14">
        <div
            class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 gap-x-3 gap-y-9"
        >
            <div class="flex flex-col w-full" v-for="item in stakedTokens" :key="item.name">
                <component
                    :is="getItemComponent(item)"
                    :item="item"
                    :card-redirect="cardRedirect"
                    selectable
                    has-extension
                />

                <slot name="cardDetail" v-bind="{ item }" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { AlertType } from '~/types/Alert.utils';
    import { RouteLocationRaw } from 'vue-router';
    import { IStakable } from '~/types/Staking.types';
    import { CollectionName } from '~/types/Collection.types';
    import { StakingParcelCard, StakingCard, StakingMetacityCard } from '#components';

    defineProps<{
        stakedTokens: IStakable[];
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
