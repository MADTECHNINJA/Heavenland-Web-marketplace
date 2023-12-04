<template>
    <div class="container-snap flex mt-3 gap-2 custom-scrollbar overflow-x-scroll scroll-smooth pb-2">
        <StakingStatsCard bg="red" :fetched="globalInfo.globalFetched()">
            <template #title>
                <div>
                    <span class="mr-2">Max APR</span>
                    <AppTooltip text="Max APR is for stakes over 180 days, shorter stakes have lower APR">
                        <FontAwesomeIcon class="h-4 w-4" :icon="['fad', 'info-circle']" />
                    </AppTooltip>
                </div>
            </template>

            <span v-if="globalInfo.apr() === null">Not available</span>
            <span v-else>{{ formatNumberToDecimal(globalInfo.apr()) }}%</span>
        </StakingStatsCard>

        <StakingStatsCard title="cHL" :fetched="globalInfo.globalFetched()">
            <template #title>
                <div>
                    <span class="mr-2">cHL</span>
                    <AppTooltip text="The bigger cHL, the more HTO can be staked on every stakable NFT">
                        <FontAwesomeIcon class="h-4 w-4" :icon="['fad', 'info-circle']" />
                    </AppTooltip>
                </div>
            </template>

            <span v-if="globalInfo.cHL() === null">Not available</span>
            <span v-else>{{ globalInfo.cHL() }}</span>
        </StakingStatsCard>

        <StakingStatsCard title="HTO release rate" :fetched="globalInfo.globalFetched()">
            <span>{{ globalInfo.htoReleaseRate() }}</span>
            <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
            <span> / hour</span>
        </StakingStatsCard>

        <StakingStatsCard
            title="Total HTO staked"
            :fetched="globalInfo.stakingDetailsFetched()"
            :error="globalInfo.stakingDetailsError()"
        >
            <span>{{ globalInfo.totalStakedHTO() }}</span>
            <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
        </StakingStatsCard>

        <StakingStatsCard
            title="Total NFTs staked"
            :fetched="globalInfo.stakingDetailsFetched()"
            :error="globalInfo.stakingDetailsError()"
        >
            <span>{{ globalInfo.stakingDetailsData().tokensStaked }}</span>
        </StakingStatsCard>

        <StakingStatsCard title="Total pending rewards" :fetched="fetched">
            <span>{{ globalInfo.totalPendingReward() }}</span>
            <img alt="HTO" :src="htoCurrency" class="h-4 rounded-full" />
        </StakingStatsCard>

        <StakingStatsCard
            title="Avg. stake duration"
            :fetched="globalInfo.globalFetched() && globalInfo.stakingDetailsFetched()"
            :error="globalInfo.stakingDetailsError()"
        >
            <span>{{ globalInfo.avgStakeDuration() }} days</span>
        </StakingStatsCard>

        <StakingStatsCard
            title="Number of stakers"
            :fetched="globalInfo.stakersCountFetched()"
            :error="globalInfo.stakersCountError()"
        >
            <span>{{ globalInfo.stakersCount() }}</span>
        </StakingStatsCard>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { GlobalInfo } from '~/types/Staking.types';
    import { useGlobalInfo } from '~/store/staking/global';
    import { computed } from 'vue';
    import { mapState } from 'pinia';
    import { formatNumberToDecimal } from '~/js/formatting';

    defineProps<{
        data: GlobalInfo;
        fetched: boolean;
    }>();

    const globalInfo = computed(() => {
        return mapState(useGlobalInfo, {
            globalFetched: (store) => store.global.fetched,
            globalData: (store) => store.global.data,

            stakingDetailsData: (store) => store.stakingDetails.data,
            stakingDetailsFetched: (store) => store.stakingDetails.fetched,
            stakingDetailsError: (store) => store.stakingDetails.error,

            stakersCount: (store) => store.stakers.data.count,
            stakersCountFetched: (store) => store.stakers.fetched,
            stakersCountError: (store) => store.stakers.error,

            cHL: (store) => store.cHL,
            htoReleaseRate: (store) => store.htoReleaseRate,
            apr: (store) => store.apr,
            avgStakeDuration: (store) => store.avgStakeDuration,
            totalStakedHTO: (store) => store.totalStakedHTO,
            totalPendingReward: (store) => store.totalPendingReward,
        });
    });
</script>

<style scoped></style>
