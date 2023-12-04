<template>
    <div class="md:w-full 2xl:w-full">
        <AppCardTitle title="Merge stakings" icon="code-merge" />

        <div class="shadow flex flex-col bg-gradient-to-r rounded-b-lg bg-indigo-940 pt-3 pb-3">
            <div class="mx-2 col-span-4 relative z-20 md:mx-3">
                <div class="justify-center rounded-lg flex flex-col md:pl-3 md:pr-6 py-1.5">
                    <div class="leading-6 text-gray-300 text-sm text-opacity-[85%]">
                        All your existing <span class="font-semibold text-gray-200">finished & active</span> stakings
                        created on this NFT ({{ stakeRecords.length }}) can be merged into one new stake. All your
                        rewards will be immediately claimed.
                    </div>

                    <StakingDetailRecordMiniCard :stake-record="mergedStakeRecord" class="mt-4" />

                    <div class="mt-5 pb-1">
                        <AppButton :loading="mergeButtonLoading" @click="mergeStakings"> Merge</AppButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { AdditionalInfo, MessageParam, Variant } from '~/types/Notification.types';
    import { NotificationMessageWithItems } from '#components';
    import { Staking } from '~/js/staking';
    import * as web3 from '@solana/web3.js';
    import { Metaplex } from '~/js/metaplex';
    import { useRefreshStakes } from '~/composables/useStake';
    import { ref, computed } from '#imports';
    import { IStakable } from '~/types/Staking.types';

    const props = defineProps<{
        title: string;
        stakeRecords: Array<{
            amount: number;
            earned: number;
            start: number;
            end: number;
            tier: number;
            lastClaimed: number;
            index: number;
        }>;
        nft: IStakable;
    }>();

    const stakeRecordsTotalAmount = computed(() => {
        return props.stakeRecords?.reduce((acc, item) => acc + item.amount, 0);
    });

    const stakeRecordsMostFutureStartDate = computed(() => {
        return props.stakeRecords?.reduce((acc, item) => (item.start > acc ? item.start : acc), 0);
    });

    const stakeRecordsHighestTier = computed(() => {
        return props.stakeRecords?.reduce((acc, item) => (item.tier > acc ? item.tier : acc), 0);
    });

    const tierConvertedToSeconds = computed(() => {
        const basePeriod = import.meta.env.VITE_HL_STAKING_BASE_PERIOD;

        return stakeRecordsHighestTier.value * basePeriod * 1000;
    });

    const mergedStakeRecord = computed(() => {
        return {
            amount: stakeRecordsTotalAmount.value,
            start: stakeRecordsMostFutureStartDate.value,
            end: stakeRecordsMostFutureStartDate.value + tierConvertedToSeconds.value,
            lastClaimed: Date.now(),
        };
    });

    const mergeButtonLoading = ref(false);

    const mergeStakings = async () => {
        mergeButtonLoading.value = true;

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.STAKE_MERGE,
            variant: Variant.LOADING,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Item',
                            value: props.nft?.name,
                        },
                    ] as MessageParam[],
                },
            },
        });

        try {
            const txSig = await Staking.getInstance().mergeStakes(new web3.PublicKey(props.nft?.mint));

            await Metaplex.getInstance().confirmTransaction(txSig);

            if (notification) {
                notification.additionalInfo = AdditionalInfo.FETCHING_DATA;
                notification.setSuccess('Transaction successfully confirmed');
            }
            await useRefreshStakes();
        } catch (e: any) {
            notification?.setError(e.code === 4001 ? 'User rejected the transaction' : 'Transaction execution failed');
        } finally {
            mergeButtonLoading.value = false;
        }
    };
</script>

<style></style>
