<template>
    <div v-if="!hasConnectedWallet" class="w-full">
        <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access to your account.</template>
        </AppActionCard>
    </div>
    <AppContainer v-else>
        <AppTitle>Breeding</AppTitle>

        <AppDescriptionText class="mt-6">
            Breeding is the operation increasing the supply of Paragons and is applicable for Tier 0 Paragons only. Two
            Tier 0 Paragons, each with Breed Count less than 5, are bred to produce a new Tier0 Paragon. When breeding
            ends, the Breed Count of input Paragons is increased by one, and a new Tier 0 Paragon is created. Breeding
            cost and time increase with Breed Count attribute values of Paragons being bred.
        </AppDescriptionText>

        <div class="rounded-lg bg-gradient-to-r from-indigo-930 to-indigo-940 mt-6">
            <AppSteps :steps="steps" />
        </div>

        <div class="grid grid-cols-2 h-fit md:grid-cols-11 gap-3 mt-6">
            <div ref="container" class="col-span-8 md:col-span-12 xl:col-span-8 h-fit rounded-lg bg-indigo-930">
                <component
                    :is="steps.currentStep"
                    v-model:paragons="selectedParagons"
                    v-model:breedCount="selectedBreedCount"
                    :tier="'0'"
                    :loading="breedingButtonLoading"
                    @next="onNextStep($event)"
                    @return="onPreviousStep"
                    @breed="onBreed"
                    :sortingPriority="sortingPriority"
                />
            </div>

            <div class="col-span-8 md:col-span-12 mt-3 md:mt-0 xl:col-span-3 h-fit relative rounded-lg bg-indigo-930">
                <ParagonsBreedingPreview :paragons="selectedParagons" />
            </div>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { Steps } from '~/types/Steps.types';
    import { computed, onMounted, reactive, ref } from 'vue';
    import gsap from 'gsap';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { NotificationMessageWithItems, ParagonsBreedingConfirm, ParagonsBreedingParagons } from '#components';
    import { useWallet } from 'solana-wallets-vue';
    import { AdditionalInfo, MessageParam, MessageParamType, Notification, Variant } from '~/types/Notification.types';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import { Paragon } from '~/js/paragon';
    import * as web3 from '@solana/web3.js';
    import { isUserRejectedTx } from '~/js/errors';
    import { Metaplex } from '~/js/metaplex';
    import { getTxSolscanUrl } from '~/js/url';
    import { useRouter } from '#app';
    import { useParagonStore } from '~/store/paragon';
    import { AlertType } from '~/types/Alert.utils';
    import { logger } from '~/plugins/logger.client';
    import { useAccountStore } from '~/store/account';
    import { useBalanceStore } from '~/store/balances';

    const { publicKey } = useWallet();

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const tl1 = gsap.timeline({});
    const container = ref(null);
    const breedingButtonLoading = ref(false);
    const router = useRouter();
    const paragonStore = useParagonStore();
    const accountStore = useAccountStore();
    const balanceStore = useBalanceStore();
    const sortingPriority = ref<string[]>();

    const selectedBreedCount = reactive([]);
    const selectedParagons = ref<IParagonBase[]>([]);

    const steps = new Steps([
        { id: 1, title: 'Paragons selection', component: ParagonsBreedingParagons },
        { id: 2, title: 'Confirmation', component: ParagonsBreedingConfirm },
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

    const onBreed = async (data) => {
        let notification: Notification;

        try {
            const { publicKey } = useWallet();

            breedingButtonLoading.value = true;

            if (!publicKey.value) {
                new Error('not defined: wallet.publicKey');
            }

            notification = NotificationManager.getInstance().create({
                title: NotificationTitles.PARAGONS_BREED,
                message: {
                    component: NotificationMessageWithItems,
                    data: {
                        items: [
                            {
                                entity: 'Price',
                                value: data.price,
                                type: MessageParamType.HTO,
                            },
                            {
                                entity: 'Duration',
                                value: data.duration + ' hour(s)',
                            },
                        ] as MessageParam[],
                    },
                },
                variant: Variant.LOADING,
            });

            const tx = await Paragon.getInstance().initBreed(
                new web3.PublicKey(selectedParagons.value[0].mint),
                new web3.PublicKey(selectedParagons.value[1].mint),
                data.price
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
                paragonStore.fetchOperations(),
                balanceStore.fetchBalances(),
                accountStore.fetchTokens(publicKey.value),
            ]);

            notification.setSuccess('Paragons breeding successful');
        } catch (e) {
            logger.error(e);

            if (isUserRejectedTx(e)) {
                notification.setError('User rejected the transaction');
            } else {
                notification.setError('Transaction execution failed');
            }
        } finally {
            breedingButtonLoading.value = false;
        }
    };

    onMounted(() => {
        startAnimation();
    });
</script>

<style scoped></style>
