<template>
    <NuxtLink :to="'/dao/' + data.id">
        <ul class="hover:brightness-125 relative rounded-lg h-full" role="list">
            <li
                :class="userVote && 'rounded-b-xl'"
                class="col-span-1 flex h-full items-stretch transition-all bg-indigo-940 rounded-lg relative overflow-hidden shadow"
            >
                <div
                    :class="!showBanner ? 'py-5' : 'pt-5 pb-9'"
                    class="flex relative w-full rounded-lg items-stretch h-full justify-center overflow-hidden px-8"
                >
                    <div :class="showBanner && ' mb-[20px]'" class="z-[15]">
                        <div class="w-full flex items-center justify-between px-8 pb-4 space-x-6">
                            <div class="flex-1">
                                <div class="flex items-center justify-center space-x-3">
                                    <h3 class="font-semibold tracking-tight text-center">{{ data.metadata.title }}</h3>
                                </div>
                                <p class="mt-3 text-gray-400 tracking-tight text-sm lg:w-[300px] text-center">
                                    {{ data.metadata.question }}
                                </p>
                            </div>
                        </div>

                        <div class="flex-col flex items-center">
                            <AppCountdown class="font-bold mb-2" v-if="onGoing" :futureDate="data.endsAt" />

                            <div v-else-if="data.winningOption" class="flex flex-col mb-3 items-center text-sm">
                                <span class="font-semibold mt-1 bg-clip-text tracking-tight text-green-500 text-sm">{{
                                    data.winningOption.title
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="absolute left-0 top-0 w-full z-10 bottom-0 rounded-lg bg-gradient-to-r from-indigo-930 via-indigo-930 to-[#04042381]"
                    ></div>

                    <img
                        v-if="data.metadata?.images?.preview"
                        class="absolute bottom-0 top-0 z-[9] right-0 h-full rounded-lg object-fill opacity-50 md:object-cover"
                        :src="data.metadata.images.preview"
                    />
                </div>
            </li>
            <div
                v-if="showBanner"
                class="flex flex-col py-2 mt-1 w-full h-14 z-[10] from-[#00154070] absolute bottom-0 left-0 bg-gradient-to-r to-indigo-940 rounded-b-xl items-center justify-center"
            >
                <span class="text-xs text-center py-2.5 tracking-tight text-gray-300" v-if="!hasConnectedWallet"
                    >Your wallet is not connected.</span
                >
                <template v-else>
                    <span v-if="userVote" class="text-xs text-center text-gray-400">Your vote</span>
                    <span
                        class="text-xs text-center py-2.5 tracking-tight text-gray-300"
                        v-else-if="!userVote && data.status === DaoVoteStatus.ONGOING"
                        >You haven't voted yet.</span
                    >
                    <span class="text-xs text-center py-2.5 text-gray-300" v-else>You didn't vote.</span>
                    <div class="flex items-center mt-0.5">
                        <span class="text-sm text-gray-300 font-semibold" v-if="userVote?.title">{{
                            userVote.title
                        }}</span>
                    </div>
                </template>
            </div>
        </ul>
    </NuxtLink>
</template>

<script setup lang="ts">
    import { DaoVote, DaoUserVote, DaoVoteOption, DaoVoteStatus } from '~~/types/Dao.types';
    import { computed } from 'vue';
    import { useDaoStore } from '@/store/dao';
    import { mapState } from 'pinia';
    import { useWallet } from 'solana-wallets-vue';

    const { publicKey } = useWallet();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const userVotes = mapState(useDaoStore, {
        fetched: (store) => store.userVotes.fetched,
        error: (store) => store.userVotes.error,
        data: (store) => store.userVotes.data?.items,
    });

    const props = defineProps<{
        showBanner?: boolean;
        data: DaoVote;
        onGoing?: boolean;
    }>();

    const userVote = computed(() => {
        const userVote = userVotes.data()?.find((userVote: DaoUserVote) => userVote.voteId === props.data.id);
        if (userVote) {
            return props.data.options.find((option: DaoVoteOption) => option.id === userVote?.votes?.counted?.optionId);
        }
        return null;
    });
</script>

<style></style>
