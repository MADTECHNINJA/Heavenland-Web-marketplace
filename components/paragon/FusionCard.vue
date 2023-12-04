<template>
    <div
        class="relative block w-full rounded-lg text-center md:text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
        <div class="flex w-full relative flex-col justify-center aspect-square rounded-lg">
            <div class="flex items-center relative justify-center">
                <div v-if="isLoadingRunning" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3]">
                    <h2 class="text-md font-semibold text-gray-300 text-center">Loading NFT...</h2>

                    <span class="text-xs text-center animate-pulse text-white opacity-80 justify-center pb-1 flex mt-1"
                        >Fusing in progress</span
                    >

                    <AppProgressBarCountdown
                        class="mt-3"
                        :enter-time="operation.enterTime"
                        :future-time="operation.unlockTime"
                    />
                </div>

                <img
                    :src="image"
                    class="rounded-t-md z-[2] w-full h-full"
                    :class="isLoadingRunning ? 'opacity-[12%] border border-gray-400 border-opacity-60' : 'opacity-70'"
                    alt="Preview"
                />
            </div>
        </div>
        <div class="px-3 py-4 bg-indigo-930 rounded-b-lg flex items-center flex-col">
            <div class="flex items-center space-x-1.5 mb-1">
                <FontAwesomeIcon :icon="['fas', 'up-to-dotted-line']" class="h-3 w-3 mr-0.5 text-white" />
                <span class="font-bold text-sm">
                    {{ operation.type }}
                </span>
            </div>

            <ParagonOperationCardStatus :operation="operation" :is-loading-running="isLoadingRunning" />
            <div class="mb-3 mt-2 px-3 py-2 border border-gray-400 border-opacity-20 w-full rounded-md text-xs">
                <p class="text-gray-200 text-center font-bold mb-2">Main paragon mint</p>
                <div class="flex justify-center">
                    <AppMintSolscanLink :mint="operation.nftMint" />
                    <p class="font-normal text-gray-300">
                        {{ formatAddress(operation.nftMint) }}
                    </p>
                </div>
            </div>

            <div class="mb-6 px-3 py-2 border border-gray-400 border-opacity-20 w-full rounded-md text-xs">
                <p class="text-gray-200 text-center font-bold mb-2">Secondary paragons mints</p>
                <div class="flex justify-center">
                    <AppMintSolscanLink :mint="operation.nftMint1" />
                    <AppMintSolscanLink :mint="operation.nftMint2" />
                    <AppMintSolscanLink :mint="operation.nftMint3" />
                    <AppMintSolscanLink :mint="operation.nftMint4" />
                </div>
            </div>

            <div class="flex w-full">
                <AppButton
                    class="w-full"
                    :loading="claimLoading"
                    @click="claim"
                    :disabled="
                        isLoadingRunning ||
                        operation.status.toString() === OperationState[OperationState.PROCESSING] ||
                        claimLoading ||
                        claimingAll
                    "
                >
                    Claim
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Fusion, OperationState } from '~/types/Paragon.types';
    import { formatAddress } from '~/js/formatting';
    import fusionParagonAbstract from '@/assets/paragons/abstracts/Paragon_fusion_3.png';
    import { getTxSolscanUrl } from '@/js/url';
    import { onMounted, computed, ref } from 'vue';
    import { Metaplex } from '~/js/metaplex';
    import { INftBase } from '~~/types/Nft.types';
    import { DataWrapper } from '~~/types/DataWrapper.types';
    import { Paragons } from '~~/types/collections/Paragons.types';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { MessageParam, MessageParamType, AdditionalInfo, Variant } from '~/types/Notification.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { NotificationMessageWithItems } from '#components';
    import { logger } from '~/plugins/logger.client';
    import { Paragon } from '~/js/paragon';
    import { useParagonStore } from '~/store/paragon';
    import { useAccountStore } from '~/store/account';
    import { useWallet } from 'solana-wallets-vue';
    import { useBalanceStore } from '~/store/balances';

    const props = defineProps<{
        operation: Fusion;
        claimingAll: boolean;
    }>();

    const emits = defineEmits<{
        (e: 'loading', value: boolean): void;
    }>();

    const nft = ref(new DataWrapper<INftBase>());
    const claimLoading = ref(false);

    const paragonStore = useParagonStore();
    const accountStore = useAccountStore();
    const balanceStore = useBalanceStore();

    const { publicKey } = useWallet();

    const isLoadingRunning = computed(() => {
        const now = Date.now() / 1000;

        if (props.operation.status.toString() !== OperationState[OperationState.FINISHED]) {
            return false;
        } else if (props.operation.unlockTime === 0) {
            return false;
        } else if (props.operation.unlockTime <= now) {
            return false;
        }

        return true;
    });

    const fetchOperationItem = async () => {
        if (props.operation.fusion) {
            try {
                const response = await Metaplex.getInstance().retrieveRequestItems([props.operation.fusion]);

                if (response !== null && response.length) {
                    nft.value.setData(new Paragons(response[0].onChain, response[0].offChain));
                } else {
                    nft.value.setError();
                }
            } catch (e: any) {
                nft.value.setError();
            }
        }
    };

    const image = computed(() => {
        return nft.value?.data?.image &&
            !nft.value?.error &&
            props.operation.status.toString() === OperationState[OperationState.FINISHED]
            ? nft.value?.data?.image
            : fusionParagonAbstract;
    });

    onMounted(() => {
        fetchOperationItem();
    });

    const claim = async () => {
        claimLoading.value = true;
        emits('loading', true);

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.PARAGONS_CLAIM_FUSING,
            variant: Variant.LOADING,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Paragon',
                            value:
                                props.operation.status.toString() !== OperationState[OperationState.ERROR]
                                    ? props.operation.fusion
                                    : null,
                            type: MessageParamType.SOLSCAN,
                            renderFn: formatAddress,
                        },
                        {
                            entity: 'Price',
                            value:
                                props.operation.status.toString() === OperationState[OperationState.ERROR]
                                    ? props.operation.formattedDepositAmount
                                    : null,
                            type: MessageParamType.HTO,
                        },
                    ] as MessageParam[],
                },
            },
        });

        try {
            const tx = await Paragon.getInstance().claimFusion(props.operation.pda);
            const txSig = await Metaplex.getInstance().sendTransaction(tx);

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            accountStore.clearTokens();
            balanceStore.clearUser();

            await Promise.all([
                paragonStore.fetchOperations(),
                accountStore.fetchTokens(publicKey.value),
                balanceStore.fetchBalances(),
            ]);

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            logger.error(e);

            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );
        } finally {
            claimLoading.value = false;
            emits('loading', false);
        }
    };
</script>

<style scoped></style>
