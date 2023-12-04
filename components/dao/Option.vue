<template>
    <div
        ref="vote"
        @click="submitVote(item.title, item.displayId, voteTitle, voteId, item.id)"
        class="rounded-lg cursor-pointer relative my-2 w-full h-full bg-gradient-to-r from-indigo-930 to-indigo-940 border-gray-500"
    >
        <div
            :class="[
                item.active && userVoteData?.votes?.counted ? 'active-item' : 'inactive-item',
                (percentage < 98.5 && screen < 820) || (percentage < 99 && screen >= 820)
                    ? 'rounded-l-lg'
                    : 'rounded-lg',
            ]"
            :style="`max-width: ${percentage}%`"
            class="absolute bg-indigo-920 rounded-tl-none rounded-tr-none bottom-0 left-0 py-2 mt- h-[calc(100%-2.5rem)] w-full"
        ></div>

        <div class="z-20 relative">
            <div class="z-10 min-h-full">
                <p
                    :class="
                        item.id === winningOptionId && voteStatus === DaoVoteStatus.FINISHED
                            ? 'from-[#0d3e247d] via-[#0d3e247d] to-indigo-940'
                            : 'from-indigo-930 to-indigo-940'
                    "
                    class="px-4 flex justify-between font-semibold relative h-10 py-2 w-full z-[20] bg-gradient-to-r rounded-t-lg rounded-b-none"
                >
                    <AppSpinner class="z-10 absolute left-4 top-2.5" v-if="fetchingData" />
                    <FontAwesomeIcon
                        v-if="item.active && !fetchingData"
                        icon="circle-check"
                        :class="item.active && item.id === winningOptionId ? 'text-green-500' : 'text-indigo-500'"
                        class="z-10 absolute left-4 top-2.5"
                    />
                    <FontAwesomeIcon
                        v-else
                        icon="circle"
                        class="text-gray-600 absolute z-10 opacity-50 left-4 top-2.5"
                    />
                    <span
                        :class="
                            item.id === winningOptionId && voteStatus === DaoVoteStatus.FINISHED && 'text-green-500'
                        "
                        class="ml-7 tracking-tight text-sm"
                    >
                        <span> {{ item.displayId }}: </span> <span>{{ item.title }}</span>
                    </span>
                    <span
                        :class="
                            item.id === winningOptionId && voteStatus === DaoVoteStatus.FINISHED && 'text-green-500'
                        "
                        class="bg-clip-text text-sm font-semibold text-white"
                    >
                        {{ percentage.toFixed(1) }} %
                    </span>
                </p>
                <p class="px-4 text-gray-300 pb-2 pt-2 mx-2 tracking-tight text-sm w-full" v-html="item.description" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row z-20 mt-3 justify-start ml-5 items-end mx-2 mb-2 relative">
            <div class="text-xs flex items-center text-gray-300 mr-6">
                <FontAwesomeIcon :icon="['fad', 'bolt']" class="h-3 w-3 mr-1.5" />
                <span class="mr-1.5">Voting power</span>
                <span class="font-semibold text-gray-300">{{ formatNumber(item.result.votingPowerSum) }} </span>
            </div>
            <div class="text-xs flex items-center text-gray-300 mr-6 md:mr-2">
                <FontAwesomeIcon :icon="['fad', 'wallet']" class="h-3 w-3 text-gray-400 mr-1.5" />
                <span class="mr-1.5">Voters</span>
                <span class="font-semibold text-gray-300">{{ formatNumber(item.result.voterCount) }} </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { formatNumber } from '@/js/formatting';
    import { computed, ref } from 'vue';
    import { API } from '@/api';
    import { DaoVoteOption, DaoVoteStatus, DaoUserVote } from '~/types/Dao.types';
    import { NotificationManager } from '@/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { Metaplex } from '~/js/metaplex';
    import { AdditionalInfo, Variant } from '~/types/Notification.types';
    import { getTxSolscanUrl } from '~/js/url';
    import { logger } from '@/plugins/logger.client';
    import { useWallet } from 'solana-wallets-vue';
    import { NotificationMessageWithVoteOptions } from '#components';

    const vote = ref(null);
    const { publicKey } = useWallet();

    const props = defineProps<{
        fetchingData: boolean;
        voteTitle: string;
        votingPower?: number;
        item: DaoVoteOption;
        anim?: boolean;
        voteId: string;
        voteStatus: DaoVoteStatus;
        winningOptionId?: string;
        percentage: number;
        userVoteData: DaoUserVote;
    }>();

    const emit = defineEmits<{
        (e: 'updateVotes'): void;
    }>();

    const submitVote = async (option: string, displayId: string, vote: string, voteId: string, optionId: string) => {
        if (props.voteStatus !== DaoVoteStatus.FINISHED && props.votingPower > 0 && publicKey.value) {
            const notification = NotificationManager.getInstance().create({
                title: NotificationTitles.DAO_SUBMIT_VOTE,
                message: {
                    component: NotificationMessageWithVoteOptions,
                    data: {
                        displayId,
                        vote,
                        option,
                    },
                },
                variant: Variant.LOADING,
            });

            try {
                const txSig = await Metaplex.getInstance().submitVote(voteId, optionId);

                notification.link = {
                    name: 'View',
                    href: getTxSolscanUrl(txSig),
                };

                notification.additionalInfo = AdditionalInfo.CONFIRMING;

                await Metaplex.getInstance().confirmTransaction(txSig);

                notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

                await API.DaoService.sendVote(publicKey.value, voteId, optionId, txSig);
                emit('updateVotes');

                notification.setSuccess('Vote has been successfully submitted');
            } catch (e) {
                logger.error(e);

                notification.setError(
                    e.code === 4001 ? 'User rejected the transaction' : 'Transaction execution failed'
                );
            }
        }
    };

    const screen = computed(() => {
        return window.screen.availWidth;
    });
</script>

<style scoped>
    .active-item {
        transition: opacity 0.5s;
    }
    .inactive-item {
        max-width: 0px;
        transition: opacity 0.5s;
    }
</style>
