<template>
    <section class="mt-6" v-if="data && data.attributes">
        <AppCardTitle title="Attributes" icon="brackets-curly" />

        <div class="rounded-b-lg px-5 py-4 bg-indigo-940">
            <dl class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
                <template v-for="attribute in data.attributes" :key="attribute.displayName">
                    <div
                        v-if="!DisabledOffChainAttributes.includes(attribute.displayName)"
                        class="sm:col-span-1 p-3 border border-gray-700 m-1 rounded-md"
                    >
                        <dt class="text-sm font-semibold tracking-tight text-gray-200">
                            {{ attribute.displayName }}
                        </dt>
                        <dd v-if="attribute.displayName !== 'Parcel Mint Addresses'" class="mt-1 text-sm text-gray-300">
                            {{ attribute.value }}
                        </dd>
                        <dd
                            v-else-if="collection === CollectionName.PARCELS && isParcelBucket"
                            v-for="mintId in parcels"
                            :key="mintId"
                            class="mt-1 text-xs text-gray-300 truncate"
                        >
                            {{ mintId }}
                        </dd>
                    </div>
                </template>
            </dl>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { DisabledOffChainAttributes } from '~/js/metaplex';
    import { CollectionName } from '~/types/Collection.types';
    import { computed } from 'vue';
    import { INftBase } from '~/types/Nft.types';
    import { EParcelSymbol, ParcelBucket } from '~/types/Parcel.types';

    const props = defineProps<{
        fetched: boolean;
        error: boolean;
        data: INftBase;
        collection: CollectionName;
    }>();

    const isParcelBucket = computed(() => {
        return props.data.type === EParcelSymbol.PARCEL_BUCKET;
    });

    const parcels = computed(() => {
        return (props.data as ParcelBucket).parcels;
    });
</script>

<style scoped></style>
