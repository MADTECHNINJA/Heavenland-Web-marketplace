<template>
    <div v-if="!hasConnectedWallet" class="w-full">
        <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access to your account.</template>
        </AppActionCard>
    </div>
    <AppContainer v-else>
        <AppTitle>Fusing</AppTitle>

        <AppDescriptionText class="mt-6">
            Fusing is the operation reducing the supply of Paragons and is applicable for Paragons from Tier 0 to Tier
            4. All five Paragons entering the fusing must be of the same Tier. When fusing ends, all five Paragons are
            burned, and a new Paragon of a higher Tier is created. Fusing cost and time increase with the Tier of
            Paragons being fused.

            <a
                class="hyperlink ml-1"
                target="_blank"
                href="https://docs.heavenland.io/documents/avatar-system/paragon/fusing"
                >See more</a
            >
        </AppDescriptionText>

        <div class="rounded-lg bg-gradient-to-r from-indigo-930 to-indigo-940 mt-6">
            <AppSteps :steps="steps" />
        </div>
        <div class="grid grid-cols-2 h-fit md:grid-cols-11 gap-3 mt-6">
            <div ref="container" class="col-span-8 md:col-span-12 xl:col-span-8 h-fit rounded-lg bg-indigo-930">
                <component
                    :is="steps.currentStep"
                    v-model:main="selectedMainParagon"
                    v-model:tier="selectedTier"
                    v-model:secondary="selectedSecondaryParagons"
                    v-model:breedCount="selectedBreedCount"
                    :paragons="sortedParagonCollections"
                    :loading="fusionButtonLoading"
                    @next="onNextStep($event)"
                    :sortingPriority="sortingPriority"
                    @return="onPreviousStep"
                    @fuse="onFuse"
                />
            </div>

            <div
                v-if="steps.steps[0]?.status !== 'current'"
                class="col-span-7 md:col-span-12 mt-3 md:mt-0 xl:col-span-3 h-fit relative rounded-lg bg-indigo-930"
            >
                <ParagonsFusionPreview
                    :tier="selectedTier"
                    :main="selectedMainParagon"
                    :secondary="selectedSecondaryParagons"
                />
            </div>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { Steps } from '~/types/Steps.types';
    import {
        NotificationMessageWithItems,
        ParagonsFusionConfirm,
        ParagonsFusionMainParagon,
        ParagonsFusionSecondaryParagons,
        ParagonsFusionTierSelection,
    } from '#components';
    import { computed, onMounted, ref, reactive } from 'vue';
    import gsap from 'gsap';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { mapState } from 'pinia';
    import { useAccountStore } from '~/store/account';
    import { Notification, MessageParam, MessageParamType, Variant, AdditionalInfo } from '~/types/Notification.types';
    import { useWallet } from 'solana-wallets-vue';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { useRouter } from '#app';
    import { Paragon } from '~/js/paragon';
    import * as web3 from '@solana/web3.js';
    import { Metaplex } from '~/js/metaplex';
    import { getTxSolscanUrl } from '~/js/url';
    import { isUserRejectedTx } from '~/js/errors';
    import { useParagonStore } from '~/store/paragon';
    import { getParagonFuseDuration, getParagonFusePrice } from '~/types/Paragon.utils';
    import { AlertType } from '~/types/Alert.utils';
    import { useBalanceStore } from '~/store/balances';

    const { publicKey } = useWallet();

    const sortingPriority = ref<string[]>();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const container = ref(null);

    const selectedBreedCount = reactive([]);
    const selectedTier = ref('');
    const selectedMainParagon = ref<IParagonBase>(null);
    const selectedSecondaryParagons = ref<IParagonBase[]>([]);
    const fusionButtonLoading = ref(false);
    const router = useRouter();

    const tl1 = gsap.timeline({});

    const paragonStore = useParagonStore();
    const accountStore = useAccountStore();
    const balanceStore = useBalanceStore();

    const paragonCollections = mapState(useAccountStore, {
        fetched: (store) => store.tokens.paragons.fetched,
        error: (store) => store.tokens.paragons.error,
        data: (store) => store.tokens.paragons.data,
    });

    const sortedParagonCollections = computed(() => {
        return paragonCollections.data()?.sort((a, b) => {
            return a.tier > b.tier ? 1 : a.tier === b.tier && a?.name > b?.name ? 1 : -1;
        });
    });

    const steps = new Steps([
        { id: 1, title: 'Tier selection', component: ParagonsFusionTierSelection },
        { id: 2, title: 'Main paragon', component: ParagonsFusionMainParagon },
        { id: 3, title: 'Secondary paragons', component: ParagonsFusionSecondaryParagons },
        { id: 4, title: 'Confirmation', component: ParagonsFusionConfirm },
    ]);

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

    const onNextStep = (event: string[]) => {
        sortingPriority.value = event;
        steps.nextStep();
        startAnimation();
    };

    const onPreviousStep = () => {
        steps.previousStep();
        startAnimation();
    };

    onMounted(() => {
        startAnimation();
    });

    const onFuse = async () => {
        let notification: Notification;

        try {
            const { publicKey } = useWallet();

            fusionButtonLoading.value = true;

            if (!publicKey.value) {
                new Error('not defined: wallet.publicKey');
            }

            notification = NotificationManager.getInstance().create({
                title: NotificationTitles.PARAGONS_FUSE,
                message: {
                    component: NotificationMessageWithItems,
                    data: {
                        items: [
                            {
                                entity: 'Price',
                                value: getParagonFusePrice(selectedTier.value),
                                type: MessageParamType.HTO,
                            },
                            {
                                entity: 'Duration',
                                value: getParagonFuseDuration(selectedTier.value) + ' days',
                            },
                        ] as MessageParam[],
                    },
                },
                variant: Variant.LOADING,
            });

            const tx = await Paragon.getInstance().initFusion(
                Number(selectedTier.value),
                [
                    new web3.PublicKey(selectedMainParagon.value.mint),
                    ...selectedSecondaryParagons.value.map((p) => new web3.PublicKey(p.mint)),
                ],
                getParagonFusePrice(selectedTier.value)
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

            notification.setSuccess('Paragons fusing successful');
        } catch (e) {
            if (isUserRejectedTx(e)) {
                notification.setError('User rejected the transaction');
            } else {
                notification.setError('Transaction execution failed');
            }
        } finally {
            fusionButtonLoading.value = false;
        }
    };
</script>

<style scoped></style>
