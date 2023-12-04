<template>
    <div>
        <AppCardTitle title="Confirmation" icon="check" />

        <div class="flex flex-col md:flex-row items-start justify-between px-6 py-3">
            <div>
                <div class="flex flex-col space-x-1 mt-2 text-sm text-gray-300 max-w-xl leading-5 mr-2">
                    <p>
                        By confirming this stamping, your Paragon NFT & {{ STAMPING_DEFAULT_PRICE }} HTO will be sent
                        from your wallet. Once it's confirmed & stamped, you'll receive this Paragon NFT back.
                    </p>
                </div>
            </div>

            <div class="flex justify-between w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9">
                <AppSecondaryButton icon="chevron-left" @click="previousStep">Back</AppSecondaryButton>
                <AppButton :disabled="!allowToBuy" @click="nextStep" :loading="stampingLoading">Stamp...</AppButton>
            </div>
        </div>

        <AppBannerNotEnoughFunds v-if="!allowToBuy" class="mt-3" />

        <div class="flex flex-col md:flex-row my-6 mx-6 space-y-2 md:space-y-0 md:space-x-2">
            <div class="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <div
                    class="flex flex-col items-center max-w-xs w-auto space-y-1 px-6 py-2 rounded-lg bg-indigo-940 bg-opacity-30"
                >
                    <p class="text-sm text-gray-400 mr-2">Price</p>
                    <p class="flex items-center font-bold text-white text-sm">
                        <span class="mr-1">{{ STAMPING_DEFAULT_PRICE }}</span>
                        <img class="h-4" :src="htoCurrency" alt="Heavenland" />
                    </p>
                </div>

                <div
                    class="flex flex-col items-center max-w-xs w-auto space-y-1 px-6 py-2 rounded-lg bg-indigo-940 bg-opacity-30"
                >
                    <p class="text-sm text-gray-400 mr-2">Duration</p>
                    <p class="flex items-center font-bold text-white text-sm">
                        <span class="mr-1">Minutes</span>
                    </p>
                </div>
            </div>

            <CashbackOperationOverview :amount="STAMPING_DEFAULT_PRICE" class="max-w-xs"/>
        </div>

        <div class="flex flex-col space-x-1 mt-2 text-sm text-gray-300 max-w-xl leading-5 px-6 mb-6">
            <p>If the operation fails, you'll be returned your Paragon NFT & {{ STAMPING_DEFAULT_PRICE }} HTO.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { STAMPING_DEFAULT_PRICE } from '~/types/Paragon.data';
    import { useBalanceStore } from '@/store/balances';
    import { computed } from 'vue';

    const balanceStore = useBalanceStore();

    const allowToBuy = computed(() => {
        return balanceStore.balanceHto.getUnformattedAmount() - STAMPING_DEFAULT_PRICE > 0;
    });

    defineProps<{
        stampingLoading: boolean;
    }>();

    const emits = defineEmits<{
        (e: 'stamp'): void;
        (e: 'return'): void;
    }>();

    const previousStep = () => {
        emits('return');
    };

    const nextStep = () => {
        emits('stamp');
    };
</script>

<style scoped></style>
