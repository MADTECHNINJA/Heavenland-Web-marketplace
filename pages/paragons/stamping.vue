<template>
    <div v-if="!hasConnectedWallet" class="w-full">
        <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access to your account.</template>
        </AppActionCard>
    </div>

    <AppContainer v-else>
        <div ref="client" class="w-full h-full">
            <AppTitle>Stamping</AppTitle>

            <AppDescriptionText class="mt-6">
                You can think of this operation as stamping Paragon NFT with PFP, costing a symbolic
                {{ STAMPING_DEFAULT_PRICE }} HTO. Stamping will update Paragon NFT on the Solana blockchain (i.e. update
                its attributes and image). Single PFP can be used to stamp as many Paragon NFTs as desired, and the
                stamped Paragon NFTs can then be sold in the marketplace. Any Paragon NFT can be re-stamped (i.e., its
                PFP can be replaced by another one).
            </AppDescriptionText>

            <div class="rounded-lg bg-gradient-to-r from-indigo-930 to-indigo-940 mt-6">
                <AppSteps :steps="steps" />
            </div>

            <div class="grid grid-cols-2 h-fit md:grid-cols-9 gap-3 mt-6">
                <div ref="container" class="col-span-7 md:col-span-12 lg:col-span-7 h-fit rounded-lg bg-indigo-930">
                    <component
                        :is="steps.currentStep"
                        v-model:paragon="selectedParagon"
                        v-model:pfp="selectedPfp"
                        :stamping-loading="stampingButtonLoading"
                        @next="onNextStep"
                        @return="onPreviousStep"
                        @stamp="stamp"
                    />
                </div>

                <div
                    class="col-span-7 md:col-span-12 mt-3 md:mt-0 lg:col-span-2 h-fit relative rounded-lg bg-indigo-930"
                >
                    <ParagonsStampingPreview
                        :client="client"
                        :selectedParagon="selectedParagon"
                        :selectedPfp="selectedPfp"
                    />
                </div>
            </div>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { Steps } from '~/types/Steps.types';

    import {
        ParagonsStampingPfp,
        ParagonsStampingParagons,
        ParagonsStampingConfirm,
        NotificationMessageWithItems,
    } from '#components';
    import { ref, onMounted, computed } from 'vue';
    import { useWallet } from 'solana-wallets-vue';
    import { Notification, MessageParam, MessageParamType, Variant, AdditionalInfo } from '~/types/Notification.types';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { Paragon } from '~/js/paragon';
    import * as web3 from '@solana/web3.js';
    import { isUserRejectedTx } from '~/js/errors';
    import { Metaplex } from '~/js/metaplex';
    import { getTxSolscanUrl } from '~/js/url';
    import { STAMPING_DEFAULT_PRICE } from '~/types/Paragon.data';
    import { useRouter } from '#app';
    import { useParagonStore } from '~/store/paragon';
    import gsap from 'gsap';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { IStampable } from '@/types/Paragon.types';
    import { INftBase } from '~~/types/Nft.types';
    import { AlertType } from '~/types/Alert.utils';
    import { useAccountStore } from '~/store/account';
    import { useBalanceStore } from '~/store/balances';

    const client = ref(null);

    const { publicKey } = useWallet();
    const selectedParagon = ref<IParagonBase>(null);
    const selectedPfp = ref<INftBase & IStampable>(null);

    const stampingButtonLoading = ref(false);

    const paragonStore = useParagonStore();
    const accountStore = useAccountStore();
    const balanceStore = useBalanceStore();

    const router = useRouter();

    const steps = new Steps([
        { id: 1, title: 'Paragon', component: ParagonsStampingParagons },
        { id: 2, title: 'Profile picture', component: ParagonsStampingPfp },
        { id: 3, title: 'Confirmation', component: ParagonsStampingConfirm },
    ]);

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const container = ref(null);
    const tl1 = gsap.timeline({});

    const startAnimation = () => {
        tl1.fromTo(
            container.value,
            {
                delay: 1,
                y: -20,
                autoAlpha: 0,
                ease: 'slow(3, 3)',
            },
            { y: 0, autoAlpha: 1, delay: 0, ease: 'slow(3, 3)', duration: 1 }
        );
    };

    onMounted(() => {
        startAnimation();
    });

    const onNextStep = () => {
        steps.nextStep();
        startAnimation();
    };

    const onPreviousStep = () => {
        steps.previousStep();
        startAnimation();
    };

    const stamp = async () => {
        let notification: Notification;

        try {
            const { publicKey } = useWallet();

            stampingButtonLoading.value = true;

            if (!publicKey.value) {
                new Error('not defined: wallet.publicKey');
            }

            notification = NotificationManager.getInstance().create({
                title: NotificationTitles.PARAGONS_STAMP,
                message: {
                    component: NotificationMessageWithItems,
                    data: {
                        items: [
                            {
                                entity: 'Price',
                                value: STAMPING_DEFAULT_PRICE,
                                type: MessageParamType.HTO,
                            },
                        ] as MessageParam[],
                    },
                },
                variant: Variant.LOADING,
            });

            const tx = await Paragon.getInstance().initStamp(
                new web3.PublicKey(selectedParagon.value.mint),
                new web3.PublicKey(selectedPfp.value.mint),
                STAMPING_DEFAULT_PRICE
            );

            const txSig = await Metaplex.getInstance().sendTransaction(tx);

            notification.link = {
                name: 'View',
                href: getTxSolscanUrl(txSig),
            };

            notification.additionalInfo = AdditionalInfo.CONFIRMING;

            await Metaplex.getInstance().confirmTransaction(txSig);

            notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

            paragonStore.operations.clear();
            accountStore.clearTokens();
            balanceStore.clearUser();

            await router.push('/paragons');

            await Promise.all([
                accountStore.fetchTokens(publicKey.value),
                paragonStore.fetchOperations(),
                balanceStore.fetchBalances(),
            ]);

            notification.setSuccess('Paragons stamping successful');
        } catch (e) {
            if (isUserRejectedTx(e)) {
                notification.setError('User rejected the transaction');
            } else {
                notification.setError('Transaction execution failed');
            }
        } finally {
            stampingButtonLoading.value = false;
        }
    };
</script>

<style scoped>
    .slide-enter-from {
        opacity: 1;
    }

    .slide-enter-active,
    .slide-leave-active {
        max-height: 400px;
        transition: all 0.5s;
    }

    .slide-enter,
    .slide-leave-to {
        max-height: 0;
        opacity: 0;
    }
</style>
