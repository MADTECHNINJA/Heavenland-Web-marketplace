<template>
    <div
        class="relative block w-full rounded-lg text-center bg-indigo-930 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
        <div class="py-4 px-6">
            <span class="mt-0.5 block text-sm font-semibold" v-if="operation.enterTime && operation.unlockTime">
                {{ operation.enterTime + '/' + operation.unlockTime }}
            </span>
            <span class="mt-1 block text-xs font-medium text-gray-400">{{ operation.status }} / Processing... </span>
            <span class="mt-1 block text-xs font-medium text-gray-400">{{ operation.depositAmount }} </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Breeding, Fusion, Stamping } from '~/types/Paragon.types';

    defineProps<{
        operation: Breeding | Fusion | Stamping;
    }>();
</script>

<style scoped></style>
