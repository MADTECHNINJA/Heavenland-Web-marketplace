<template>
    <p class="text-sm font-semibold mt-6 tracking-normal">Cashback</p>
    <p class="text-xs mt-2 text-gray-300 mb-3">Fee discounts from your Heavenland Loyalty tokens.</p>

    <CashbackOperationOverview mini-card class="mb-1.5 max-w-xs"/>

    <AppAlert v-if="cashback.error()" small :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

    <div v-else>
        <div class="flex flex-col bg-indigo-940 bg-opacity-30 rounded-t-lg py-2 px-3.5 h-[60px]">
            <span class="text-gray-300 text-xs mb-1"> Pending </span>

            <AppSpinner v-if="!cashback.fetched()" class="mt-1" />
            <div v-else class="flex space-x-1.5">
                <img :src="htoCurrency" alt="SOL" class="h-5 rounded-full" />
                <span class="font-semibold text-sm">
                    {{ cashback.toBeClaimed() }}
                </span>
            </div>
        </div>
        <div class="flex flex-col bg-indigo-930 rounded-b-lg py-2 px-3.5 h-[60px]">
            <span class="text-gray-300 text-xs mb-1"> Claimed </span>

            <AppSpinner v-if="!cashback.fetched()" class="mt-1" />
            <div v-else class="flex space-x-1.5">
                <img :src="htoCurrency" alt="SOL" class="h-5 rounded-full" />
                <span class="font-semibold text-sm">
                    {{ cashback.claimed() }}
                </span>
            </div>
        </div>
        <div class="mt-3">
            <AppButton
                :loading="claimCashbackLoadingButton"
                :disabled="cashback.error() || !cashback.fetched() || cashback.toBeClaimed() <= 0"
                class="w-full"
                @click="claimCashback"
                >Claim
            </AppButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { mapState } from 'pinia';
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import { useTreasuryStore } from '~/store/treasury';
    import { logger } from '~/plugins/logger.client';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { AdditionalInfo, MessageParam, MessageParamType, Variant } from '~/types/Notification.types';
    import { Treasury } from '~/js/treasury';
    import { useBalanceStore } from '~/store/balances';
    import { ref } from '#imports';
    import { Metaplex } from '~/js/metaplex';
    import { getTxSolscanUrl } from '~/js/url';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { NotificationMessageWithItems } from '#components';

    const treasuryStore = useTreasuryStore();
    const balanceStore = useBalanceStore();

    const cashback = mapState(useTreasuryStore, {
        fetched: (store) => store.cashback.fetched,
        error: (store) => store.cashback.error,
        claimed: (store) => formatNumberToDecimal(store.claimedCashback),
        toBeClaimed: (store) => formatNumberToDecimal(store.toBeClaimedCashback),
    });

    const claimCashbackLoadingButton = ref(false);

    const claimCashback = async () => {
        claimCashbackLoadingButton.value = true;

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.TREASURY_CLAIM_CASHBACK,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Reward',
                            value: cashback.toBeClaimed(),
                            type: MessageParamType.HTO,
                        },
                    ] as MessageParam[],
                },
            },
            variant: Variant.LOADING,
        });

        try {
            const tx = await Treasury.getInstance().claimCashback();
            const txSig = await Metaplex.getInstance().sendTransaction(tx);

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            await treasuryStore.clearUser();
            await balanceStore.clearUser();
            await treasuryStore.fetchCashbacks();
            await balanceStore.fetchBalances();

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );

            logger.error(e);
            throw new Error(e);
        } finally {
            claimCashbackLoadingButton.value = false;
        }
    };
</script>

<style scoped></style>
