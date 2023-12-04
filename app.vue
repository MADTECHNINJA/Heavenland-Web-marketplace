<template>
    <NuxtLoadingIndicator
        :height="3"
        :duration="3000"
        color="repeating-linear-gradient(to right,#4C44DB 0%,#482CD4 100%)"
    />
    <div ref="client" :class="{ connected: hasConnectedWallet }">
        <div class="z-50 bottom-3 text-indigo-900 fixed -right-[350px] w-full md:w-auto md:min-w-[350px]">
            <transition-group name="list-complete">
                <div class="list-complete-item" v-for="notification in NM.notifications" :key="notification.id">
                    <AppNotification :width="client?.clientWidth" :notification="notification" />
                </div>
            </transition-group>
        </div>

        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog as="div" class="fixed inset-0 flex z-[60] md:hidden" @close="sidebarOpen = false">
                <TransitionChild
                    as="template"
                    enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </TransitionChild>
                <TransitionChild
                    as="template"
                    enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full"
                    enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leave-from="translate-x-0"
                    leave-to="-translate-x-full"
                >
                    <div
                        class="relative flex-1 overflow-y-scroll flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-950"
                    >
                        <TransitionChild
                            as="template"
                            enter="ease-in-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in-out duration-300"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="absolute top-4 right-4 pt-2.5">
                                <FontAwesomeIcon
                                    icon="times"
                                    class="ml-1 flex items-center justify-center h-5 w-5 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
                                    @click="sidebarOpen = false"
                                />
                            </div>
                        </TransitionChild>
                        <div class="flex-shrink-0 flex items-center px-2">
                            <img class="h-8 w-auto" :src="heavenMarketLogoWhite" alt="Heavenland" />
                        </div>
                        <div class="mt-6">
                            <div class="flex flex-col px-2 md:ml-6 space-y-4">
                                <MyItemsButton
                                    v-if="!currentRoute.path.includes('/account')"
                                    @update:open="sidebarOpen = false"
                                />
                                <HeaderConnectButton />
                                <HeaderWalletPanel />
                            </div>
                        </div>
                        <LayoutMenu class="pt-3 mt-10 pb-5 mb-5" @update:open="sidebarOpen = false" :mobile="true" />
                        <AppRpcOption :isCollapsed="isCollapsed" />
                    </div>
                </TransitionChild>
                <div class="flex-shrink-0 w-14" aria-hidden="true">
                    <!-- Dummy element to force sidebar to shrink to fit close icon -->
                </div>
            </Dialog>
        </TransitionRoot>

        <div class="flex flex-col">
            <div class="bg-indigo-950 w-full" id="appHeader">
                <div class="mx-auto px-2 sm:px-4 md:divide-y md:divide-gray-900 md:pl-6 md:pr-8">
                    <div class="relative h-16 flex justify-between">
                        <div class="flex items-center w-full justify-between">
                            <div
                                class="md:z-10 z-50 px-2 flex md:px-0 h-10 bg-indigo-950 top-0 md:top-auto md:bg-transparent md:h-8 py-3 w-screen md:w-full left-0 md:left-auto fixed"
                            >
                                <div class="flex-shrink-0 flex -mt-0.5 items-center h-fit">
                                    <FontAwesomeIcon
                                        @click="sidebarOpen = true"
                                        icon="bars"
                                        class="h-5 w-5 block md:hidden"
                                    />

                                    <img
                                        v-if="isCollapsed && !error"
                                        class="h-8 absolute md:block md:left-0 top-1/2 md:-top-1 -translate-y-1/2 md:-translate-y-0 md:translate-x-0 left-1/2 -translate-x-1/2 cursor-pointer"
                                        :src="htoCurrency"
                                        :class="[
                                            { 'xl:translate-x-5': isHidden },
                                            router.currentRoute.value.path.includes('account') && 'mt-2',
                                        ]"
                                        @click="router.push('/')"
                                        alt="Heavenland"
                                    />

                                    <img
                                        v-else
                                        class="h-7 mt-1 absolute md:block md:left-0 top-1 md:translate-x-0 left-1/2 -translate-x-1/2 cursor-pointer"
                                        :src="heavenMarketLogoWhite"
                                        @click="router.push('/')"
                                        alt="Heavenland"
                                    />
                                </div>
                            </div>

                            <div
                                class="flex flex-col xl:flex-row md:items-end mt-8 xl:mt-0 xl:justify-between w-full z-20 relative pt-16 md:pt-0 ease-out"
                                :class="[isCollapsed && !error ? 'md:ml-20' : 'md:ml-64']"
                            >
                                <div
                                    class="flex xl:block flex-grow bg-indigo-930 mt-3 w-full lg:w-auto lg:bg-transparent relative rounded-lg md:mr-0 header-margin-right overflow-hidden h-[36px]"
                                >
                                    <div
                                        class="absolute lg:relative w-full flex flex-col lg:flex-row top-0 left-0 space-x-3 lg:space-y-0 lg:py-0 rotatingInfo select-none"
                                        ref="rotatingInfo"
                                    >
                                        <HeaderSolanaStatus />
                                        <HeaderTradingVolumes />
                                    </div>
                                </div>

                                <div class="hidden md:flex space-x-3 mt-3">
                                    <HeaderMyItemsButton v-if="hasConnectedWallet" />

                                    <HeaderWalletPanel v-if="hasConnectedWallet" />
                                    <HeaderConnectButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="!router.currentRoute.value.path.includes('account')"
                class="hidden md:flex md:flex-col md:fixed z-[8] md:inset-y-0 ease-out"
                :class="[{ 'md:w-0': isHidden }, isCollapsed ? 'md:w-20' : 'md:w-64']"
            >
                <div
                    class="flex-1 flex flex-col min-h-0 bg-indigo-950 border-r border-gray-100 border-opacity-10"
                    v-if="!error"
                >
                    <div class="flex-1 flex flex-col overflow-y-auto">
                        <nav class="flex-1 py-2 pt-4 px-3 mt-16">
                            <LayoutMenu />
                        </nav>
                    </div>

                    <AppRpcOption
                        v-if="!router.currentRoute.value.path.includes('account')"
                        :isCollapsed="isCollapsed"
                    />
                </div>
            </div>

            <div
                class="flex flex-col flex-1 ease-out"
                :class="[
                    { 'xl:pl-0': isHidden },
                    isCollapsed && !error ? 'md:pl-20' : isHidden ? 'md:pl-0' : !error ? 'md:pl-64' : '',
                ]"
            >
                <main
                    id="appMain"
                    :class="[
                        {
                            withoutBg: router.currentRoute.value.path.includes('account'),
                        },
                        router.currentRoute.value.path !== '/' &&
                            'py-5 px-4 pt-10 md:pt-6 sm:px-4 md:px-8 ease-out justify-center flex',
                    ]"
                >
                    <div class="p-10 text-center flex flex-col" v-if="error">
                        <div class="text-center">
                            <img class="max-h-[300px] inline-block" alt="error" :src="err404" />
                        </div>

                        <span class="text-xl text-indigo-700 my-3 text-white font-semibold">{{ error.message }}</span>
                        <div class="mt-6">
                            <AppButton @click="router.push('/')">Back to homepage</AppButton>
                        </div>
                    </div>

                    <NuxtPage v-else @refetch="fetchInformation" />
                </main>
            </div>
        </div>
    </div>

    <div class="absolute bottom-0 text-center px-4 md:px-0 md:right-6 py-3">
        <p class="text-xs text-gray-400">
            Heavenmarket.io powered by
            <a class="hyperlink" href="https://heavenland.io" target="_blank">Heavenland.io</a>
            | © All right reserved 2022 |
            <a class="hyperlink" href="https://heavenland.io/HL-Privacy.pdf" target="_blank">Privacy Policy</a>
        </p>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue';
    import { useWallet } from 'solana-wallets-vue';
    import { computed } from 'vue';
    import { useGlobalInfo } from '@/store/staking/global';
    import { useUserInfo } from '@/store/staking/userPool';
    import { NotificationManager } from '@/types/NotificationManager.types';
    import err404 from '@/assets/404.png';
    import heavenMarketLogoWhite from '@/assets/logo/heavenmarket-white.png';
    import htoCurrency from '@/assets/currency/hto.png';
    import { useAccountStore } from '@/store/account';
    import { useSidebarLayout } from '~/composables/useLayout';
    import { useError, useRouter } from '#app';
    import breakpoints from '@/plugins/breakpoints.client';
    import MyItemsButton from '~/components/header/MyItemsButton.vue';
    import { useBalanceStore } from '~/store/balances';
    import { CollectionList } from '~/types/Collection.data';
    import { CollectionName } from '~/types/Collection.types';
    import { useCollectionStore } from '~/store/collections';
    import { useRoute } from '#app';
    import { useStatsStore } from '~/store/stats';
    import { useParagonStore } from '~/store/paragon';
    import { useTreasuryStore } from '~/store/treasury';

    const currentRoute = useRoute();

    const sidebarOpen = ref(false);
    const { publicKey } = useWallet();
    const accountStore = useAccountStore();
    const { isCollapsed, isHidden } = useSidebarLayout();
    const statsStore = useStatsStore();

    const client = ref(null);

    const NM = NotificationManager.getInstance();
    const error = useError();
    const router = useRouter();

    const rotatingInfo = ref(null);

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    const stakingGlobalStore = useGlobalInfo();
    const stakingUserStore = useUserInfo();
    const balanceStore = useBalanceStore();
    const collectionStore = useCollectionStore();

    const fetchGlobalStakingData = async () => {
        await stakingGlobalStore.fetchGlobal();
        await stakingGlobalStore.fetchStakingStats();
        await stakingGlobalStore.getAllStakers();
    };

    const paragonStore = useParagonStore();
    const treasuryStore = useTreasuryStore();

    const fetchInformation = async () => {
        if (publicKey.value) {
            await paragonStore.fetchOperations();

            await accountStore.fetchTokens(publicKey.value);
            await accountStore.fetchWalletActivity(publicKey.value);

            await stakingUserStore.fetchUser();
        }
    };

    const fetchCollectionMetadata = async () => {
        for (const collectionId of Object.keys(collectionStore.metadata)) {
            if (
                !CollectionList.get(collectionId as CollectionName).isComingSoon &&
                !collectionStore.metadata[collectionId].fetched
            ) {
                await collectionStore.fetchCollectionInfo(collectionId as CollectionName);
            }
        }
    };

    const clearInformation = () => {
        stakingUserStore.clearUser();
        accountStore.clearUser();
        balanceStore.clearUser();
        treasuryStore.clearUser();
        paragonStore.operations.clear();
    };

    watch(publicKey, () => {
        if (publicKey.value) {
            treasuryStore.fetchCashbacks();
            fetchInformation();
            fetchCollectionMetadata();
        } else {
            clearInformation();
        }
    });

    onMounted(async () => {
        statsStore.fetchSwitchboardStats();
        fetchCollectionMetadata();

        await fetchGlobalStakingData();
        fetchInformation();

        if (publicKey.value) {
            treasuryStore.fetchCashbacks();
        }

        const solanaDiv = window.document.getElementById('solanaStatusDiv');
        const tradingVolumes2 = window.document.getElementById('tradingVolumesDiv2');

        function startRotation() {
            setTimeout(() => {
                if (breakpoints().breakpoints.is !== 'lg' && breakpoints().breakpoints.is !== 'xl') {
                    solanaDiv.classList.add('hidden');
                    solanaDiv.classList.remove('flex');
                    tradingVolumes2.classList.add('flex');
                    tradingVolumes2.classList.remove('hidden');
                }
            }, 4500);
            setTimeout(() => {
                if (breakpoints().breakpoints.is !== 'lg' && breakpoints().breakpoints.is !== 'xl') {
                    tradingVolumes2.classList.add('hidden');
                    tradingVolumes2.classList.remove('flex');
                    solanaDiv.classList.add('flex');
                    solanaDiv.classList.remove('hidden');
                }
            }, 9000);
        }

        startRotation();

        setInterval(
            () => {
                startRotation();
            },
            9000,
            true
        );
    });
</script>

<style scoped>
    @keyframes mobileChange {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(calc(-100% / 3));
        }
        100% {
            transform: translateY(calc(-100% / 3));
        }
    }
    .ease-out {
        transition: margin-left, padding-left, width, max-width;
        transition-duration: 0.4s;
    }

    .list-complete-item {
        transition: all 1s;
    }
    .list-complete-enter,
    .list-complete-leave-to {
        opacity: 0;
        transform: translateY(200px);
    }
    .list-complete-leave-active {
        position: absolute;
    }

    @media only screen and (min-width: 1490px) {
        .header-flex {
            flex-direction: row;
        }

        .header-margin-right {
            margin-right: 1.25rem;
        }

        .header-margin-top {
            margin-top: 0;
        }
    }
</style>
