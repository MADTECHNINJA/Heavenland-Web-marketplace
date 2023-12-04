<template>
    <div class="bg-indigo-920 rounded-lg shadow relative max-w-sm w-full">
        <div class="relative">
            <div class="rounded-t-lg aspect-square bg-indigo-940 animate-pulse" />
        </div>
        <div class="h-[72px]">
            <div class="p-5 mt-1 flex flex-col items-center">
                <div class="w-[125px] h-2 bg-indigo-930 rounded-full animate-pulse" />
                <div class="mt-4 w-[75px] h-1.5 bg-indigo-930 rounded-full animate-pulse" />
            </div>
        </div>
        <div v-if="bottomPanel" class="h-[32px] bg-indigo-930 animate-pulse rounded-b-lg" />
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        bottomPanel: boolean;
    }>();
</script>

<style scoped></style>
