<template>
    <section class="rounded-lg w-full sm:w-full md:w-full lg:w-full flex flex-col mb-5">
        <AppCardTitle title="Create stake" icon="circle-plus" />

        <div class="rounded-b-lg px-5 py-6 relative min-h-[100px] bg-indigo-940">
            <FormKit name="account" type="group">
                <template #default="{ state: { valid } }">
                    <AppLabel title="Amount" />
                    <div class="relative rounded-md shadow-sm mt-2 md:max-w-sm">
                        <FormKit
                            :type="number"
                            digits="2"
                            :validation="validation"
                            validation-visibility="dirty"
                            :validation-messages="validationMessage"
                            name="Amount"
                            v-model="stakeAmount"
                        />
                        <button
                            @click="stakeAmount = max"
                            v-show="stakeAmount < max"
                            class="absolute text-sm top-[0.55rem] md:top-[0.45rem] right-[85px] text-white bg-gradient-to-r from-indigo-800 hover:brightness-125 transition-all to-indigo-920 rounded-md px-2 py-0.5"
                        >
                            max
                        </button>
                        <div
                            class="absolute top-[0.55rem] md:top-[0.4rem] right-0 pr-3 inline-block items-center pointer-events-none"
                        >
                            <img
                                alt="htoCurrency"
                                :src="htoCurrency"
                                class="h-5 -mt-[0.15rem] md:-mt-[0.1rem] mr-1 inline-block"
                            />
                            <span class="text-white sm:text-sm"> HTO</span>
                        </div>
                    </div>

                    <AppLabel class="mt-6" title="Duration (days)" />

                    <AppHorizontalSelect
                        hint="Specify the staking duration."
                        :valid="valid && stakeAmount > 0"
                        v-model="stakeDuration"
                        :items="[30, 60, 90, 120, 150, 180]"
                    />

                    <AppButton
                        class="max-w-[200px] mt-7"
                        isLarge
                        @click="createRecord"
                        :disabled="!stakeDuration || !valid || !stakeAmount > 0"
                        :loading="isStakeButtonLoading"
                        >Stake</AppButton
                    >
                </template>
            </FormKit>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { useBalanceStore } from '@/store/balances';
    import { computed, ref } from 'vue';
    import { useUserInfo } from '~/store/staking/userPool';
    import { logger } from '~/plugins/logger.client';
    import NumberCleaveWrapper from '~/components/app/NumberCleaveWrapper.vue';
    import { createInput } from '@formkit/vue';
    import { formatNumberToDecimal, roundNumberToDecimals } from '~/js/formatting';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { AdditionalInfo, MessageParam, MessageParamType, Variant } from '~/types/Notification.types';
    import { getTxSolscanUrl } from '~/js/url';
    import { Metaplex } from '~/js/metaplex';
    import { NotificationMessageWithItems } from '#components';
    import { useRefreshStakes } from '~/composables/useStake';
    import { IParcelBase } from '~/types/Parcel.types';
    import { IStakable } from '~/types/Staking.types';

    const balanceStore = useBalanceStore();

    const props = defineProps<{
        tokenId: string;
        item: IParcelBase | IStakable;
        max: number;
        stakeRecords: Array<{
            amount: number;
            earned: number;
            start: number;
            end: number;
            lastClaimed: number;
            index: number;
        }>;
    }>();

    const number = createInput(NumberCleaveWrapper, {
        props: ['readOnly', 'digits'],
    });

    const stakeAmount = ref(null);
    const stakeDuration = ref(undefined);

    const isStakeButtonLoading = ref(false);

    const max = computed(() => {
        return props.max < balanceStore.balanceHto.getUnformattedAmount()
            ? props.max
            : roundNumberToDecimals(balanceStore.balanceHto.getUnformattedAmount());
    });

    const validation = computed(() => {
        return `number|greaterThan:0|max:${max.value}`;
    });

    const validationMessage = computed(() => {
        return {
            greaterThan: 'The value must be equal or greater than 0.',
            max: `The value must be less or equal to ${formatNumberToDecimal(max.value).toLocaleString('en-US')}.`,
        };
    });

    const userInfoStore = useUserInfo();

    const createRecord = async () => {
        isStakeButtonLoading.value = true;

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.STAKE_CREATE,
            message: {
                component: NotificationMessageWithItems,
                data: {
                    items: [
                        {
                            entity: 'Item',
                            value: props.item.name,
                        },
                        {
                            entity: 'Amount',
                            value: formatNumberToDecimal(stakeAmount.value),
                            type: MessageParamType.HTO,
                        },
                    ] as MessageParam[],
                },
            },
            variant: Variant.LOADING,
        });

        try {
            const txSig = await userInfoStore.requestStake(
                props.tokenId,
                stakeAmount.value,
                stakeDuration.value,
                props.stakeRecords.length == 0
            );

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            stakeAmount.value = null;
            stakeDuration.value = undefined;

            isStakeButtonLoading.value = false;

            await useRefreshStakes();

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            logger.error(e);

            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );

            isStakeButtonLoading.value = false;
        }
    };
</script>

<style scoped></style>
