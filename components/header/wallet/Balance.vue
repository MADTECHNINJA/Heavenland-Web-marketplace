<template>
    <p class="text-sm font-semibold tracking-normal">Wallet balance</p>

    <div class="flex flex-col bg-indigo-940 bg-opacity-30 rounded-lg py-2 px-3.5 space-y-2 mt-2.5">
        <div class="flex items-center">
            <img :src="htoCurrency" alt="SOL" class="h-5 rounded-full" />
            <span class="ml-1.5 font-semibold text-sm">
                {{ balanceStore.balanceHto.getFormattedAmount() }}
            </span>
        </div>

        <div class="flex items-center">
            <img :src="solanaCurrency" alt="SOL" class="h-5 rounded-full" />
            <span class="ml-1.5 font-semibold text-sm">
                {{ balanceStore.balanceSol.getFormattedAmount() }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useBalanceStore } from '@/store/balances';
    import htoCurrency from '@/assets/currency/hto.png';
    import solanaCurrency from '@/assets/currency/solana.png';

    const balanceStore = useBalanceStore();
</script>

<style scoped></style>
