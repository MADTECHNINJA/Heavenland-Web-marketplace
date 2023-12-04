<template>
    <div v-if="item">
        <p class="text-xl font-bold tracking-tight mb-3 text-center lg:text-left">{{ item.name }}</p>

        <div class="flex space-x-1 items-center mb-6 justify-center lg:justify-start">
            <p v-if="item.cname === CollectionName.PARCELS" class="text-sm font-medium text-gray-300 mr-3">
                <span>ID</span>
                <span class="font-bold ml-1.5">{{ item.id }}</span>
            </p>

            <NuxtLink :to="solscanRedirect" target="_blank">
                <div class="flex items-center text-sm text-indigo-500">
                    <AppTooltip text="View on Solscan">
                        <img :src="solscanLogo" alt="Solscan" class="h-4 w-4" />
                    </AppTooltip>
                </div>
            </NuxtLink>

            <NuxtLink v-if="item.cname === CollectionName.PARCELS" :to="explorerRedirect" target="_blank" class="ml-3">
                <div class="flex items-center text-md ml-3 text-indigo-500">
                    <AppTooltip text="View on World Explorer">
                        <FontAwesomeIcon :icon="['fad', 'globe']" />
                    </AppTooltip>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import solscanLogo from 'assets/logo/solscan.png';
    import { IParcelBase } from '~/types/Parcel.types';
    import { IStakable } from '~/types/Staking.types';
    import { CollectionName } from '~/types/Collection.types';

    const props = defineProps<{
        item: IParcelBase | IStakable;
    }>();

    const explorerUrl = import.meta.env.VITE_HL_EXPLORER_URL;

    const solscanRedirect = computed(() => {
        return `https://solscan.io/account/${props.item.mint}`;
    });

    const explorerRedirect = computed(() => {
        switch (props.item.cname) {
            case CollectionName.PARCELS:
                return `${explorerUrl}?bucket=${props.item.mint}`;

            default:
                return null;
        }
    });
</script>

<style scoped></style>
