<template>
    <AppContainer>
        <AppBackButton class="pt-4 lg:pt-0" title="Staking" :path="'/staking'" />

        <AppActionCard class="mt-6" v-if="!hasConnectedWallet" :type="AlertType.ERROR">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access for staking your parcels.</template>
        </AppActionCard>
        <template v-else>
            <AppTitle class="mb-6">Stake</AppTitle>

            <StakingDetailSkeleton v-if="!userStakingTokensData.fetched() || !userActiveStakingData.fetched()" />

            <AppActionCard
                v-else-if="userStakingTokensData.error() || userActiveStakingData.error()"
                :type="AlertType.ERROR"
            >
                <template #desc> {{ ErrorMsg.FETCHING_ERROR }} </template>
            </AppActionCard>

            <div v-else>
                <div class="flex flex-col space-x-0 lg:space-x-5 lg:flex-row justify-between">
                    <div class="relative max-w-md w-full self-center lg:self-auto rounded-lg">
                        <div
                            class="aspect-square bg-indigo-930 overflow-hidden max-w-md w-full mx-auto mb-5 lg:mb-0 rounded-lg"
                            :class="{ 'animate-pulse': !loaded }"
                        >
                            <StakingDaoNftBadge v-if="allowsDao" />
                            <img
                                v-if="itemInfo"
                                class="rounded-lg aspect-square h-full w-full"
                                v-lazy="{ src: lazyOptions.src, lifecycle: lazyOptions.lifecycle }"
                                :class="{ 'opacity-0': !loaded }"
                                :alt="itemInfo.name"
                            />
                        </div>
                        <img
                            v-if="isFrozen && loaded"
                            :src="getFrozenImage"
                            alt="Frozen NFT"
                            class="absolute top-0 left-0"
                        />
                        <span class="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span>
                    </div>

                    <div class="w-full">
                        <StakingDetailHeader :item="itemInfo" />
                        <StakingDetailLimitProgress
                            :stake-available="stakeLimitAvailable"
                            :stake-total="maxStakeAmount"
                        />

                        <StakingDetailLimitOverview :max="maxStakeAmount" :current="currentStake" />

                        <div class="mt-6">
                            <StakingDetailCreateRecord
                                :item="itemInfo"
                                :max="stakeLimitAvailable"
                                :token-id="tokenId"
                                :stake-records="stakeRecords"
                            />

                            <AppMergeStakings
                                v-if="stakeRecords.length > 1 && itemInfo"
                                :stake-records="stakeRecords"
                                :nft="itemInfo"
                            />
                        </div>
                    </div>
                </div>

                <section v-if="finishedStakingsRecords.length" class="my-6">
                    <div class="flex items-center gap-x-6 mb-6">
                        <AppSectionTitle>Finished stakings</AppSectionTitle>

                        <AppInfoTooltip title="Restake vs. Withdraw">
                            <p>When your stake has ended, you can either <b>Restake</b> or <b>Withdraw</b>.</p>
                            <br />
                            <p>In both cases, you claim your Estimated HTO Reward.</p>
                            <br />
                            <p>If you <b>Restake</b>, you create a new stake with the same parameters</p>
                            <p>as the one that has ended (staked HTO and NFT stays staked).</p>
                            <br />
                            <p>If you <b>Withdraw</b>, you get back your staked HTO, and if there is</p>
                            <p>no other stake on the underlying NFT, also the NFT.</p>
                        </AppInfoTooltip>
                    </div>

                    <StakingDetailRecordContainer :stake-records="finishedStakingsRecords">
                        <template #default="{ record }">
                            <StakingDetailFinishedRecord
                                :stake-record="record"
                                :item="itemInfo"
                                :stake-records-length="stakeRecords.length"
                                :token-id="tokenId"
                            />
                        </template>
                    </StakingDetailRecordContainer>
                </section>

                <section class="my-6">
                    <AppSectionTitle class="mb-6">Active stakings</AppSectionTitle>

                    <AppActionCard
                        v-if="!ongoingStakingsRecords.length"
                        :type="AlertType.INFO"
                        icon="coin-vertical"
                        icon-set="fad"
                    >
                        <template #title>No active stakes!</template>
                        <template #desc> There are no active stakes associated with this parcel. </template>
                    </AppActionCard>

                    <StakingDetailRecordContainer :stake-records="ongoingStakingsRecords">
                        <template #default="{ record }">
                            <StakingDetailActiveRecord :stake-record="record" :token-id="tokenId" />
                        </template>
                    </StakingDetailRecordContainer>
                </section>
            </div>
        </template>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { AlertType } from '~/types/Alert.utils';
    import frozenTypeA from 'assets/staking/frozen-type-a.png';
    import frozenTypeB from 'assets/staking/frozen-type-b.png';
    import { mapState } from 'pinia';
    import { useAccountStore } from '~/store/account';
    import { useGlobalInfo } from '~/store/staking/global';
    import { useUserInfo } from '@/store/staking/userPool';
    import { IStakable, REWARD_TOKEN_DECIMAL } from '~/types/Staking.types';
    import { computed, ComputedRef, onMounted, ref, watch } from 'vue';
    import { CollectionName } from '~/types/Collection.types';
    import { useRoute, useRouter } from '#app';
    import { ErrorMsg } from '~/locales/core';
    import { calculateReward } from '~/js/staking/utils';
    import { useWallet } from 'solana-wallets-vue';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { CollectionList } from '~/types/Collection.data';
    import NftService, { ImageResource } from '~/api/_services/NftService';

    const route = useRoute();
    const { publicKey } = useWallet();

    const tokenId = computed(() => {
        return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    });

    const allowsDao = computed(() => {
        if (!itemInfo.value?.cname) {
            return false;
        }

        return CollectionList.get(itemInfo.value?.cname)?.featureFlags?.allowDao;
    });

    const accountStore = useAccountStore();

    const userStakingData = computed(() => {
        return mapState(useUserInfo, {
            error: (store) => store.user.error,
            user: (store) => store.user,
            data: (store) => store.user.data,
            fetched: (store) => store.user.fetched,
            hasInitializedPool: (store) => store.hasInitializedPool,
        });
    });

    const userStakingTokensData = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.stakedTokens.fetched,
            error: (store) => store.stakedTokens.error,
            data: (store) => store.stakedTokens.data,
        });
    });

    const userActiveStakingData = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.activeStakings.fetched,
            error: (store) => store.activeStakings.error,
            data: (store) => store.activeStakings.data,
        });
    });

    const globalData = computed(() => {
        return mapState(useGlobalInfo, {
            fetched: (store) => store.global.fetched,
            error: (store) => store.global.error,
            data: (store) => store.global.data,
            cHL: (store) => store.cHL,
        });
    });

    const nftInfo = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.nftInfo.fetched,
            error: (store) => store.nftInfo.error,
            data: (store) => store.nftInfo.data,
        });
    });

    const getFrozenImage = computed(() => {
        switch (itemInfo.value?.cname) {
            case CollectionName.SOLAMIDS:
                return frozenTypeB;

            default:
                return frozenTypeA;
        }
    });

    const maxStakeAmount = computed(() => {
        return nftInfo.value.data()?.find((n) => n.tokenAddress === tokenId.value)?.nftConst * globalData.value.cHL();
    });

    const isFrozen = computed(() => {
        return stakingInfo.value.stakedAmount > 0;
    });

    const itemInfo: ComputedRef<IStakable | null> = computed(() => {
        let itemInfo = userStakingTokensData.value.data()?.find((st) => st.mint === tokenId.value) as IStakable;

        if (!itemInfo) {
            for (const index in accountStore.getStakingTokenCollections) {
                const collection = accountStore.getStakingTokenCollections[index];
                const collectionItem = collection.data?.find((p) => p.mint == tokenId.value) as IStakable;

                if (collectionItem) {
                    itemInfo = collectionItem;
                    break;
                }
            }
        }

        return itemInfo ?? null;
    });

    const stakingInfo = computed(() => {
        let stakingInfo = {
            stakedAmount: 0,
            stakings: [],
        };

        if (userActiveStakingData.value.data()?.[tokenId.value]) {
            stakingInfo = userActiveStakingData.value.data()[tokenId.value];
        }

        return stakingInfo;
    });

    const currentStake = computed(() => stakingInfo.value.stakedAmount / REWARD_TOKEN_DECIMAL);

    const stakeLimitAvailable = computed(() =>
        maxStakeAmount.value === 0 ? 0 : maxStakeAmount.value - stakingInfo.value.stakedAmount / REWARD_TOKEN_DECIMAL
    );

    const now = Math.floor(Date.now() / 1000);

    const finishedStakingsRecords = computed(() => {
        return stakeRecords.value.filter((s) => s.end <= now * 1000);
    });

    const ongoingStakingsRecords = computed(() => {
        return stakeRecords.value.filter((s) => s.end > now * 1000);
    });

    const stakeRecords: ComputedRef<
        Array<{
            amount: number;
            earned: number;
            start: number;
            end: number;
            lastClaimed: number;
            index: number;
        }>
    > = computed(() => {
        if (!stakingInfo.value) {
            return null;
        }

        return stakingInfo.value.stakings.map((info) => {
            return {
                start: info.stakedTime * 1000,
                end: info.endTime * 1000,
                lastClaimed: info.claimedTime * 1000,
                amount: info.amount / REWARD_TOKEN_DECIMAL,
                tier: info.tier,
                earned: calculateReward(
                    info.tier,
                    globalData.value.data()?.htoReleaseRate,
                    globalData.value.data()?.totalRewardSum,
                    info.stakedTime,
                    info.claimedTime,
                    info.amount,
                    now
                ),
                index: info.index,
            };
        });
    });

    const loaded = ref(false);

    const lazyOptions = computed(() => {
        return {
            src: NftService.getImage({
                address: itemInfo.value.image,
                resource: ImageResource.URL,
            }),
            lifecycle: {
                loading: () => {
                    loaded.value = false;
                },
                loaded: () => {
                    loaded.value = true;
                },
            },
        };
    });

    const router = useRouter();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const isInWallet = computed(() => {
        if (!hasConnectedWallet.value) {
            return false;
        }

        for (const cname of Object.keys(accountStore.tokens)) {
            if ((accountStore.tokens[cname] as DataWrapper<any>).data.find((i) => i.mint === route.params.id)) {
                return CollectionList.get(cname as CollectionName)?.featureFlags?.allowStaking;
            }
        }

        return false;
    });

    const isValidParcel = () => {
        if (
            !userStakingData.value.error() &&
            userStakingData.value.fetched() &&
            !userStakingData.value.data().staking.find((item) => item.mint == route.params.id) &&
            !isInWallet.value
        ) {
            router.push('/404');
        }
    };

    watch(publicKey, () => {
        if (publicKey.value) {
            isValidParcel();
        }
    });

    watch(userStakingData.value.user(), () => {
        isValidParcel();
        if (userStakingData.value.fetched() && !userStakingData.value.hasInitializedPool()) {
            router.push('/staking');
        }
    });

    onMounted(() => {
        if (userStakingData.value.fetched() && !userStakingData.value.hasInitializedPool()) {
            router.push('/staking');
        }
    });
</script>

<style scoped></style>
