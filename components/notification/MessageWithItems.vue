<template>
    <div class="flex flex-col space-y-1">
        <template v-for="(item, index) in data.items" :key="index">
            <div v-if="item.value !== null" class="flex items-center">
                <span class="mr-2 italic font-normal text-gray-200">{{ item.entity }}:</span>

                <NuxtLink
                    v-if="item.type === MessageParamType.SOLSCAN"
                    :to="'https://solscan.io/account/' + item.value"
                    target="_blank"
                >
                    <img :src="solscanLogo" alt="Solscan" class="mr-1 mb-0.5 h-3 w-3 inline-block" />
                </NuxtLink>

                <span class="font-semibold text-gray-100">
                    {{ item.renderFn ? item.renderFn(item.value) : item.value }}
                </span>

                <img
                    v-if="item.type === MessageParamType.HTO"
                    :src="htoCurrency"
                    alt="HTO"
                    class="h-3 ml-1 rounded-full inline-block"
                />
                <img
                    v-else-if="item.type === MessageParamType.SOL"
                    :src="solCurrency"
                    alt="HTO"
                    class="h-3 ml-1 rounded-full inline-block"
                />
                <img
                    v-else-if="item.type === MessageParamType.USDC"
                    :src="usdcCurrency"
                    alt="HTO"
                    class="h-3 ml-1 rounded-full inline-block"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import solCurrency from '@/assets/currency/solana.png';
    import usdcCurrency from '@/assets/currency/usdc.png';
    import solscanLogo from '@/assets/logo/solscan.png';
    import { MessageParam, MessageParamType } from '~/types/Notification.types';

    defineProps<{
        data: {
            items: MessageParam[];
        };
    }>();
</script>

<style scoped></style>
