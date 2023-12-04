<template>
    <AppAlert v-if="apiListing.error" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

    <section v-else-if="apiListing.data || isInWallet" class="rounded-lg w-full flex flex-col">
        <AppCardTitle title="Listing" icon="tags" />

        <div class="rounded-b-lg py-3 relative min-h-[100px] bg-indigo-940">
            <div v-if="!hasConnectedWallet" class="px-5 flex space-x-6 items-center">
                <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" class="h-6 w-6 text-red-600" />

                <div class="flex flex-col">
                    <p class="text-sm text-gray-400 font-semibold">Your wallet is not connected.</p>
                    <p class="text-sm text-gray-400 font-semibold mt-2">Please connect your wallet to trade.</p>
                </div>
            </div>

            <div
                v-else-if="(!isOptionBuy && !isOptionCancelListing && !isOptionListing) || loading"
                class="absolute px-5 top-1/2 left-6 -translate-y-1/2"
            >
                <AppSpinner :size="8" />
            </div>

            <div v-else-if="isOptionBuy" class="flex flex-col w-full items-center md:items-start">
                <div class="flex flex-col items-center w-full md:items-start">
                    <div class="flex px-5 items-center">
                        <p class="text-sm text-gray-400 font-semibold">This item is listed for</p>
                        <div class="flex space-x-1 items-center px-1">
                            <span class="font-semibold inline-block pt-0.5 ml-1">
                                {{ formatNumberToDecimal(apiListing.data.price) }}
                            </span>
                            <img alt="htoCurrency" :src="htoCurrency" class="h-5 inline-block" />
                        </div>
                    </div>
                </div>

                <AppBannerNotEnoughFunds v-if="!hasEnoughFunds" class="mt-3" />

                <div v-else class="px-5">
                    <AppButton
                        v-if="!buyButtonLoadingTransaction && isTransactionPending"
                        disabled
                        class="max-w-[200px] mt-3"
                        is-large
                    >
                        <AppSpinner class="mr-2" />
                        Pending...
                    </AppButton>

                    <AppButton
                        v-else
                        :disabled="isButtonDisabled"
                        class="max-w-[200px] mt-3"
                        :loading="buyButtonLoadingTransaction"
                        is-large
                        @click="buyItem"
                    >
                        Buy
                    </AppButton>
                </div>

                <div class="px-5">
                    <p v-if="!isTransactionPending" class="text-start text-sm text-gray-400 font-semibold mt-5">
                        By purchasing this item, you agree with
                        <a href="https://heavenland.io/Heavenmarket-TC.pdf" target="_blank" class="hyperlink"
                            >Terms & conditions</a
                        >.
                    </p>
                    <p v-else class="mt-5 text-sm text-gray-400 font-semibold">
                        We are processing your purchase, please wait a minute.
                    </p>
                </div>
            </div>

            <div v-else-if="isOptionListing" class="flex px-5 flex-col space-x-1">
                <p class="text-sm text-gray-400 font-normal">This item is not listed yet.</p>

                <div class="flex space-x-3 mt-6">
                    <div class="relative rounded-md shadow-sm">
                        <input
                            v-model="listPrice"
                            type="number"
                            name="price"
                            id="price"
                            min="0"
                            class="py-2.5 bg-[#07072f] appearance-none focus:ring-1 block w-full h-full pl-7 pr-12 sm:text-sm focus:ring-indigo-600 ring-1 border border-gray-400 rounded-lg"
                            placeholder="0,00"
                            @focusout="inputFocusOut"
                            @focusin="inputFocusIn"
                        />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <img alt="htoCurrency" :src="htoCurrency" class="h-5 mr-1 inline-block" />
                            <span class="text-white sm:text-sm"> HTO</span>
                        </div>
                    </div>

                    <AppButton
                        :disabled="isButtonDisabled"
                        :loading="listButtonLoading"
                        is-large
                        class="max-w-[200px]"
                        @click="listParcel"
                    >
                        List item
                    </AppButton>
                </div>

                <p class="text-sm text-gray-400 font-normal mt-6">
                    By listing this item, you agree with
                    <a href="https://heavenland.io/Heavenmarket-TC.pdf" target="_blank" class="hyperlink"
                        >Terms & conditions</a
                    >.
                </p>
            </div>

            <div v-else-if="isOptionCancelListing" class="flex px-5 flex-col space-x-1">
                <div class="flex items-center">
                    <p class="text-sm text-gray-400 font-semibold">You have listed this item for</p>
                    <div class="flex space-x-1 items-center px-1">
                        <img alt="htoCurrency" :src="htoCurrency" class="h-5 inline-block" />
                        <span class="font-semibold inline-block pt-0.5">{{
                            formatNumberToDecimal(apiListing.data.price)
                        }}</span>
                    </div>
                </div>

                <AppButton
                    :disabled="isButtonDisabled"
                    :loading="cancelListingButtonLoading"
                    is-large
                    class="max-w-[200px] mt-4"
                    :variant="ButtonVariant.DANGER"
                    @click="cancelListingParcel"
                >
                    Cancel listing
                </AppButton>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import htoCurrency from '@/assets/currency/hto.png';
    import { useRoute } from 'vue-router';
    import { buy, cancelListing, list } from '~/js/listing';
    import { ButtonVariant } from '~/types/Button.utils';
    import { useAccountStore } from '~/store/account';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';
    import { useWallet } from 'solana-wallets-vue';
    import { useBalanceStore } from '~/store/balances';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { PurchaseState } from '~/types/Activity.types';
    import * as web3 from '@solana/web3.js';
    import { CollectionName } from '~/types/Collection.types';
    import { Listing } from '~/types/Listing.types';
    import { logger } from '~/plugins/logger.client';
    import { INftBase } from '~/types/Nft.types';
    import { CollectionFactory } from '~/types/CollectionFactory.types';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { Variant } from '~/types/Notification.types';

    const inputFocusOut = () => {
        if (listPrice.value === '') {
            listPrice.value = Number(0).toFixed(2);
        } else if (parseFloat(listPrice.value) < 0.01) {
            listPrice.value = Number(0).toFixed(2);
        } else {
            listPrice.value = parseFloat(listPrice.value).toFixed(2);
        }
    };

    const inputFocusIn = () => {
        if (listPrice.value !== '') {
            if (parseFloat(listPrice.value) !== 0) {
                listPrice.value = parseFloat(listPrice.value).toString();
            } else {
                listPrice.value = '';
            }
        }
    };

    const props = defineProps<{
        fetched: boolean;
        error: boolean;
        item: INftBase;
        apiListing: DataWrapper<Listing>;
        loading: boolean;
    }>();

    const concreteListing = computed(() => {
        return CollectionFactory.typeListing(collectionId.value, props.apiListing.data);
    });

    const emits = defineEmits<{
        (eventName: 'update', finish: () => void): void;
    }>();

    const listPrice = ref(Number(0).toFixed(2));

    const { publicKey } = useWallet();
    const accountStore = useAccountStore();
    const balanceStore = useBalanceStore();
    const route = useRoute();

    const collectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const parcelId = computed(() => {
        return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    });

    const isInWallet = computed(() => {
        return accountStore.tokens[collectionId.value].data?.findIndex((p) => p.mint === parcelId.value) !== -1;
    });

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const isOptionListing = computed(() => {
        return isInWallet.value && !props.apiListing.data && accountStore.tokens[collectionId.value].fetched;
    });

    const isOptionCancelListing = computed(() => {
        return isInWallet.value && props.apiListing.data && accountStore.tokens[collectionId.value].fetched;
    });

    const isOptionBuy = computed(() => {
        return (
            (!isInWallet.value && props.apiListing.data && accountStore.tokens[collectionId.value].fetched) ||
            isTransactionPending.value
        );
    });

    const cancelListingButtonLoading = ref(false);
    const listButtonLoading = ref(false);
    const buyButtonLoadingTransaction = ref(false);

    const hasEnoughFunds = computed(() => {
        return !(balanceStore.balanceHto.data / web3.LAMPORTS_PER_SOL < props.apiListing.data.price);
    });

    const isButtonDisabled = computed(() => {
        if (isOptionListing.value) {
            return parseFloat(listPrice.value) <= 0 || !parseFloat(listPrice.value);
        } else if (isOptionBuy.value) {
            return !hasEnoughFunds.value;
        } else {
            return false;
        }
    });

    const listParcel = async () => {
        listButtonLoading.value = true;

        try {
            const { finish } = await list(props.item.mint, props.item.name, parseFloat(listPrice.value));

            listPrice.value = (0).toFixed(2);

            emits('update', () => {
                listButtonLoading.value = false;
                finish();
            });
        } catch (e) {
            logger.error(e);

            NotificationManager.getInstance().create({
                title: 'Error',
                variant: Variant.ERROR,
                message: 'An error occurred while listing this NFT',
            });

            listButtonLoading.value = false;
        }
    };

    const cancelListingParcel = async () => {
        cancelListingButtonLoading.value = true;

        try {
            const { finish } = await cancelListing(
                props.apiListing.data,
                concreteListing.value.nft.name,
                concreteListing.value.nft
            );

            emits('update', () => {
                cancelListingButtonLoading.value = false;
                finish();
            });
        } catch (e) {
            cancelListingButtonLoading.value = false;

            logger.error(e);
        }
    };

    const isTransactionPending = computed(() => {
        return accountStore.walletActivity.data?.items?.find(
            (p) => p.buyNow && p.purchaseState === PurchaseState.PROCESSING && p.nft.address === props.item.mint
        );
    });

    onMounted(async () => {
        if (!accountStore.walletActivity.fetched && publicKey.value) {
            await accountStore.fetchWalletActivity(publicKey.value);
        }
    });

    const buyItem = async () => {
        buyButtonLoadingTransaction.value = true;

        try {
            const { finish } = await buy(props.apiListing.data, concreteListing.value.nft);

            await balanceStore.fetchBalances();
            await balanceStore.fetchEscrowBalances();

            emits('update', () => {
                buyButtonLoadingTransaction.value = false;
                finish();
            });
        } catch (e) {
            buyButtonLoadingTransaction.value = false;

            logger.error(e);
        }
    };
</script>
<style scoped>
    input.appearance-none::-webkit-outer-spin-button,
    input.appearance-none::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
