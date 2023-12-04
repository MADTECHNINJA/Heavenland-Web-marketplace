<template>
    <div v-if="!hasConnectedWallet" class="w-full">
        <AppActionCard :type="AlertType.ERROR" icon="house" class="mt-6">
            <template #title>Wallet not connected!</template>
            <template #desc> Connect your wallet to gain access to your account.</template>
        </AppActionCard>
    </div>

    <div v-else class="w-full">
        <div
            ref="accountHeader"
            class="px-4 justify-center mt-5 xl:mt-0 md:px-12 py-6 bg-indigo-930 rounded-xl flex flex-col items-center w-full"
            :style="{ 'background-image': 'url(' + bgImg + ')' }"
        >
            <img alt="HTO" :src="avatar" class="h-24 w-24" />
            <AppTitle class="mt-2.5">My account</AppTitle>
            <div class="flex items-center justify-center space-x-2">
                <a
                    href="https://account.heavenland.io"
                    target="_blank"
                    class="text-sm cursor-pointer px-3 py-1 bg-gradient-to-r from-indigo-900 to-indigo-920 rounded-lg flex items-center space-x-1.5"
                >
                    <img :src="heavenaccount" class="h-3 w-3" alt="Heavenaccount" />
                    <p class="text-xs text-white">My Heavenaccount</p>
                </a>

                <div class="flex items-center h-12 space-x-1">
                    <div
                        v-if="domain"
                        class="text-xs px-3 py-1 bg-gradient-to-r from-indigo-900 to-indigo-920 rounded-lg flex items-center space-x-1.5"
                    >
                        <FontAwesomeIcon :icon="['fad', 'wallet']" class="h-3 w-3 mr-1.5" />
                        {{ domain }}
                    </div>
                    <div
                        v-else-if="publicKey"
                        class="text-xs px-3 py-1 bg-gradient-to-r from-indigo-900 to-indigo-920 rounded-lg flex items-center space-x-1.5"
                    >
                        <FontAwesomeIcon :icon="['fad', 'wallet']" class="h-3 w-3" />
                        <p class="text-xs text-white">{{ formatAddress(publicKey.toBase58()) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex">
            <div
                class="hidden md:flex md:flex-col fixed left-3 top-12 xl:top-6 xl:left-auto xl:relative"
                :class="[isCollapsed ? 'md:w-20' : 'md:w-64']"
                ref="accountSidebar"
            >
                <div class="flex-1 flex flex-col h-full bg-indigo-950 xl:border-r border-gray-100 border-opacity-10">
                    <div class="flex-1 flex flex-col overflow-y-auto">
                        <nav :class="[isCollapsed ? 'pt-10' : 'pt-10']" class="flex-1 py-2 pr-6">
                            <LayoutMenu />
                        </nav>
                    </div>
                    <div :class="[isCollapsed ? 'md:w-20' : 'md:w-64']" class="mr-5 fixed pt-10 bottom-0 lg:-ml-2">
                        <AppRpcOption transparent :isCollapsed="isCollapsed" />
                    </div>
                </div>
            </div>
            <div class="hidden" :class="[isCollapsed ? 'md:w-20' : 'md:w-64']" ref="accountFakeSidebar"></div>

            <div class="flex flex-col flex-1 py-5 lg:p-5">
                <main class="w-full mx-auto py-5 md:px-8 lg:pt-10 flex flex-col">
                    <slot />
                </main>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import avatar from '@/assets/avatar.png';
    import { useSidebarLayout } from '~/composables/useLayout';
    import { useWallet } from 'solana-wallets-vue';
    import { ref, onMounted, watch, computed } from 'vue';
    import breakpoints from '@/plugins/breakpoints.client';
    import bgImg from '@/assets/background.png';
    import { useAccountStore } from '~/store/account';
    import { AlertType } from '~/types/Alert.utils';
    import heavenaccount from '@/assets/logo/heavenaccount.png';
    import { formatAddress } from '~/js/formatting';
    import * as web3 from '@solana/web3.js';
    import { getAllDomains, getFavoriteDomain, performReverseLookup } from '@bonfida/spl-name-service';
    import { useConnection } from '~/composables/useAccount';

    const { isCollapsed } = useSidebarLayout();
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const accountStore = useAccountStore();

    const scroll = ref(false);

    const accountHeader = ref(null);
    const accountSidebar = ref(null);
    const accountFakeSidebar = ref(null);
    const scrollStick = ref(0);
    const allDomainNames = ref(null);

    const hasConnectedWallet = computed(() => {
        return publicKey.value;
    });

    watch(publicKey, () => {
        if (publicKey.value) {
            getSolDomainName();
        }
    });

    const fetchWalletActivity = () => {
        if (publicKey.value && !accountStore.walletActivity.fetched) {
            accountStore.fetchWalletActivity(publicKey.value);
        }
    };

    const getSolDomainName = async () => {
        const ownerWallet = new web3.PublicKey(publicKey.value.toBase58());
        const domain = await getFavoriteDomain(connection.value, ownerWallet);

        if (domain?.reverse) {
            allDomainNames.value = domain.reverse;
        } else {
            const allDomainKeys = await getAllDomains(connection.value, ownerWallet);
            allDomainNames.value = await Promise.all(
                allDomainKeys.map((key) => {
                    return performReverseLookup(connection.value, key);
                })
            );
        }
    };

    const domain = computed(() => {
        return typeof allDomainNames.value === 'string'
            ? `${allDomainNames.value}.sol`
            : allDomainNames?.value?.length > 1
            ? allDomainNames?.value[0]
            : null;
    });

    watch(publicKey.value, fetchWalletActivity);

    const scrollFixing = () => {
        if (accountHeader.value !== null && window.document.getElementById('appHeader') !== null)
            scrollStick.value =
                accountHeader.value.clientHeight + window.document.getElementById('appHeader').clientHeight - 7;
        if (
            accountHeader.value !== null &&
            window.document.getElementById('appHeader') !== null &&
            accountSidebar.value !== null &&
            accountFakeSidebar.value !== null &&
            breakpoints().breakpoints.is === 'xl'
        ) {
            if (Math.round(window.scrollY) > scrollStick.value) {
                if (!scroll.value) {
                    accountSidebar.value.classList.remove('xl:relative');
                    accountSidebar.value.classList.add('xl:top-14');
                    accountFakeSidebar.value.classList.remove('hidden');
                }
                scroll.value = true;
            } else {
                scroll.value = false;
                accountSidebar.value.classList.add('xl:relative');
                accountFakeSidebar.value.classList.add('hidden');
                accountSidebar.value.classList.remove('xl:top-14');
            }
        }
    };

    onMounted(() => {
        fetchWalletActivity();

        getSolDomainName();

        scrollFixing();

        window.addEventListener('scroll', () => {
            scrollFixing();
        });
        window.addEventListener('resize', () => {
            breakpoints().setBreakpoint();
        });
    });
</script>

<style scoped></style>
