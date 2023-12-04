<template>
    <AppContainer>
        <div class="flex flex-col lg:grid grid-cols-12 gap-x-9 gap-y-6">
            <div class="col-span-8 xl:col-span-9">
                <AppTitle>Staking</AppTitle>

                <AppDescriptionText>
                    Staking in Heavenland is a mechanism allowing everyone to earn passive income and become part of
                    Heavenland's DAO. To stake, you need HTO tokens and Stakable NFT, which you can think of as a
                    property in Heavenland. The bigger the property, the bigger stake you can place on it. The bigger
                    the stake and the bigger the stake period, the bigger the stake reward.<br /><br />

                    Staked HTO and NFTs are held by the Staking Program, which releases them when you claim the stake
                    reward after the staking period has ended. Staked NFTs can still be utilized within Heavenland's
                    Metaverse. You can claim the stake reward anytime and even put multiple stakes on a single NFT, but
                    you must ensure that the total number of stakes per address doesn't exceed 100.<br /><br />

                    Details of staking are described in
                    <a class="hyperlink" href="https://heavenland.io/staking.pdf" target="_blank"
                        >Tokenomics - Staking</a
                    >.
                </AppDescriptionText>
            </div>

            <div class="col-span-4 xl:col-span-3">
                <StakingEventTimeline />
            </div>
        </div>

        <AppAlert v-if="globalData.error()" class="mt-9" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />
        <div v-else class="mt-9">
            <AppSectionTitle>Global statistics</AppSectionTitle>
            <StakingGlobalStats :data="globalData.data()" :fetched="globalData.fetched()" />
        </div>

        <div v-if="hasConnectedWallet && userData.hasInitializedPool()">
            <AppAlert
                v-if="globalData.error()"
                class="mt-9"
                :text="ErrorMsg.CONNECTION_ERROR"
                :type="AlertType.ERROR"
            />
            <div v-else class="mt-9">
                <AppSectionTitle>User statistics</AppSectionTitle>
                <StakingUserStats :data="globalData.data()" :fetched="globalData.fetched()" />
            </div>
        </div>

        <AppActionCard class="mt-6" v-if="!hasConnectedWallet" :type="AlertType.ERROR">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access for staking your parcels.</template>
        </AppActionCard>

        <div v-else class="mt-6">
            <AppActionCard v-if="userData.error() || globalData.error()" :type="AlertType.ERROR">
                <template #desc> An error occurred when fetching staking information </template>
            </AppActionCard>

            <AppActionCard v-else-if="!userData.fetched() || !nftInfo.fetched()" :type="AlertType.LOADING">
                <template #desc> Loading staking data. Please wait a second... </template>
            </AppActionCard>

            <StakingInitSplash v-else-if="!userData.data()" />

            <div v-else>
                <AppSectionTitle class="mb-3">Active stakes</AppSectionTitle>

                <AppClaimComponent
                    class="mb-6"
                    @claimItems="claimStakes"
                    :claim-all-button-loading="claimAllStakesButtonLoading"
                    :claim-button-loading="claimButtonLoading"
                    v-if="allStakesCount > 0"
                    :ongoing-items-count="allStakesCount"
                    :defaultAmount="claimAmount"
                    disable-picker
                    icon="coin"
                    title="Claim stakes"
                >
                    <template #claim-all>
                        <p>Claim all your rewards from finished & unfinished stakings ({{ allStakesCount }})</p>
                    </template>
                    <template #claim>
                        <p>Select number of stakes to claim<br /></p>
                    </template>
                </AppClaimComponent>

                <AppCollectionFilter
                    v-if="stakedTokens.fetched() && stakedTokens.data()?.length"
                    class="mb-6"
                    :collections="stakedCollections"
                    @change="changeStakingCollectionFilter"
                />

                <AppActionCard v-if="stakedTokens.error()" :type="AlertType.ERROR">
                    <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }} </template>
                </AppActionCard>

                <ParcelContainerSkeleton v-else-if="!stakedTokens.fetched()" />

                <StakingContainer v-else :card-redirect="cardRedirectTo" :staked-tokens="activeStakings">
                    <template #cardDetail="{ item }">
                        <ExtensionActiveStakingOverview
                            :current-stake="getCurrentStakeAmount(item)"
                            :max-stake="getMaxStakeAmount(item)"
                            :reward="getStakingReward(item)"
                            :fetched="nftInfo.fetched()"
                            :error="nftInfo.error()"
                            :stakings="getStakings(item)"
                        />
                    </template>
                </StakingContainer>
            </div>

            <div v-if="hasAnyTokensToStake">
                <AppSectionTitle class="mt-6">Your NFTs</AppSectionTitle>

                <AppCollectionFilter
                    v-if="Object.values(accountStore.getStakingTokenCollections) && areAllCollectionsFetched"
                    class="mt-3 mb-6"
                    :collections="ownedCollections"
                    @change="changeIdleCollectionFilter"
                />
                <ParcelContainerSkeleton v-if="!areAllCollectionsFetched" />

                <StakingIdleContainer
                    v-else
                    :items="stakingItems"
                    :card-redirect="cardRedirectTo"
                    :disabled="!userData.data()"
                    :custom-sort="sortByMaxStakeAmount"
                >
                    <template #cardDetail="{ item }">
                        <ExtensionMaxStakingAmount
                            :disabled="!userData.data()"
                            :max-stake="getMaxStakeAmount(item)"
                            :fetched="nftInfo.fetched()"
                            :error="nftInfo.error()"
                        />
                    </template>
                </StakingIdleContainer>
            </div>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { useAccountStore } from '~/store/account';
    import { useGlobalInfo } from '~/store/staking/global';
    import { useUserInfo } from '@/store/staking/userPool';
    import { mapState } from 'pinia';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';
    import { ParcelBase } from '~/types/Parcel.types';
    import { IStakable, REWARD_TOKEN_DECIMAL } from '~/types/Staking.types';
    import { computed, ref } from 'vue';
    import { useWallet } from 'solana-wallets-vue';
    import { calculateReward } from '~/js/staking/utils';
    import { Metaplex } from '~/js/metaplex';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { AdditionalInfo, Variant } from '~/types/Notification.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { NotificationMessageWithTitle } from '#components';
    import { getTxSolscanUrl } from '~/js/url';
    import { useRefreshStakes } from '~/composables/useStake';
    import { watch, onMounted } from 'vue';
    import { Staking } from '~/js/staking';
    import { formatNumberToDecimal } from '~/js/formatting';

    const claimAllStakesButtonLoading = ref(false);
    const claimButtonLoading = ref(false);

    const claimAmount = ref(1);
    const accountStore = useAccountStore();

    const areAllCollectionsFetched = computed(() => {
        return Object.values(accountStore.getStakingTokenCollections).every((sc) => sc.fetched);
    });

    const hasAnyTokensToStake = computed(() => {
        for (const tokens of Object.values(accountStore.getStakingTokenCollections)) {
            if (tokens.data?.length) {
                return true;
            }
        }

        return false;
    });

    const stakingCollection = ref(Object.values(accountStore.getStakingTokenCollections));

    const changeIdleCollectionFilter = (cname: string) => {
        if (cname === 'all') {
            stakingCollection.value = Object.values(accountStore.getStakingTokenCollections);
        } else {
            stakingCollection.value = [accountStore.getStakingTokenCollections[cname]];
        }
    };

    const ownedCollections = computed(() => {
        const data = Object.values(accountStore.getStakingTokenCollections).reduce((acc, item) => {
            return [...acc, ...item.data];
        }, []);
        return data?.reduce((acc, item) => {
            if (!acc.includes(item.cname)) {
                acc.push(item.cname);
            }
            return acc.sort((a, b) => (a > b ? 1 : -1));
        }, []);
    });

    const stakedCollections = computed(() => {
        return stakedTokens.value?.data().reduce((acc, item) => {
            if (!acc.includes(item.cname)) {
                acc.push(item.cname);
            }
            return acc.sort((a, b) => (a > b ? 1 : -1));
        }, []);
    });

    const stakingItems = computed(() => {
        return stakingCollection.value.reduce((acc, item) => {
            return [...acc, ...item.data];
        }, []);
    });

    const globalData = computed(() => {
        return mapState(useGlobalInfo, {
            fetched: (store) => store.global.fetched,
            error: (store) => store.global.error,
            data: (store) => store.global.data,
        });
    });

    const userData = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.user.fetched,
            error: (store) => store.user.error,
            data: (store) => store.user.data,
            hasInitializedPool: (store) => store.hasInitializedPool,
            activeStakings: (store) => store.activeStakings,
        });
    });

    const stakedTokens = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.stakedTokens.fetched,
            error: (store) => store.stakedTokens.error,
            data: (store) => store.stakedTokens.data,
        });
    });

    const nftInfo = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.nftInfo.fetched,
            error: (store) => store.nftInfo.error,
            data: (store) => store.nftInfo.data,
        });
    });

    const activeStakingsFilter = ref('all');
    const activeStakings = computed(() => {
        if (activeStakingsFilter.value === 'all') {
            return stakedTokens.value.data();
        } else {
            return stakedTokens.value.data()?.filter((p) => p.cname === activeStakingsFilter.value);
        }
    });

    const changeStakingCollectionFilter = (cname: string) => {
        activeStakingsFilter.value = cname;
    };

    const allStakesCount = computed(() => {
        let allStakes = 0;

        for (const mintId in userData.value.activeStakings().data) {
            const activeStaking = userData.value.activeStakings().data?.[mintId];
            allStakes += activeStaking?.stakings?.length ?? 0;
        }

        return allStakes;
    });

    const ongoingStakesCount = computed(() => {
        const now = Math.floor(Date.now() / 1000);
        let ongoingStakes = 0;
        for (const mintId in userData.value.activeStakings().data) {
            const activeStaking = userData.value.activeStakings().data[mintId];
            ongoingStakes += activeStaking.stakings.filter((s) => s.endTime > now).length;
        }
        return ongoingStakes;
    });

    const setDefaultClaimAmount = (value: number) => {
        if (value < 5 && !claimButtonLoading.value) {
            claimAmount.value = value;
        } else if (!claimButtonLoading.value) {
            claimAmount.value = 5;
        }
    };

    onMounted(() => {
        if (userData.value.activeStakings()) {
            setDefaultClaimAmount(ongoingStakesCount.value);
        }
    });

    watch(userData.value.activeStakings(), () => {
        setDefaultClaimAmount(ongoingStakesCount.value);
    });

    const claimStakes = async () => {
        claimAllStakesButtonLoading.value = true;

        const allStakes = userData.value.activeStakings().data;
        let totalValueClaimed = 0;

        for (const mint in allStakes) {
            totalValueClaimed += allStakes[mint].earned;
        }

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.STAKE_CLAIM_MULTIPLE,
            variant: Variant.LOADING,
            message: {
                component: NotificationMessageWithTitle,
                data: {
                    amountPrefix: 'Total reward of',
                    amount: '~' + formatNumberToDecimal(totalValueClaimed),
                    displayCurrency: true,
                },
            },
        });

        if (!notification) {
            return;
        }

        try {
            const txSig = await Staking.getInstance().claimAllRewards();

            notification!.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            await useRefreshStakes();

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e: any) {
            notification?.setError(e.code === 4001 ? 'User rejected the transaction' : 'Transaction execution failed');
        } finally {
            claimAllStakesButtonLoading.value = false;
        }
    };

    const { publicKey } = useWallet();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const cardRedirectTo = (item: ParcelBase) => {
        return {
            name: 'staking-id',
            params: { id: item.mint },
        };
    };

    const userInfoStore = useUserInfo();
    const globalInfoStore = useGlobalInfo();

    const sortByMaxStakeAmount = (a: IStakable, b: IStakable) => {
        const aMaxStake = getMaxStakeAmount(a) ?? 0;
        const bMaxStake = getMaxStakeAmount(b) ?? 0;

        if (Number.isNaN(aMaxStake)) {
            return 1;
        } else if (Number.isNaN(bMaxStake)) {
            return -1;
        }

        return aMaxStake > bMaxStake ? -1 : 1;
    };

    const getCurrentStakeAmount = (item: IStakable) => {
        return userInfoStore.activeStakings.data?.[item.mint]?.stakedAmount / REWARD_TOKEN_DECIMAL ?? 0;
    };

    const getMaxStakeAmount = (item: IStakable) => {
        return nftInfo.value.data()?.find((n) => n.tokenAddress === item.mint)?.nftConst * globalInfoStore.cHL;
    };

    const getStakings = (item: IStakable) => {
        return userInfoStore.activeStakings.data?.[item.mint]?.stakings;
    };

    const getStakingReward = (parcel: IStakable) => {
        const activeStaking = userInfoStore.activeStakings.data?.[parcel.mint];
        const now = Math.floor(Date.now() / 1000);

        const totalPendingReward = activeStaking.stakings.reduce((acc, staking) => {
            return (
                acc +
                calculateReward(
                    staking.tier,
                    globalData.value.data()?.htoReleaseRate,
                    globalData.value.data()?.totalRewardSum,
                    staking.stakedTime,
                    staking.claimedTime,
                    staking.amount,
                    now
                )
            );
        }, 0);

        return totalPendingReward ?? 0;
    };
</script>

<style scoped></style>
