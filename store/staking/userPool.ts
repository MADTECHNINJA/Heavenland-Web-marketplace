import { defineStore } from 'pinia';
import { Staking } from '@/js/staking';
import { ActiveStaking, IStakable, REWARD_TOKEN_DECIMAL, StakingNftInfo, UserInfo } from '@/types/Staking.types';
import { BASE_STAKING_PERIOD } from '@/js/staking/types';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { ITokenMetadata, Metaplex } from '@/js/metaplex';
import * as web3 from '@solana/web3.js';
import { API } from '~/api';
import { useAccountStore } from '~/store/account';
import { calculateReward } from '~/js/staking/utils';
import { useGlobalInfo } from '~/store/staking/global';
import { formatNumberToDecimal } from '~/js/formatting';
import { CollectionFactory } from '~/types/CollectionFactory.types';
import { CollectionList } from '~/types/Collection.data';

export const useUserInfo = defineStore({
    id: 'staking-user',

    state: () => ({
        user: new DataWrapper<UserInfo>(),
        stakedTokens: new DataWrapper<IStakable[]>(),
        activeStakings: new DataWrapper<ActiveStaking>(),
        nftInfo: new DataWrapper<StakingNftInfo[]>(),
    }),

    getters: {
        hasInitializedPool: (state) => state.user.data?.owner,

        avgStakeDuration: (state) => {
            const totalStakingDuration = state.user.data.staking.reduce((acc, s) => acc + s.tier * 30, 0);

            return formatNumberToDecimal(totalStakingDuration / state.user.data.stakedCount);
        },

        finishedStakings: (state) => {
            const now = Date.now() / 1_000;

            let finishedStakesCount = 0;

            for (const mint in state.activeStakings.data) {
                const nft = state.activeStakings.data[mint];

                finishedStakesCount += nft.stakings.filter((s) => s.endTime <= now)?.length ?? 0;
            }

            return finishedStakesCount;
        },

        totalHtoStaked: (state) => {
            const userHtoStaked = state.user.data.staking.reduce((acc, s) => {
                return acc + s.amount;
            }, 0);

            return formatNumberToDecimal(userHtoStaked / REWARD_TOKEN_DECIMAL ?? 0);
        },

        totalPendingReward: (state) => {
            const globalStore = useGlobalInfo();

            const now = Date.now() / 1_000;
            const htoReleaseRate = globalStore.global.data?.htoReleaseRate;
            const totalRewardSum = globalStore.global.data?.totalRewardSum;

            if (!htoReleaseRate || !totalRewardSum) {
                return 0;
            }

            const userPendingReward = state.user.data.staking.reduce((acc, s) => {
                const reward = calculateReward(
                    s.tier,
                    htoReleaseRate,
                    totalRewardSum,
                    s.stakedTime,
                    s.claimedTime,
                    s.amount,
                    now
                );

                return acc + reward;
            }, 0);

            return formatNumberToDecimal(userPendingReward ?? 0);
        },
    },

    actions: {
        async fetchUser() {
            logger.info('[STAKING] fetchUser');

            try {
                const userData: UserInfo | null = await Staking.getInstance().fetchUserData();
                const globalData = useGlobalInfo();

                logger.info('[STAKING] fetchUser: userData', userData);

                this.user.setData(userData);

                const stakedMints: string[] = [];
                if (userData) {
                    logger.info(
                        '[STAKING] fetchUser: userData.staking',
                        userData.staking.map((data) => data.mint)
                    );

                    const activeStaking: ActiveStaking = {};
                    const now = Math.floor(Date.now() / 1000);

                    userData.staking.map((data, index) => {
                        const endTime = data.stakedTime + data.tier * BASE_STAKING_PERIOD;
                        const stakingData = {
                            amount: data.amount,
                            tier: data.tier,
                            stakedTime: data.stakedTime,
                            endTime,
                            claimedTime: data.claimedTime,
                            index,
                            earned: calculateReward(
                                data.tier,
                                globalData.global.data.htoReleaseRate,
                                globalData.global.data.totalRewardSum,
                                data.stakedTime,
                                data.claimedTime,
                                data.amount,
                                now
                            ),
                        };

                        if (!stakedMints.find((m) => m === data.mint)) {
                            stakedMints.push(data.mint);
                            activeStaking[data.mint] = {
                                stakedAmount: data.amount,
                                stakings: [stakingData],
                                earned: stakingData.earned,
                            };
                        } else {
                            activeStaking[data.mint].stakings.push(stakingData);
                            activeStaking[data.mint].stakedAmount += data.amount;
                            activeStaking[data.mint].earned += stakingData.earned;
                        }
                    });

                    logger.info('[STAKING] fetchUser: activeStakings', activeStaking);

                    const stakedTokenData = await Metaplex.getInstance().fetchStakedTokens(
                        stakedMints.map((mint) => new web3.PublicKey(mint))
                    );

                    const stakedTokenDataCasted: IStakable[] | undefined = stakedTokenData
                        ?.map((tm: ITokenMetadata) =>
                            CollectionFactory.createInstanceWithSymbol(tm.onChain.data.symbol, tm)
                        )
                        .filter((t) => CollectionList.get(t.cname)?.featureFlags?.allowStaking);

                    logger.info('[STAKING] fetchUser: stakedTokenData', stakedTokenData);

                    stakedTokenDataCasted?.sort((a, b) =>
                        activeStaking[a.mint].earned > activeStaking[b.mint].earned ? -1 : 1
                    );

                    if (stakedTokenDataCasted) {
                        this.stakedTokens.setData(stakedTokenDataCasted);
                        this.activeStakings.setData(activeStaking);
                    } else {
                        this.stakedTokens.setError();
                        this.activeStakings.setError();
                    }

                    for (const stake in this.activeStakings.data) {
                        this.activeStakings.data[stake].stakings.sort((a, b) => (a.amount > b.amount ? -1 : 1));
                    }
                }

                const accountStore = useAccountStore();

                const stakingCollectionsMints = [];

                for (const collection of Object.values(accountStore.getStakingTokenCollections)) {
                    if (collection) {
                        stakingCollectionsMints.push(
                            ...(collection as DataWrapper<IStakable[]>)?.data.map((oc) => oc.mint)
                        );
                    }
                }

                const allTokens = [...stakedMints, ...stakingCollectionsMints];

                if (allTokens.length) {
                    try {
                        const nd = await API.StakingService.findNftConstants(allTokens);

                        if (nd) {
                            this.nftInfo.setData(nd);
                        } else {
                            this.nftInfo.setError();
                        }
                    } catch (e) {
                        this.nftInfo.setError(e);
                    }
                } else {
                    this.nftInfo.setData([]);
                }
            } catch (e: any) {
                this.user.setError();
                this.activeStakings.setError();
                this.stakedTokens.setError();

                logger.error(e);
                throw new Error(e);
            }
        },

        async clearUser() {
            this.user.clear();
            this.stakedTokens.clear();
            this.activeStakings.clear();
        },

        async requestStake(mint: string, amount: number, duration: number, withNft: boolean) {
            logger.info('[STAKING] requestStake');

            try {
                const nftData = await Staking.getInstance().getNftData(new web3.PublicKey(mint));

                logger.info('[STAKING] fetchUser: nftData', nftData);

                if (!nftData) {
                    const error = `[STAKING] Not registered NFT ${mint}`;
                    new Error(error);
                }

                return await Staking.getInstance().stakeNFT(
                    new web3.PublicKey(mint),
                    duration / 30,
                    amount * REWARD_TOKEN_DECIMAL,
                    withNft ? 1 : 0
                );
            } catch (e: any) {
                logger.error(e);
                throw e;
            }
        },

        async requestClaim(mint: string, index: number, restaking = false) {
            logger.info('[STAKING] requestClaim', mint, index);

            try {
                return await Staking.getInstance().withdrawNft(new web3.PublicKey(mint), index, restaking ? 1 : 0);
            } catch (e: any) {
                logger.error(e);
                throw e;
            }
        },
    },
});
