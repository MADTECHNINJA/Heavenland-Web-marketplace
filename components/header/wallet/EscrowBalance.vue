<template>
    <div v-if="escrowHtoFailedAmount > 0" class="mt-6">
        <p class="text-sm font-semibold tracking-normal">Escrow balance</p>

        <p class="text-xs mt-2 mb-3">
            These are your funds from failed offers. Feel free to withdraw them to your connected wallet.
        </p>

        <AppAlert v-if="balanceStore.escrowHto.error" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

        <div v-else class="flex justify-between items-center bg-indigo-930 rounded-lg py-2 px-3.5 h-[60px]">
            <div class="flex flex-col">
                <span class="text-gray-200 text-xs mb-1"> To withdraw </span>

                <AppSpinner v-if="withdrawButtonLoading" class="mt-1" />

                <div v-else class="flex items-center">
                    <img :src="htoCurrency" alt="SOL" class="h-5 rounded-full" />
                    <span class="ml-2 font-semibold text-sm">
                        {{ escrowHtoFailedAmount }}
                    </span>
                </div>
            </div>

            <AppTooltip v-if="!withdrawButtonLoading" :text="'Withdraw ' + escrowHtoFailedAmount + ' HTO'">
                <FontAwesomeIcon
                    @click="withdraw"
                    icon="arrow-up"
                    class="cursor-pointer mt-1 h-4 w-4 text-gray-200 bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-full p-1"
                />
            </AppTooltip>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useBalanceStore } from '~/store/balances';
    import { useAccountStore } from '~/store/account';
    import { computed, ref } from 'vue';
    import { Metaplex } from '~/js/metaplex';
    import htoCurrency from '@/assets/currency/hto.png';
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import { NotificationTitles } from '~/types/Notification.data';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { AdditionalInfo, MessageParam, MessageParamType, Variant } from '~/types/Notification.types';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { getTxSolscanUrl } from '~/js/url';
    //import { NotificationMessageWithItems } from '#components';

    const balanceStore = useBalanceStore();
    const accountStore = useAccountStore();

    const escrowHtoFailedAmount = computed(() => {
        return balanceStore.escrowHto.getUnformattedAmount() - accountStore.escrowProcessingAmount;
    });

    const withdrawButtonLoading = ref(false);

    const withdraw = async () => {
        withdrawButtonLoading.value = true;

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.AH_ESCROW_WITHDRAWAL,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Reward',
                            value: formatNumberToDecimal(escrowHtoFailedAmount.value),
                            type: MessageParamType.HTO,
                        },
                    ] as MessageParam[],
                },
            },
            variant: Variant.LOADING,
        });

        try {
            const txSig = await Metaplex.getInstance().auctionHouse.withdraw(escrowHtoFailedAmount.value);

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            await balanceStore.fetchBalances();
            await balanceStore.fetchEscrowBalances();

            withdrawButtonLoading.value = false;

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );

            withdrawButtonLoading.value = false;
        }
    };
</script>

<style scoped></style>
