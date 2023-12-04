<template>
    <div class="container-snap flex mt-3 gap-2 overflow-x-scroll custom-scrollbar scroll-smooth pb-2">
        <StakingStatsCard bg="accent" :fetched="isGlobalFetched && userInfo.userFetched()">
            <template #title> Estimated reward </template>

            <span>{{ userInfo.walletPendingReward() }}</span>
            <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
        </StakingStatsCard>

        <StakingStatsCard :fetched="isGlobalFetched && userInfo.userFetched()">
            <template #title> HTO staked </template>

            <span>{{ userInfo.walletHtoStaked() }}</span>
            <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
        </StakingStatsCard>

        <StakingStatsCard :fetched="isGlobalFetched && userInfo.stakedTokensFetched()">
            <template #title>NFTs staked </template>

            <span>{{ userInfo.walletNftStaked() }}</span>
        </StakingStatsCard>

        <StakingStatsCard :fetched="userInfo.userFetched()">
            <template #title>
                <div>
                    <span class="mr-2">Active stakes</span>
                    <AppTooltip text="Staking is limited to 100 stakes per wallet">
                        <FontAwesomeIcon class="h-4 w-4" :icon="['fad', 'info-circle']" />
                    </AppTooltip>
                </div>
            </template>

            <div class="flex items-center justify-center w-full mt-1.5">
                <div class="w-8 bg-indigo-900 h-1.5 rounded-full overflow-clip">
                    <div
                        class="bg-gradient-to-r h-1.5 rounded-full"
                        :class="[
                            userInfo.walletStakesCount() === 100
                                ? 'from-green-900 to-green-700'
                                : 'from-indigo-700 to-[#b24cb6]',
                        ]"
                        :style="{ width: userInfo.walletStakesCount() + '%' }"
                    ></div>
                </div>
                <span class="font-semibold text-xs ml-3">{{ userInfo.walletStakesCount() }} / 100</span>
            </div>
        </StakingStatsCard>

        <StakingStatsCard :fetched="isGlobalFetched && userInfo.stakedTokensFetched()">
            <template #title> Finished stakes </template>

            <span>{{ userInfo.walletFinishedStakes() }}</span>
        </StakingStatsCard>

        <StakingStatsCard :fetched="isGlobalFetched && userInfo.userFetched()">
            <template #title> Avg. stake duration </template>

            <span>{{ userInfo.walletAvgStakeDuration() }} days</span>
        </StakingStatsCard>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { GlobalInfo } from '~/types/Staking.types';
    import { useGlobalInfo } from '~/store/staking/global';
    import { computed } from 'vue';
    import { mapState } from 'pinia';
    import { useUserInfo } from '~/store/staking/userPool';

    defineProps<{
        data: GlobalInfo;
        fetched: boolean;
    }>();

    const userInfo = computed(() => {
        return mapState(useUserInfo, {
            userFetched: (store) => store.user.fetched,
            stakedTokensFetched: (store) => store.stakedTokens.data,

            walletStakesCount: (store) => store.user.data.stakedCount,
            walletPendingReward: (store) => store.totalPendingReward,
            walletNftStaked: (store) => store.stakedTokens.data?.length,
            walletHtoStaked: (store) => store.totalHtoStaked,
            walletFinishedStakes: (store) => store.finishedStakings,
            walletAvgStakeDuration: (store) => store.avgStakeDuration,
        });
    });

    const globalInfo = useGlobalInfo();

    const isGlobalFetched = computed(() => {
        return globalInfo.global.fetched;
    });
</script>

<style scoped></style>
