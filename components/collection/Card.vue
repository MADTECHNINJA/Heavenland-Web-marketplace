<template>
    <div
        v-if="!loading"
        class="bg-indigo-920 max-w-sm rounded-lg relative w-full shadow-md"
        :class="{ 'cursor-pointer hover:brightness-125 transition-all': !comingSoon }"
    >
        <div v-if="img" class="relative">
            <div class="rounded-t-xl aspect-square bg-indigo-940 overflow-hidden">
                <img :src="img" alt="Collection image" />
            </div>
        </div>

        <div class="px-3 py-4 flex flex-col items-center">
            <h2 class="text-md leading-6 font-semibold text-gray-100">{{ name }}</h2>

            <div class="flex items-center space-x-2 mt-1">
                <div
                    v-if="totalListed !== null && totalListed !== undefined"
                    class="text-xs font-medium text-gray-200 text-center"
                >
                    {{ totalListed }} listed
                </div>
                <div v-else-if="ownedItems" class="text-xs font-medium text-gray-200 text-center">
                    {{ ownedItems }} owned
                </div>
            </div>
        </div>

        <div
            v-if="comingSoon"
            class="bg-indigo-930 text-white rounded-b-lg text-xs justify-center flex items-center px-3 pt-2 pb-2"
        >
            Coming soon!
        </div>

        <div
            v-else-if="displayPrice"
            class="bg-indigo-930 text-white rounded-b-lg text-xs justify-center flex items-center px-3 pt-2 pb-2"
        >
            Floor price <span class="font-bold ml-1 mr-1">{{ floorPrice ?? '--' }}</span>
            <img alt="Solana" :src="htoCurrency" class="h-4 rounded-full" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';

    defineProps<{
        loading: boolean;
        name: string;
        img: any;
        floorPrice: number | null | string;
        totalListed?: number | null;
        ownedItems?: number | null;
        comingSoon?: boolean;
        redirect?: string;
        displayPrice: boolean;
    }>();
</script>

<style scoped></style>
