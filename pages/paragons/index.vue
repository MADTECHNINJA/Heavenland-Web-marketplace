<template>
    <AppContainer>
        <AppTitle>Paragons</AppTitle>

        <AppDescriptionText>
            Paragon is a new class of NFT that's been introduced in Heavenland. It's breedable, it provides a lot of
            utilities to its owner, and it looks sexy. Paragon is very closely tied with PFP - if PFP is a profile
            picture, Paragon is the frame around it, which enhances not only the PFP but also the avatar qualities in
            the game. Heavenland has onboarded a DC/Marvel artist to make sure Paragons will be something extraordinary.
        </AppDescriptionText>
        <div v-if="!hasConnectedWallet" class="w-full">
            <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
                <template #title>Wallet not connected!</template>
                <template #desc> Connect your wallet to gain access to your paragons.</template>
            </AppActionCard>
        </div>
        <div v-else>
            <ParagonsOwnershipOverview :paragons="paragons.data" :fetched="paragons.fetched" :error="paragons.error" />

            <p class="mt-9 text-base font-bold tracking-tight">Select your paragon operation</p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 lg:gap-y-0 gap-x-3 mt-3">
                <ParagonCardButton
                    link="/paragons/breeding"
                    title="Breeding"
                    icon="split"
                    description="Breed 2 paragons to create a new one in the same tier with upgraded statistics"
                    :image="newBreedingLogo"
                />
                <ParagonCardButton
                    link="/paragons/fusing"
                    title="Fusing"
                    icon="up-to-dotted-line"
                    description="Select 5 of your paragons from the same tier to create a new one with increased tier"
                    :image="newFusionLogo"
                />
                <ParagonCardButton
                    link="/paragons/stamping"
                    title="Stamping"
                    icon="stamp"
                    description="Select one of your paragons and one of your PFPs to create
            a stamped paragon"
                    :image="newStampLogo"
                />
            </div>

            <AppSectionTitle class="mt-9 mb-3">Active operations</AppSectionTitle>

            <AppClaimComponent
                title="Claim operations"
                class="mb-6"
                @claimItems="claimParagons($event)"
                :claim-all-button-loading="claimAllParagonsLoading"
                :claim-button-loading="claimButtonLoading"
                v-if="operationsToClaim?.length"
                :ongoing-items-count="operationsToClaim.length"
                :defaultAmount="claimAmount"
                icon="circle-dashed"
            >
                <template #claim-all>
                    <p>Claim all of your finished operations ({{ operationsToClaim.length }})</p>
                </template>
                <template #claim>
                    <p>Select number of operations to claim<br /></p>
                </template>
            </AppClaimComponent>

            <AppParagonOperationsFilter
                v-if="paragonOperations.allOperations().length"
                class="mb-6"
                v-model="activeParagonOperationsFilter"
                with-router
            />

            <AppActionCard class="mt-3" v-if="!paragonOperations.fetched()" :type="AlertType.LOADING">
                <template #title>Loading operations...</template>
            </AppActionCard>

            <AppActionCard class="mt-3" v-else-if="paragonOperations.error()" :type="AlertType.ERROR">
                <template #desc> {{ ErrorMsg.FETCHING_ERROR }} </template>
            </AppActionCard>

            <AppActionCard class="mt-3" v-else-if="isEmptyOngoing" :type="AlertType.INFO" icon="empty-set">
                <template #title>No operations!</template>
                <template #desc> There's no paragon operations connected to this wallet.</template>
            </AppActionCard>

            <ParagonContainer>
                <template
                    v-for="operation in sortedOngoingParagonOperations"
                    :key="operation.creator + operation.enterTime"
                >
                    <component
                        @loading="cardLoading = $event"
                        :is="getOperationComponent(operation)"
                        :claimingAll="claimAllParagonsLoading"
                        :operation="operation"
                    />
                </template>
            </ParagonContainer>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import newBreedingLogo from '@/assets/paragons/breeding.png';
    import newFusionLogo from '@/assets/paragons/fusion.png';
    import newStampLogo from '@/assets/paragons/stamping.png';

    import { logger } from '~/plugins/logger.client';
    import { ErrorMsg } from '~/locales/core';
    import { AlertType } from '~/types/Alert.utils';
    import { onMounted, ref, computed, watch } from '#imports';
    import { useParagonStore } from '~/store/paragon';
    import { mapState } from 'pinia';
    import { useWallet } from 'solana-wallets-vue';
    import {
        NotificationParallelTxClaimParagons,
        ParagonBreedingCard,
        ParagonFusionCard,
        ParagonStampingCard,
    } from '#components';
    import { Breeding, Fusion, IOperation, OperationType, OperationState } from '~/types/Paragon.types';
    import { useAccountStore } from '~/store/account';
    import { useRoute } from '#app';
    import { Paragon } from '~/js/paragon';
    import { Metaplex } from '~/js/metaplex';
    import { ParallelDataState, Variant } from '~/types/Notification.types';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { NotificationMessageWithTitle } from '#components';
    import { NotificationTitles } from '~/types/Notification.data';
    import { getTxSolscanUrl } from '~/js/url';

    const accountStore = useAccountStore();
    const paragonStore = useParagonStore();
    const activeParagonOperationsFilter = ref('all');
    const route = useRoute();

    const claimButtonLoading = ref(false);
    const claimAllParagonsLoading = ref(false);
    const claimAmount = ref(1);
    const cardLoading = ref(false);

    onMounted(() => {
        if (route.query['type']) {
            let operationType = route.query['type'] as string;
            operationType = operationType.charAt(0).toUpperCase() + operationType.slice(1);
            activeParagonOperationsFilter.value = operationType;
        }
    });

    const claimParagons = async (amount: number | null = null) => {
        if (amount) {
            claimAmount.value = amount;
            claimButtonLoading.value = true;
        } else {
            claimAllParagonsLoading.value = true;
        }

        const { claimData, claimTxs, countOfClaimedItems } = await Paragon.getInstance().claimAll(amount);

        const notification = NotificationManager.getInstance().create({
            title: NotificationTitles.PARAGONS_CLAIM_MULTIPLE,
            variant: Variant.LOADING,
            indefinite: true,
            message: {
                component: NotificationMessageWithTitle,
                data: {
                    amountPrefix: 'Total of',
                    amount: `${countOfClaimedItems} paragons`,
                },
            },
            transactionFlow: {
                component: NotificationParallelTxClaimParagons,
                data: claimData,
            },
        });

        try {
            const signedTxs = await Metaplex.getInstance().signMultipleTransactions(claimTxs);
            let index = 0;

            for (const pda in claimData) {
                const currentParagon = claimData[pda];
                const signedTx = signedTxs[index];
                index++;

                Metaplex.getInstance().sendRawTransaction(signedTx, async (txSig) => {
                    currentParagon.state = ParallelDataState.PROCESSING;
                    currentParagon.link = {
                        name: 'View',
                        href: getTxSolscanUrl(txSig),
                    };

                    Metaplex.getInstance().confirmTransaction(
                        txSig,
                        () => {
                            currentParagon.state = ParallelDataState.FINISHED;

                            if (isAllTxClaimed(claimData)) {
                                notification.setSuccess('Claim transactions have been finished', true);

                                Promise.all([
                                    accountStore.clearTokens(),
                                    paragonStore.fetchOperations(),
                                    accountStore.fetchTokens(publicKey.value),
                                ]);

                                setEndState();
                            }
                        },
                        () => {
                            currentParagon.state = ParallelDataState.ERROR;

                            if (isAllTxClaimed(claimData)) {
                                notification.setSuccess('Claim transactions have been finished', true);

                                Promise.all([
                                    accountStore.clearTokens(),
                                    paragonStore.fetchOperations(),
                                    accountStore.fetchTokens(publicKey.value),
                                ]);
                                setEndState();
                            }
                        }
                    );
                });
            }
        } catch (e) {
            logger.error(e);

            notification.setError(e.code === 4001 ? 'User rejected the transaction' : 'Transaction execution failed');
            setEndState();
        }
    };

    const setEndState = () => {
        if (claimButtonLoading.value) {
            claimButtonLoading.value = false;
        }
        if (claimAllParagonsLoading.value) {
            claimAllParagonsLoading.value = false;
        }

        setDefaultClaimAmount(operationsToClaim.value?.length);
    };

    const setDefaultClaimAmount = (value: number) => {
        if (value < 5 && !claimButtonLoading.value) {
            claimAmount.value = value;
        } else if (!claimButtonLoading.value) {
            claimAmount.value = 5;
        }
    };

    const isAllTxClaimed = (data) => {
        for (const claim in data) {
            if (data[claim].state !== ParallelDataState.FINISHED) {
                return false;
            }
        }
        return true;
    };

    const paragons = computed(() => {
        return accountStore.tokens.paragons;
    });

    const paragonOperations = mapState(useParagonStore, {
        fetched: (store) => store.operations.fetched,
        error: (store) => store.operations.error,
        hasOperations: (store) => store.hasOperations,
        allOperations: (store) => store.allOperations,
    });

    const operationsToClaim = computed(() => {
        const operations = paragonOperations
            .allOperations()
            .filter((i) => i.type === OperationType.BREEDING || i.type === OperationType.FUSION) as (
            | Breeding
            | Fusion
        )[];

        const now = Date.now() / 1000;

        return operations
            .filter(
                (i) =>
                    (i.status.toString() === OperationState[OperationState.FINISHED] ||
                        i.status.toString() === OperationState[OperationState.ERROR]) &&
                    now > i.unlockTime
            )
            .sort((a, b) => a.unlockTime - b.unlockTime);
    });

    const sortedOngoingParagonOperations = computed(() => {
        return paragonOperations
            .allOperations()
            .filter((operation) =>
                activeParagonOperationsFilter.value === 'all'
                    ? operation
                    : operation.type === activeParagonOperationsFilter.value
            )
            .sort((a, b) => (a.type < b.type ? 1 : a.type === b.type ? (a.enterTime > b.enterTime ? -1 : 1) : -1));
    });

    const isEmptyOngoing = computed(() => {
        return sortedOngoingParagonOperations.value && sortedOngoingParagonOperations.value.length === 0;
    });

    const getOperationComponent = (operation: IOperation) => {
        switch (operation.type) {
            case OperationType.FUSION:
                return ParagonFusionCard;

            case OperationType.BREEDING:
                return ParagonBreedingCard;

            case OperationType.STAMPING:
                return ParagonStampingCard;
        }
    };

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const { publicKey } = useWallet();

    const fetchOperations = async () => {
        if (publicKey.value && !paragonOperations.fetched()) {
            await paragonStore.fetchOperations();
        }
        setDefaultClaimAmount(operationsToClaim.value?.length);
    };

    watch(publicKey, fetchOperations);

    onMounted(fetchOperations);
</script>

<style scoped></style>
