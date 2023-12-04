<template>
    <AppAlert v-if="balanceStore.balanceSol.error" :text="ErrorMsg.CONNECTION_ERROR" :type="AlertType.ERROR" />

    <Popover v-else class="relative" v-slot="{ open, close }">
        <PopoverButton
            :class="[
                open ? 'text-gray-900' : 'text-gray-500',
                'group w-full rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none ',
            ]"
        >
            <div class="md:bg-indigo-930 w-full bg-indigo-940 flex rounded-md text-gray-300">
                <div class="flex w-full">
                    <div
                        class="px-4 w-full flex flex-col md:flex-row md:items-center space-x-0 md:space-x-6 space-y-3 md:space-y-0 py-3 md:py-2"
                    >
                        <AppSpinner v-if="!balanceStore.balanceHto.fetched" class="px-2 py-0.5" />
                        <div v-else class="flex w-full justify-between md:justify-start items-center">
                            <div class="flex w-full">
                                <img :src="htoCurrency" alt="HTO" class="h-5 rounded-full mr-2" />
                                <span class="font-semibold text-sm">
                                    {{ balanceStore.balanceHto.getFormattedAmount() }}
                                </span>
                            </div>

                            <FontAwesomeIcon icon="chevron-down" class="h-3.5 ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        </PopoverButton>

        <transition
            v-if="balanceStore.balanceHto.fetched"
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <PopoverPanel
                class="z-50 md:absolute md:-translate-x-1/2 left-1/2 transform mt-3 w-full md:w-[250px] md:max-w-[250px] sm:px-0"
            >
                <div class="rounded-lg drop-shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div class="grid">
                        <div
                            @click="close()"
                            class="col-span-1 relative flex flex-col bg-indigo-920 text-white px-5 py-4"
                        >
                            <HeaderWalletBalance />
                            <HeaderWalletEscrowBalance />
                            <HeaderWalletCashbackBalance />
                        </div>
                    </div>
                </div>
            </PopoverPanel>
        </transition>
    </Popover>
</template>

<script lang="ts" setup>
    import { onMounted, watch } from 'vue';
    import { useWallet } from 'solana-wallets-vue';
    import { useBalanceStore } from '@/store/balances';
    import htoCurrency from '@/assets/currency/hto.png';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '@/locales/core';
    import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

    const { publicKey } = useWallet();
    const balanceStore = useBalanceStore();

    const fetchBalances = () => {
        balanceStore.fetchBalances();
        balanceStore.fetchEscrowBalances();
    };

    onMounted(fetchBalances);

    watch(publicKey, fetchBalances);
</script>

<style scoped></style>
