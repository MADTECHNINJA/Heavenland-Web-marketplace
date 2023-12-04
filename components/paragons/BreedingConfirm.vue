<template>
    <div>
        <AppCardTitle title="Confirmation" icon="check" />
        <div class="flex flex-col md:flex-row items-start justify-between px-6 py-3">
            <div>
                <div class="flex flex-col space-x-1 mt-2 text-sm text-gray-300 max-w-xl leading-5 mr-2">
                    <p>
                        By confirming this breeding, your Paragon NFT & {{ price }} HTO will be sent from your wallet.
                        Once it's confirmed & bred, you'll receive this Paragon NFT back.
                    </p>
                </div>
            </div>

            <div class="flex justify-between w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9">
                <AppSecondaryButton icon="chevron-left" @click="previousStep">Back</AppSecondaryButton>
                <AppButton :disabled="!allowToBuy" @click="nextStep" :loading="loading">Breed...</AppButton>
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
                        <span class="mr-1">{{ price }}</span>
                        <img class="h-4" :src="htoCurrency" alt="Heavenland" />
                    </p>
                </div>

                <div
                    class="flex flex-col items-center max-w-xs w-auto space-y-1 px-6 py-2 rounded-lg bg-indigo-940 bg-opacity-30"
                >
                    <p class="text-sm text-gray-400 mr-2">Duration</p>
                    <p class="flex items-center font-bold text-white text-sm">
                        <span class="mr-1"> {{ duration }} {{ duration > 1 ? ' hours' : ' hour' }}</span>
                    </p>
                </div>
            </div>

            <CashbackOperationOverview :amount="price" class="max-w-xs"/>
        </div>

        <div class="flex flex-col space-x-1 mt-2 text-sm text-gray-300 max-w-xl leading-5 px-6 mb-6">
            <p>If the operation fails, you'll be returned your Paragon NFT & {{ price }} HTO.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { breedingPrice, breedingDuration } from '~/types/Paragon.utils';
    import { computed } from 'vue';
    import { useBalanceStore } from '@/store/balances';

    const balanceStore = useBalanceStore();

    const allowToBuy = computed(() => {
        return balanceStore.balanceHto.getUnformattedAmount() - price.value > 0;
    });

    const props = defineProps<{
        loading: boolean;
        paragons: IParagonBase[];
    }>();

    const emits = defineEmits<{
        (e: 'breed', data: object): void;
        (e: 'return'): void;
    }>();

    const previousStep = () => {
        emits('return');
    };

    const nextStep = () => {
        emits('breed', { price: price.value, duration: duration.value });
    };

    const breedCount = computed(() => {
        return Number(
            props.paragons[0].attributes.find((a) => a.displayName === 'Breed Count').value >
                props.paragons[1].attributes.find((a) => a.displayName === 'Breed Count').value
                ? props.paragons[0].attributes.find((a) => a.displayName === 'Breed Count').value
                : props.paragons[1].attributes.find((a) => a.displayName === 'Breed Count').value
        );
    });

    const price = computed(() => {
        return breedingPrice(breedCount.value);
    });

    const duration = computed(() => {
        return breedingDuration(breedCount.value);
    });
</script>

<style scoped></style>
