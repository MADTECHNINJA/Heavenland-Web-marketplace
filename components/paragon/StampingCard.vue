<template>
    <div
        class="relative block w-full rounded-lg text-center md:text-left bg-indigo-930 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
        <div class="flex w-full flex-col justify-center relative aspect-square rounded-lg">
            <div class="flex items-center relative justify-center">
                <img
                    :src="stampingAbstract"
                    class="opacity-70 rounded-t-md z-[2]"
                    :class="`w-full h-full`"
                    alt="Preview"
                />
            </div>
        </div>
        <div class="px-3 py-4 bg-indigo-930 rounded-b-lg flex items-center flex-col justify-end">
            <div class="flex items-center space-x-1.5 mb-1">
                <FontAwesomeIcon :icon="['fas', 'stamp']" class="h-3 w-3 mr-0.5 text-white" />
                <span class="font-bold text-sm">
                    {{ operation.type }}
                </span>
            </div>

            <ParagonOperationCardStatus :operation="operation" />
            <div class="mb-3 px-3 py-2 border border-gray-400 border-opacity-20 w-full m-1 rounded-md text-xs">
                <p class="text-gray-200 text-center font-bold mb-2">Paragon mint</p>
                <div class="flex justify-center">
                    <AppMintSolscanLink :mint="operation.paragon" />
                    <p class="font-normal text-gray-300">
                        {{ formatAddress(operation.paragon) }}
                    </p>
                </div>
            </div>

            <div class="px-3 py-2 border w-full border-gray-400 border-opacity-20 rounded-md text-xs">
                <p class="text-gray-200 text-center font-bold mb-2">Avatar mint</p>
                <div class="flex justify-center">
                    <AppMintSolscanLink :mint="operation.avatar" />
                    <p class="text-gray-300">
                        {{ formatAddress(operation.avatar) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Stamping } from '~/types/Paragon.types';
    import { formatAddress } from '~/js/formatting';
    import stampingAbstract from '@/assets/paragons/abstracts/Paragon_fusion_1.png';

    defineProps<{
        operation: Stamping;
    }>();
</script>

<style scoped></style>
