<template>
    <div v-if="fetched && !error">
        <p class="text-xl font-bold tracking-tight mb-3 text-center lg:text-left">{{ data.name }}</p>

        <div class="flex space-x-1 items-center mb-6 justify-center lg:justify-start">
            <p v-if="displayId" class="text-sm font-medium text-gray-300 mr-3">
                <span>ID</span>
                <span class="font-bold ml-1.5">{{ data.id }}</span>
            </p>

            <NuxtLink :to="solscanRedirect" target="_blank">
                <div class="flex items-center text-sm text-indigo-500">
                    <AppTooltip text="View on Solscan">
                        <img :src="solscanLogo" alt="Solscan" class="h-4 w-4" />
                    </AppTooltip>
                </div>
            </NuxtLink>

            <NuxtLink :to="explorerRedirect" target="_blank" class="ml-3">
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
    import { CollectionName } from '~/types/Collection.types';
    import { IParcelBase } from '~/types/Parcel.types';
    import { INftBase } from '~/types/Nft.types';

    const props = defineProps<{
        data: INftBase;
        fetched: boolean;
        error: boolean;
        collection: CollectionName;
    }>();

    const explorerUrl = import.meta.env.VITE_HL_EXPLORER_URL;

    const solscanRedirect = computed(() => {
        return `https://solscan.io/account/${props.data.mint}`;
    });

    const displayId = computed(() => {
        return !(props.collection !== CollectionName.PARCELS);
    });

    const explorerRedirect = computed(() => {
        if (props.collection === CollectionName.PARCELS) {
            const listing = props.data as IParcelBase;

            return listing.isParcelBucket
                ? `${explorerUrl}?bucket=${props.data.mint}`
                : `${explorerUrl}?search=${props.data.id}`;
        }

        return `${explorerUrl}?search=${props.data.id}`;
    });
</script>

<style scoped></style>
