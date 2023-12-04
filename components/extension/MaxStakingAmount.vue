<template>
    <div
        class="bg-indigo-920 text-white rounded-b-lg text-xs justify-center flex items-center px-3 mb-1 py-2.5"
        :class="{ 'opacity-50': disabled }"
    >
        <AppAlert v-if="error" :type="AlertType.ERROR" :text="ErrorMsg.FETCHING_ERROR" />

        <AppSpinner v-else-if="!fetched" />

        <div v-else class="flex justify-center">
            Max stake <span class="font-bold ml-1 mr-1">{{ formatNumberToDecimal(maxStake) }}</span>
            <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from 'assets/currency/hto.png';
    import { ErrorMsg } from '~/locales/core';
    import { formatNumberToDecimal } from '~/js/formatting';
    import { AlertType } from '~/types/Alert.utils';

    defineProps<{
        maxStake: number;
        disabled?: boolean;
        error: boolean;
        fetched: boolean;
    }>();
</script>

<style scoped></style>
