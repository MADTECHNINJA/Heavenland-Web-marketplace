<template>
    <div
        class="flex relative md:flex-row overflow-hidden flex-col grid-cols-3 md:px-0 bg-gradient-to-r from-indigo-920 to-indigo-930 rounded-lg"
    >
        <div class="flex flex-col w-full col-span-2 px-6 md:pr-3 py-4">
            <div class="text-sm flex justify-between font-semibold">
                Staked

                <div class="flex text-md items-center">
                    <span class="font-bold ml-2 mr-1">{{ formatNumberToDecimal(stakeRecord.amount) }}</span>
                    <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
                </div>
            </div>

            <div class="flex flex-col justify-between mt-7 space-y-3 md:space-y-1">
                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>Start</span>

                    <span class="md:ml-2 mt-1 md:mt-0 font-semibold">{{ formatDateWithTime(stakeRecord.start) }}</span>
                </div>

                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>End</span>

                    <span class="md:ml-2 mt-1 md:mt-0 font-semibold">{{ formatDateWithTime(stakeRecord.end) }}</span>
                </div>

                <div class="flex justify-between text-xs flex-col md:flex-row">
                    <span>Last claim</span>

                    <span
                        v-if="stakeRecord.start === stakeRecord.lastClaimed"
                        class="md:ml-2 mt-1 md:mt-0 font-semibold"
                        >--</span
                    >
                    <span v-else class="md:ml-2 mt-1 md:mt-0 font-semibold">{{
                        formatDateWithTime(stakeRecord.lastClaimed)
                    }}</span>
                </div>
            </div>

            <div class="flex space-x-1 items-center mt-7">
                <FontAwesomeIcon class="h-3 mr-1.5" icon="timer" />
                <div class="flex items-center w-full justify-center">
                    <div class="w-full bg-h-1.5 rounded-full bg-indigo-900">
                        <div
                            class="bg-gradient-to-r h-1.5 rounded-full"
                            :style="{ width: timerStakeFinished + '%' }"
                            :class="[
                                timerStakeFinished === 100
                                    ? 'from-green-900 to-green-700'
                                    : 'from-indigo-700 to-[#b24cb6]',
                            ]"
                        />
                    </div>
                    <span class="ml-2 text-xs text-gray-200">{{ formatNumber(timerStakeFinished) }}%</span>
                </div>
            </div>
        </div>

        <div
            class="col-span-1 w-full flex-row md:flex-col text-white justify-center flex items-center px-6 md:pl-0 md:pr-6 py-4"
        >
            <img
                :src="htoCoin"
                alt="HTO Coin"
                class="absolute bottom-0 object-contain h-full -top-3 right-0 opacity-[0.15]"
            />
            <div class="relative w-full md:w-auto flex flex-col justify-between md:h-full">
                <div class="flex flex-col space-y-1.5">
                    <span class="text-sm text-gray-200 font-semibold">Estimated reward</span>

                    <div class="flex items-center">
                        <span class="font-bold text-md mr-1.5">~ {{ formattedEarnedAmount }}</span>
                        <img alt="Solana" :src="htoCurrency" class="h-5 rounded-full mb-0.5" />
                    </div>
                </div>

                <AppButton class="mt-6" @click="claimRecord(true)" :loading="isRestakeRecordButtonLoading">
                    Restake
                </AppButton>

                <AppSecondaryButton class="mt-3" @click="claimRecord(false)" :loading="isClaimRecordButtonLoading">
                    Withdraw
                </AppSecondaryButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { formatDateWithTime } from '~/js/formatting';
    import { formatNumberToDecimal, formatNumber } from '~/js/formatting';
    import htoCoin from '@/assets/hto-coin.png';
    import { logger } from '~/plugins/logger.client';
    import { computed } from 'vue';
    import { mapActions } from 'pinia';
    import { useUserInfo } from '~/store/staking/userPool';
    import { ref } from 'vue';
    import { useRouter } from '#app';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { AdditionalInfo, MessageParam, MessageParamType, Variant } from '~/types/Notification.types';
    import { getTxSolscanUrl } from '~/js/url';
    import { Metaplex } from '~/js/metaplex';
    import { NotificationMessageWithItems } from '#components';
    import { useRefreshStakes } from '~/composables/useStake';
    import { IParcelBase } from '~/types/Parcel.types';
    import { IStakable } from '~/types/Staking.types';

    const props = defineProps<{
        tokenId: string;
        stakeRecordsLength: number;
        stakeRecord: {
            amount: number;
            earned: number;
            start: number;
            end: number;
            lastClaimed: number;
            index: number;
        };
        item: IParcelBase | IStakable;
    }>();

    const router = useRouter();

    const timerStakeFinished = computed(() => {
        const now = Math.floor(Date.now());

        const stakeTimeNow = props.stakeRecord.end - now;
        const stakeTime = props.stakeRecord.end - props.stakeRecord.start;
        const stakeTimeFinished = stakeTimeNow / stakeTime;

        return now > props.stakeRecord.end ? 100 : (1 - stakeTimeFinished) * 100;
    });

    const formattedEarnedAmount = computed(() => {
        return formatNumberToDecimal(props.stakeRecord.earned);
    });

    const userStakingActions = computed(() => {
        return mapActions(useUserInfo, ['requestClaim']);
    });

    const isClaimRecordButtonLoading = ref(false);
    const isRestakeRecordButtonLoading = ref(false);

    const claimRecord = async (restake: boolean) => {
        if (restake) {
            isRestakeRecordButtonLoading.value = true;
        } else {
            isClaimRecordButtonLoading.value = true;
        }

        const notification = NotificationManager.getInstance().create({
            title: restake ? NotificationTitles.STAKE_RESTAKE : NotificationTitles.STAKE_CLAIM,
            variant: Variant.LOADING,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Item',
                            value: props.item.name,
                        },
                        {
                            entity: 'Reward',
                            value: formatNumberToDecimal(
                                (restake ? 0 : props.stakeRecord.amount) + props.stakeRecord.earned
                            ),
                            type: MessageParamType.HTO,
                        },
                    ] as MessageParam[],
                },
            },
        });

        try {
            const tx = await userStakingActions.value.requestClaim(props.tokenId, props.stakeRecord.index, restake);
            const txSig = await Metaplex.getInstance().sendTransaction(tx);

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            if (restake) {
                isRestakeRecordButtonLoading.value = false;
            } else {
                isClaimRecordButtonLoading.value = false;
            }

            if (props.stakeRecordsLength <= 1) {
                await router.push('/staking');
            }

            await useRefreshStakes();

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            logger.error(e);

            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );

            if (restake) {
                isRestakeRecordButtonLoading.value = false;
            } else {
                isClaimRecordButtonLoading.value = false;
            }
        }
    };
</script>

<style scoped></style>
