import { useWallet } from 'solana-wallets-vue';
import { Metaplex } from '~/js/metaplex';
import { computed, reactive } from 'vue';
import { NotificationClaimStakes, ParallelDataState } from '~/types/Notification.types';
import { web3 } from '@project-serum/anchor';
import { formatNumberToDecimal } from '~/js/formatting';
import { mapActions, mapState } from 'pinia';
import { useUserInfo } from '~/store/staking/userPool';
import { useBalanceStore } from '~/store/balances';
import { useGlobalInfo } from '~/store/staking/global';
import { useAccountStore } from '~/store/account';

const userStakingActions = computed(() => {
    return mapActions(useUserInfo, ['requestClaim']);
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

export const useRefreshStakes = async () => {
    const { publicKey } = useWallet();

    const stakingGlobalStore = useGlobalInfo();
    const stakingUserStore = useUserInfo();
    const balanceStore = useBalanceStore();
    const accountStore = useAccountStore();

    await accountStore.clearTokens();
    await balanceStore.clearBalances();
    await stakingGlobalStore.clearGlobal();
    await stakingUserStore.clearUser();

    await accountStore.fetchTokens(publicKey.value);
    await stakingGlobalStore.fetchGlobal();
    await stakingGlobalStore.fetchStakingStats();
    await stakingGlobalStore.getAllStakers();
    await stakingUserStore.fetchUser();
    await balanceStore.fetchBalances();
};

export const useOngoingStakesClaim = async (amountToClaim = null) => {
    const { publicKey } = useWallet();
    const blockhash = await Metaplex.getInstance().getLatestBlockhash();
    const now = Math.floor(Date.now() / 1000);
    const data = reactive<NotificationClaimStakes>({});
    const txs: web3.Transaction[] = [];
    let claims = [];

    if (amountToClaim) {
        for (const mintId in userData.value.activeStakings().data) {
            const activeStaking = userData.value.activeStakings().data[mintId];
            for (const mintStaking of activeStaking.stakings) {
                if (mintStaking.endTime > now) {
                    claims.push({ mintId, index: mintStaking.index, earned: mintStaking.earned });
                }
            }
        }
        claims.sort((a, b) => (a.earned >= b.earned ? 1 : -1));
        claims = claims.slice(-amountToClaim);
    }

    for (const mintId in userData.value.activeStakings().data) {
        const activeStaking = userData.value.activeStakings().data[mintId];

        const name = stakedTokens.value.data().find((m) => m.mint === mintId)?.name;

        if (!name) {
            continue;
        }

        for (const mintStaking of activeStaking.stakings.sort((a, b) => (a.index <= b.index ? 1 : -1))) {
            if (amountToClaim && !claims.find((item) => item.mintId === mintId && item.index === mintStaking.index)) {
                continue;
            }

            const isFinished = mintStaking.endTime <= now;

            if (!isFinished) {
                const tx = await userStakingActions.value.requestClaim(mintId, mintStaking.index);
                tx.recentBlockhash = blockhash;
                tx.feePayer = publicKey.value;

                const stakeClaim = mintStaking.earned;

                if (!data[mintId]) {
                    data[mintId] = {
                        name,
                        totalClaim: 0,
                        stakes: [],
                    };
                }

                data[mintId].totalClaim += stakeClaim;
                data[mintId].stakes.push({
                    index: mintStaking.index,
                    state: ParallelDataState.NONE,
                    claim: formatNumberToDecimal(stakeClaim),
                    tx,
                });

                txs.push(tx);
            }
        }

        if (data[mintId]) {
            data[mintId].totalClaimFormatted = data[mintId].totalClaim
                ? formatNumberToDecimal(data[mintId].totalClaim)
                : 0;
        }
    }

    return {
        claimTxs: txs,
        claimData: data,
    };
};
