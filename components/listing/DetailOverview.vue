<template>
    <section v-if="fetched && !error" class="rounded-lg w-full flex flex-col mb-5">
        <AppCardTitle title="Details" icon="info-circle" />

        <div class="rounded-b-lg px-5 py-6 relative min-h-[100px] bg-indigo-940">
            <dl class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
                <div class="sm:col-span-1 p-3 border border-gray-700 m-1 rounded-md">
                    <dt class="text-sm font-semibold tracking-tight text-gray-200">Mint address</dt>
                    <dd class="mt-1.5 text-sm text-gray-300 flex justify-center md:justify-start">
                        <NuxtLink
                            :to="'https://solscan.io/account/' + data.mint"
                            target="_blank"
                            class="mr-2 float-left"
                        >
                            <div class="flex items-center text-sm text-indigo-500">
                                <AppTooltip text="View on Solscan">
                                    <img :src="solscanLogo" alt="Solscan" class="h-4 w-4 mt-0.5" />
                                </AppTooltip>
                            </div>
                        </NuxtLink>
                        {{ formatAddress(data.mint) }}
                    </dd>
                </div>

                <div class="sm:col-span-1 p-3 border border-gray-700 m-1 rounded-md">
                    <dt class="text-sm font-semibold tracking-tight text-gray-200">Owner</dt>
                    <dd class="mt-1.5 text-sm text-gray-300 flex justify-center md:justify-start">
                        <AppSpinner v-if="!owner.fetched" />
                        <span v-else-if="owner.error">--</span>
                        <div v-else>
                            <NuxtLink
                                :to="'https://solscan.io/account/' + owner.data"
                                target="_blank"
                                class="mr-2 float-left"
                            >
                                <div class="flex items-center text-sm text-indigo-500">
                                    <AppTooltip text="View on Solscan">
                                        <img :src="solscanLogo" alt="Solscan" class="h-4 w-4 mt-0.5" />
                                    </AppTooltip>
                                </div>
                            </NuxtLink>

                            <span v-if="!isWalletAddress(owner.data)">{{ formatAddress(owner.data) }}</span>
                            <span v-else class="font-bold">You</span>
                        </div>
                    </dd>
                </div>

                <div class="sm:col-span-1 p-3 border border-gray-700 m-1 rounded-md">
                    <dt class="text-sm font-semibold tracking-tight text-gray-200">Royalties</dt>
                    <dd class="mt-1.5 text-sm text-gray-300">{{ data.royalties / 100 }}%</dd>
                </div>
                <div class="sm:col-span-1 p-3 border border-gray-700 m-1 rounded-md">
                    <dt class="text-sm font-semibold tracking-tight text-gray-2<00">Fee</dt>
                    <dd class="mt-1.5 text-sm text-gray-300">2%</dd>
                </div>
            </dl>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import solscanLogo from '@/assets/logo/solscan.png';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { computed, onMounted, ref } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { useWallet } from 'solana-wallets-vue';
    import { isWalletAddress } from '~/composables/useAccount';
    import { IListable, Listing } from '~/types/Listing.types';
    import { CollectionName } from '~/types/Collection.types';
    import { useRoute } from '#app';
    import { formatAddress } from '~/js/formatting';
    import { INftBase } from '~/types/Nft.types';
    import { Metaplex } from '~/js/metaplex';

    const { publicKey } = useWallet();
    const accountStore = useAccountStore();

    const props = defineProps<{
        fetched: boolean;
        error: boolean;
        data: INftBase;
        apiListing: DataWrapper<Listing>;
    }>();

    const route = useRoute();

    const collectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const owner = ref(new DataWrapper<string>());

    const determineNftOwner = async () => {
        if ((accountStore.tokens[collectionId.value]?.data as IListable[])?.find((p) => p.mint === props.data.mint)) {
            owner.value.setData(publicKey.value.toBase58());
        } else if (props.apiListing.data?.wallet?.id) {
            owner.value.setData(props.apiListing.data.wallet.id);
        } else {
            try {
                owner.value.setData(await Metaplex.getInstance().getTokenOwner(props.data.mint));
            } catch {
                owner.value.setError();
            }
        }
    };

    onMounted(determineNftOwner);
</script>

<style scoped></style>
