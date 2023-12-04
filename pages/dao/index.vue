<template>
    <AppContainer>
        <div class="flex flex-col lg:grid grid-cols-12 gap-x-9 gap-y-6">
            <div class="col-span-8 xl:col-span-9">
                <AppTitle>DAO</AppTitle>

                <AppDescriptionText>
                    A consortium of active stakers governs Heavenland. To vote, you must stake an NFT representing some
                    property in Heavenland, and you get voting power based on the number of staked HTOs and the period
                    of stake.
                    <br />
                    <br />

                    You submit your vote through a transaction on the Solana blockchain that costs a symbolic 0.000005
                    SOL. You can vote for a single choice, but you can change your choice whenever you want (before the
                    voting ends). Your voting power in the moment you vote is not important - deciding is your voting
                    power in the moment when the voting ends.

                    <br />
                    <br />

                    You can find more information in our
                    <a class="hyperlink" target="_blank" href="https://docs.heavenland.io/ecosystem/heavenmarket/dao"
                        >Docs</a
                    >.
                </AppDescriptionText>
            </div>
        </div>

        <div v-if="activeVotes.error() || finishedVotes.error()">
            <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
                <template #title>Failed to fetch data.</template>
                <template #desc> An error occurred with data fetch. Please refresh the page and retry.</template>
            </AppActionCard>
        </div>

        <div v-else>
            <AppSectionTitle class="mt-7 mb-4">Active votings</AppSectionTitle>
            <DaoContainerSkeleton v-if="!activeVotes.fetched()" />

            <DaoContainer
                showBanner
                v-else-if="activeVotes.data() && activeVotes.data().length"
                on-going
                :data="activeVotes.data()"
            />

            <AppActionCard v-else :type="AlertType.INFO" icon="empty-set">
                <template #title>No voting!</template>
                <template #desc>Currently, there is no voting in progress.</template>
            </AppActionCard>

            <AppSectionTitle v-if="finishedVotes?.data() && finishedVotes.data().length" class="mt-7 mb-4"
                >Finished votings</AppSectionTitle
            >

            <template v-if="finishedVotes?.fetched && finishedVotes?.data()?.length">
                <AppTable
                    @update:currentPage="pageChanged"
                    isPaginated
                    :perPage="10"
                    :allowFilter="false"
                    backend-pagination
                    :columns="columns"
                    :fetched="finishedVotes.fetched()"
                    :data="finishedVotes.data()"
                    :total="finishedVotes.totalCount()"
                    clickable
                    unavailable="No data available for this NFT."
                >
                    <template #metadata.title="{ item }">
                        <template v-if="item?.metadata.title">
                            <div class="w-2/3 md:inline ml-auto md:ml-0 md:w-full">
                                <FontAwesomeIcon
                                    v-if="item?.metadata.title"
                                    :icon="['fad', 'eye']"
                                    class="mr-2 z-99 text-indigo-500 hover:text-indigo-400 cursor-pointer"
                                />
                                {{ item?.metadata.title }}
                            </div>
                        </template>
                    </template>

                    <template #startsAt="{ item }">
                        {{ formatDateWithTime(item.startsAt, true) }}
                    </template>

                    <template #endsAt="{ item }">
                        {{ formatDateWithTime(item.endsAt, true) }}
                    </template>

                    <template #totalVotes="{ item }">
                        <span class="lg:ml-[4.75rem]"> {{ formatNumber(item.totalVotes) }}</span>
                    </template>

                    <template #winningOption.title="{ item }">
                        <div v-if="item" class="w-2/3 ml-auto md:ml-0 md:w-full">
                            {{ getWonOption(item) }}
                        </div>
                    </template>
                </AppTable>
            </template>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
    import { AlertType } from '~/types/Alert.utils';
    import { formatNumber, formatDateWithTime } from '@/js/formatting';
    import { watch, ref, onMounted } from 'vue';
    import { useDaoStore } from '@/store/dao';
    import { mapState } from 'pinia';
    import { useWallet } from 'solana-wallets-vue';
    import { QueryProvider } from '~/types/QueryProvider.types';

    const { publicKey } = useWallet();
    const daoStore = useDaoStore();
    const currentPage = ref(1);

    const columns = [
        {
            field: 'metadata.title',
            label: 'Vote',
        },

        {
            field: 'startsAt',
            label: 'Created',
        },

        {
            field: 'endsAt',
            label: 'Closed',
        },

        {
            field: 'totalVoterCount',
            label: 'Number of wallets',
        },

        {
            field: 'winningOption.title',
            label: 'Result',
        },
    ];

    const onGoingQueryProvider = new QueryProvider([['filter[status]', 'ongoing']]);
    const finishedQueryProvider = new QueryProvider([
        ['filter[status]', 'finished'],
        ['limit', '10'],
    ]);
    finishedQueryProvider.setPage(currentPage.value);

    const fetchData = async () => {
        if (publicKey.value && !userVotes.fetched()) {
            daoStore.fetchUserVotes(publicKey.value);
        }
        if (!activeVotes.fetched()) {
            daoStore.fetchVotes(onGoingQueryProvider);
        }
        if (!finishedVotes.fetched()) {
            daoStore.fetchVotes(finishedQueryProvider, true);
        }
    };

    onMounted(async () => {
        fetchData();
    });

    const getWonOption = (item) => {
        const option = item.options.find((option) => item.result.winningOptionId === option.id);
        return option.title;
    };

    const pageChanged = async (value) => {
        currentPage.value = value;
        finishedQueryProvider.setPage(currentPage.value);
        await daoStore.fetchVotes(finishedQueryProvider, true);
    };

    const userVotes = mapState(useDaoStore, {
        fetched: (store) => store.userVotes.fetched,
        clear: (store) => store.userVotes.clear(),
    });

    const activeVotes = mapState(useDaoStore, {
        fetched: (store) => store.activeVotes.fetched,
        error: (store) => store.activeVotes.error,
        data: (store) => store.activeVotes.data?.items,
    });

    const finishedVotes = mapState(useDaoStore, {
        fetched: (store) => store.finishedVotes.fetched,
        error: (store) => store.finishedVotes.error,
        data: (store) => store.finishedVotes.data?.items,
        dataCount: (store) => store.finishedVotes.data?.items?.length,
        totalCount: (store) => store.finishedVotes.data?.totalCount,
    });

    watch(publicKey, () => {
        if (publicKey.value) {
            fetchData();
        } else {
            userVotes.clear();
        }
    });
</script>

<style></style>
