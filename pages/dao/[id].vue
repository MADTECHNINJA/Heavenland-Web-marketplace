<template>
    <AppContainer>
        <div v-if="vote.error || userVotes.error()">
            <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
                <template #title>Failed to fetch data.</template>
                <template #desc> An error occurred with data fetch. Please refresh the page and retry.</template>
            </AppActionCard>
        </div>

        <div v-else>
            <AppActionCard v-if="!vote.fetched" :type="AlertType.LOADING" icon="empty-set" class="mt-6">
                <template #title>Loading voting...</template>
            </AppActionCard>

            <div v-else>
                <div
                    class="relative md:mt-5 xl:mt-0 bg-gradient-to-r rounded-lg from-indigo-940 via-indigo-940 to-indigo-930 overflow-hidden"
                >
                    <div class="mx-8">
                        <div class="relative py-6 z-[16] lg:bg-gradient-to-r from-indigo-940 to-[#04042304] lg:w-1/2">
                            <svg
                                class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 bg-clip-text text-transparent bg-gradient-to-r from-[#04042341] to-[#04042304] transform translate-x-1/2"
                                fill="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <polygon points="50,0 100,0 50,100 0,100" />
                            </svg>

                            <Popover>
                                <div class="relative pt-6 px-4 sm:px-6 lg:px-8"></div>
                            </Popover>

                            <main class="z-[17] lg:z-10 mx-auto max-w-7xl px-4">
                                <div class="sm:text-center lg:text-left">
                                    <h1 class="text-2xl tracking-tight font-bold text-white">
                                        {{ vote?.data?.metadata?.title }}
                                    </h1>

                                    <p class="mt-6 lg:text-left tracking-tight font-semibold text-gray-300">
                                        {{ vote?.data?.metadata?.subtitle }}
                                    </p>
                                    <p
                                        v-html="vote?.data?.metadata.description"
                                        class="text-gray-400 mt-4 text-sm"
                                        v-if="vote?.data?.metadata?.description"
                                    ></p>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div
                        class="absolute z-[15] lg:z-[7] left-0 top-0 w-full md:bottom-0 h-auto md:h-full bg-gradient-to-r from-indigo-940 to-[#0e073a7d] object-contain flex-shrink-0"
                    ></div>
                    <div
                        class="absolute z-[10] w-[250%] sm:w-[225%] md:w-[175%] lg:w-[150%] xl:w-[125%] 2xl:w-full bottom-0 lg:z-[5] opacity-10 md:opacity-40 lg:opacity-80 right-0"
                    >
                        <img
                            v-if="vote?.data?.metadata?.images?.fullSize"
                            :src="vote.data.metadata.images.fullSize"
                            class="h-full w-full"
                        />
                    </div>
                </div>

                <div
                    v-if="vote?.data?.status === DaoVoteStatus.FINISHED"
                    class="mb-6 flex mt-10 relative flex-col md:flex-row md:w-1/2 justify-between items-center bg-gradient-to-r from-[#005b2370] to-green-900 py-3 px-6 rounded-lg"
                >
                    <div class="flex items-start flex-col md:flex-row">
                        <FontAwesomeIcon
                            :icon="['far', 'circle-check']"
                            class="h-4 w-4 mr-3 mt-1 hidden md:block text-green-500"
                        />
                        <div class="flex flex-col text-gray-300 text-sm text-center md:text-start">
                            <div class="flex w-full justify-center md:justify-start">
                                <FontAwesomeIcon
                                    :icon="['far', 'circle-check']"
                                    class="h-4 w-4 mr-3 mt-1 text-green-500 md:hidden"
                                />
                                <p class="text-green-500 text-base font-semibold">Vote has been closed.<br /></p>
                            </div>
                            <p class="text-gray-400 text-xs">You can't participate in this vote anymore.</p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="!userVotes.fetched() && hasConnectedWallet"
                    class="mb-6 flex mt-10 relative flex-col md:flex-row md:w-1/2 justify-between items-center bg-indigo-920 bg-opacity-60 py-3 px-6 rounded-lg"
                >
                    <div class="flex items-start flex-col md:flex-row">
                        <AppSpinner class="mr-3 hidden md:block mt-1" />
                        <div class="flex flex-col text-gray-300 text-base font-semibold text-center md:text-start">
                            <div class="flex w-full justify-center md:justify-center">
                                <AppSpinner class="mr-3 md:hidden md:mt-0.5" />
                                <p class="text-center">Loading wallet…<br /></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="!hasConnectedWallet && vote?.data?.status === DaoVoteStatus.ONGOING"
                    class="mb-6 flex mt-10 relative flex-col md:flex-row md:w-1/2 justify-between items-center bg-gradient-to-r from-[#400808] to-red-900 py-3 px-6 rounded-lg"
                >
                    <div class="flex items-start flex-col md:flex-row">
                        <FontAwesomeIcon
                            :icon="['far', 'circle-xmark']"
                            class="h-4 w-4 mr-2 mt-1 hidden md:block text-red-500"
                        />
                        <div class="flex flex-col text-gray-300 text-sm text-center md:text-start">
                            <div class="flex w-full justify-center md:justify-start">
                                <FontAwesomeIcon
                                    :icon="['far', 'circle-xmark']"
                                    class="h-4 w-4 mr-3 mt-1 text-red-500 md:hidden"
                                />
                                <p class="text-red-500 text-base font-semibold">Wallet not connected.<br /></p>
                            </div>
                            <p class="text-gray-400 text-xs mt-0.5">
                                You have to connect your wallet to participate in this vote.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="
                        hasConnectedWallet &&
                        userVotes.data()?.currentVotingPower <= 0 &&
                        vote?.data?.status === DaoVoteStatus.ONGOING
                    "
                    class="mb-6 flex mt-10 relative flex-col md:flex-row md:w-1/2 justify-between items-center bg-gradient-to-r from-[#400808] to-red-900 py-3 px-6 rounded-lg"
                >
                    <div class="flex items-start flex-col md:flex-row">
                        <FontAwesomeIcon
                            :icon="['far', 'circle-xmark']"
                            class="h-4 w-4 mr-2 mt-1 hidden md:block text-red-500"
                        />
                        <div class="flex flex-col text-gray-300 text-sm text-center md:text-start">
                            <div class="flex w-full justify-center md:justify-start">
                                <FontAwesomeIcon
                                    :icon="['far', 'circle-xmark']"
                                    class="h-4 w-4 mr-3 mt-1 text-red-500 md:hidden"
                                />
                                <p class="text-red-500 text-base font-semibold">No voting power<br /></p>
                            </div>
                            <p class="text-gray-400 text-xs mt-0.5">
                                Only wallets with active stakings can participate in this vote.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="userVoteData?.votes?.toBeCounted && vote?.data?.status === DaoVoteStatus.ONGOING"
                    class="mb-6 flex mt-10 relative flex-col md:flex-row md:w-1/2 justify-between items-center bg-indigo-920 bg-opacity-60 py-3 px-6 rounded-lg"
                >
                    <div class="flex items-start flex-col md:flex-row">
                        <AppSpinner class="mr-3 hidden md:block mt-0.5" />
                        <div class="flex flex-col text-gray-300 text-base font-semibold text-center md:text-start">
                            <div class="flex w-full justify-center md:justify-start">
                                <AppSpinner class="mr-3 md:hidden md:mt-0.5" />
                                <p class="text-center">Your vote is being processed<br /></p>
                            </div>

                            <p class="mt-1 text-xs font-normal text-gray-400">
                                We are confirming the transaction associated with your wallet. It won't take long.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col lg:grid grid-cols-12 gap-x-9 gap-y-6">
                    <div class="col-span-8 xl:col-span-9">
                        <AppSectionTitle
                            :class="
                                vote?.data?.status !== DaoVoteStatus.FINISHED && !userVoteData?.votes?.toBeCounted
                                    ? 'mt-10'
                                    : 'mt-4'
                            "
                            class="mb-4 text-xl"
                            >{{ vote?.data?.metadata?.question }}</AppSectionTitle
                        >
                    </div>
                </div>
                <div class="flex flex-col md:flex-row">
                    <div class="flex flex-col md:w-1/2">
                        <DaoOption
                            @updateVotes="fetchData(true)"
                            :percentage="
                                item.result.voterCount > 0
                                    ? (item.result.votingPowerSum / vote.data.totalVotingPower) * 100
                                    : 0
                            "
                            class="mt-4"
                            :winningOptionId="vote?.data?.result?.winningOptionId"
                            @click="selectAnswer(item.id)"
                            :votingPower="userVotes.data()?.currentVotingPower"
                            :item="item"
                            :voteTitle="vote?.data?.metadata?.title"
                            :userVoteData="userVoteData"
                            :fetchingData="fetchingData"
                            :voteId="vote?.data?.id"
                            :voteStatus="vote?.data?.status"
                            v-for="item in vote?.data?.options"
                            :key="item.id"
                        />
                    </div>
                    <div>
                        <div
                            id="stats"
                            class="from-[#00154070] relative to-indigo-920 bg-gradient-to-r mt-5 md:mt-4 md:ml-10 px-6 py-4 h-fit rounded-lg"
                        >
                            <div class="w-full md:pr-12 lg:pr-52 text-sm">
                                <h3 class="font-bold mb-4 tracking-tight text-sm">Voting stats</h3>

                                <div class="flex items-center">
                                    <p class="mr-2 text-xs flex justify-center md:justify-start items-center">
                                        <FontAwesomeIcon :icon="['fad', 'square-bolt']" class="h-4 w-4 mr-1.5" />
                                        <span class="text-center md:text-left"> Total voting power </span>
                                    </p>
                                    <p v-if="vote?.data?.totalVotingPower" class="font-semibold text-xs">
                                        {{ formatNumber(vote?.data?.totalVotingPower) }}
                                    </p>
                                </div>

                                <div class="w-full text-sm flex items-center mt-2">
                                    <p class="mr-2 flex items-center justify-center md:justify-start text-xs">
                                        <FontAwesomeIcon
                                            :icon="['fad', 'wallet']"
                                            class="h-4 w-4 text-gray-300 mr-1.5"
                                        />
                                        <span class="text-center md:text-left"> Total voters </span>
                                    </p>
                                    <p class="font-semibold text-xs" v-if="vote?.data?.totalVoterCount">
                                        {{ formatNumber(vote?.data?.totalVoterCount) }}
                                    </p>
                                </div>
                                <div
                                    v-if="vote.data.status !== DaoVoteStatus.FINISHED"
                                    class="absolute left-0 right-0 bottom-0 h-0.5 bg-indigo-600 transition-all rounded-full"
                                    :style="{ width: (fetchCountdown / TIMER_INIT) * 100 + '%' }"
                                />
                                <p v-if="vote.data.status !== DaoVoteStatus.FINISHED" class="flex text-sm pt-2 md:mt-3">
                                    <FontAwesomeIcon
                                        :icon="['fad', 'arrows-rotate']"
                                        class="h-3.5 pt-0.5 w-3.5 text-gray-300 mr-1.5"
                                    />

                                    <span class="mr-2 text-xs min-w-fit text-gray-300">Stats will update in</span>
                                    <span class="font-semibold text-left w-[100px] text-xs"
                                        >{{ fetchCountdown }} seconds</span
                                    >
                                </p>
                            </div>
                        </div>
                        <div
                            v-if="hasConnectedWallet && userVotes.data()?.currentVotingPower"
                            id="wallet"
                            class="from-[#00154070] to-indigo-920 bg-gradient-to-r mt-5 md:mt-4 md:ml-10 px-6 py-4 h-fit rounded-lg"
                        >
                            <div class="w-full md:pr-12 lg:pr-52 text-sm">
                                <h3 class="font-bold mb-4 tracking-tight text-sm">Wallet stats</h3>

                                <div class="w-full text-sm flex items-center mt-2">
                                    <p class="mr-2 flex items-center justify-center md:justify-start text-xs">
                                        <FontAwesomeIcon :icon="['fad', 'bolt']" class="h-4 w-4 text-gray-300 mr-1.5" />
                                        <span class="text-center md:text-left"> Your voting power</span>
                                    </p>
                                    <p class="font-semibold text-xs">
                                        {{ formatNumber(userVotes.data()?.currentVotingPower) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
    import { useRoute } from '#app';
    import { formatNumber } from '@/js/formatting';
    import { API } from '@/api';
    import { DataWrapper } from '@/types/DataWrapper.types';
    import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
    import type { Ref } from 'vue';
    import { DaoVoteStatus, DaoVote, DaoUserVote } from '~~/types/Dao.types';
    import { AlertType } from '~/types/Alert.utils';
    import { useWallet } from 'solana-wallets-vue';
    import { useDaoStore } from '@/store/dao';
    import { mapState } from 'pinia';
    import { useRouter } from '#app';

    const router = useRouter();

    const TIMER_INIT = 30;
    const fetchCountdown = ref(TIMER_INIT);
    const interval = ref(null);
    const fetchingData = ref(false);

    const vote = ref(new DataWrapper<DaoVote>());
    const userVoteData: Ref<DaoUserVote> = ref(null);

    const { publicKey } = useWallet();
    const daoStore = useDaoStore();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const clearFetching = () => {
        if (interval.value) {
            clearInterval(interval.value);
            interval.value = null;
        }
    };

    function initFetching() {
        fetchCountdown.value = TIMER_INIT;

        interval.value = setInterval(() => {
            fetchCountdown.value--;

            if (fetchCountdown.value === 0) {
                fetchCountdown.value = TIMER_INIT;
                fetchData(true);
            }
        }, 1000);
    }

    onUnmounted(() => {
        clearFetching();
    });

    const userVotes = mapState(useDaoStore, {
        fetched: (store) => store.userVotes.fetched,
        error: (store) => store.userVotes.error,
        data: (store) => store.userVotes.data,
        clear: (store) => store.userVotes.clear(),
    });

    const selectDefaultOption = () => {
        const userVote = userVotes.data()?.items.find((item) => item.voteId === currentRoute.params.id);
        if (userVote) {
            userVoteData.value = userVote;
            if (userVote.votes.toBeCounted) {
                selectAnswer(userVote.votes.toBeCounted.optionId, true); // test next vote
            } else if (userVote.votes.counted) {
                selectAnswer(userVote.votes.counted.optionId, true); // test next vote
            }
        }
    };

    const fetchData = async (update = false) => {
        fetchingData.value = true;
        if (!vote.value.fetched || update) {
            const id = currentRoute.params.id;
            try {
                const resp = await API.DaoService.getVote(id);
                vote.value.setData(resp);
            } catch (e: any) {
                if (e.status === 404) {
                    router.push('/404');
                }
                throw e;
            }
        }

        if (hasConnectedWallet.value) {
            await daoStore.fetchUserVotes(publicKey.value);
        }
        fetchingData.value = false;
        selectDefaultOption();
    };

    onMounted(async () => {
        userVotes.clear();
        if (!vote.value.fetched) {
            fetchData();
        }

        if (!interval.value && vote?.value?.data?.status !== DaoVoteStatus.FINISHED) {
            initFetching();
        }
    });

    watch(publicKey, () => {
        if (!publicKey.value) {
            userVotes.clear();
            selectAnswer(null, true);
        } else {
            fetchData();
        }
    });

    const currentRoute = useRoute();

    const selectAnswer = (id = null, setDefault = false) => {
        if (setDefault) {
            vote.value.data.options.forEach((item) => {
                item.active = false;
            });
        }
        if (id) {
            if (setDefault && userVotes.data()?.currentVotingPower > 0 && publicKey.value) {
                vote.value.data.options.map((item) => {
                    item.id === id && !item.active ? (item.active = true) : (item.active = false);
                });
            }
        }
    };
</script>

<style></style>
