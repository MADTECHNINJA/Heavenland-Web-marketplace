<template>
    <section class="bg-indigo-940 shadow rounded-lg w-full" v-if="parcelBucket.parcels">
        <AppCardTitle title="Parcel bucket content" icon="layer-group" />

        <div class="rounded-b-lg px-5 py-6 relative min-h-[100px] bg-indigo-940">
            <p class="text-sm text-gray-300">This bucket contains {{ parcelBucket.parcels.length }} parcels.</p>

            <AppAlert v-if="items.error" :type="AlertType.ERROR" :text="ErrorMsg.FETCHING_ERROR" />

            <div v-else-if="!items.fetched" class="app-parcels-container">
                <ParcelCardSkeleton v-for="i in parcelBucket.parcels.length" :key="i" />
            </div>

            <div v-else class="app-parcels-container">
                <ParcelCard :item="parcel" v-for="parcel in items.data" :key="parcel.mint">
                    <template #additionalDetails="{ item }">
                        <div class="text-sm flex items-center justify-center font-medium text-gray-300 my-2 space-x-2">
                            <NuxtLink :to="'https://solscan.io/account/' + item.mint" target="_blank">
                                <img :src="solscanLogo" alt="Solscan" class="mb-0.5 h-4 w-4 inline-block" />
                            </NuxtLink>

                            <span> {{ formatAddress(item.mint) }} </span>
                        </div>
                    </template>
                </ParcelCard>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { EParcelSymbol, Parcel, ParcelBucket } from '@/types/Parcel.types';
    import type { IParcelBase } from '@/types/Parcel.types';
    import { Metaplex } from '@/js/metaplex';
    import { DataWrapper } from '@/types/DataWrapper.types';
    import { ErrorMsg } from '@/locales/core';
    import { onMounted } from 'vue';
    import { formatAddress } from '~/js/formatting';
    import solscanLogo from '@/assets/logo/solscan.png';
    import { INftBase } from '~/types/Nft.types';
    import { computed, ref } from 'vue';
    import { AlertType } from '~/types/Alert.utils';

    const props = defineProps<{
        parcelBucket: INftBase;
    }>();

    const parcelBucket = computed(() => {
        return props.parcelBucket as ParcelBucket;
    });

    const items = ref(new DataWrapper<IParcelBase[]>());

    const fetchBucketItems = async () => {
        try {
            const response = await Metaplex.getInstance().retrieveRequestItems(parcelBucket.value.parcels);

            if (response !== null) {
                const parcels: IParcelBase[] = [];

                for (const token of response) {
                    switch (token.onChain.data.symbol) {
                        case EParcelSymbol.PARCEL_BUCKET:
                            parcels.push(new ParcelBucket(token.onChain, token.offChain));
                            break;

                        default:
                            parcels.push(new Parcel(token.onChain, token.offChain));
                    }
                }

                items.value.setData(parcels);
            } else {
                items.value.setError();
            }
        } catch (e: any) {
            items.value.setError();
        }
    };

    onMounted(() => {
        fetchBucketItems();
    });
</script>

<style scoped lang="postcss">
    .app-parcels-container {
        @apply flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mt-6 gap-3;
    }
</style>
