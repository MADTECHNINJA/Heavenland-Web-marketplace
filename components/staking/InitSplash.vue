<template>
    <div class="relative overflow-hidden px-9 my-6 py-6 bg-indigo-930 shadow rounded-lg bg-indigo-930">
        <div class="flex flex-col relative z-10">
            <AppSectionTitle>Staking account initialization</AppSectionTitle>

            <p class="text-sm mt-3 text-gray-200 max-w-3xl">
                Staking is fully managed by Heavenland's Staking Program on the Solana blockchain. To enable staking on
                your account, you must first initialize your staking account, which will hold data about your stakes on
                Solana.
            </p>

            <p class="text-sm mt-3 text-gray-200 max-w-3xl">
                The staking account creation will come with a one-time payment of approx. 0.05 SOL.
            </p>

            <div class="mt-6">
                <AppButton @click="initStakingAccount" :loading="initializeStakingButtonLoading">Initialize</AppButton>
            </div>
        </div>

        <img
            :src="stakingSplash"
            alt="Staking splash"
            class="absolute md:top-0 bottom-10 h-1/3 w-[600px] md:w-auto md:bottom-auto md:bg-cover scale-[200%] md:scale-100 md:w-auto right-0 md:h-full opacity-10 md:opacity-[15%] xl:opacity-[40%]"
        />
    </div>
</template>

<script lang="ts" setup>
    import stakingSplash from '@/assets/staking-splash.png';
    import { Staking } from '~/js/staking';
    import { ref } from 'vue';
    import { useUserInfo } from '@/store/staking/userPool';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { AdditionalInfo, Variant } from '~/types/Notification.types';
    import { getTxSolscanUrl } from '~/js/url';
    import { Metaplex } from '~/js/metaplex';
    import { logger } from '~/plugins/logger.client';
    import { useBalanceStore } from '~/store/balances';

    const initializeStakingButtonLoading = ref(false);
    const stakingUserPoolStore = useUserInfo();
    const balanceStore = useBalanceStore();

    const initStakingAccount = async () => {
        initializeStakingButtonLoading.value = true;

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.STAKE_INIT,
            variant: Variant.LOADING,
        });

        try {
            const txSig = await Staking.getInstance().initPoolAccount();

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            await stakingUserPoolStore.clearUser();
            await stakingUserPoolStore.fetchUser();
            await balanceStore.fetchBalances();

            notification.setSuccess('Transaction successfully confirmed');
        } catch (e) {
            logger.error(e);

            notification.setError(
                e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed'
            );
        } finally {
            initializeStakingButtonLoading.value = false;
        }
    };
</script>

<style scoped></style>
