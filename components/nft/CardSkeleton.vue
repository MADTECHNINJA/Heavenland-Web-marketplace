<template>
    <div class="bg-indigo-930 rounded-md shadow relative max-w-sm w-full">
        <div class="relative">
            <div class="rounded-t-md aspect-square bg-indigo-940 animate-pulse"></div>
        </div>
        <div class="h-[52px]">
            <div class="p-5 my-1 flex flex-col items-center">
                <div class="w-[125px] h-2 bg-indigo-920 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div class="h-[32px] bg-indigo-920 animate-pulse rounded-b-md" v-if="price"></div>
    </div>
</template>

<script lang="ts" setup>
    withDefaults(
        defineProps<{
            price?: boolean;
        }>(),
        {
            price: true,
        }
    );
</script>

<style scoped></style>
