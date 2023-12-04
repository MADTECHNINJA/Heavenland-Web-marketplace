<template>
    <div v-if="!loading" class="relative rounded-lg shadow-md cursor-pointer hover:brightness-125 transition-all">
        <div v-if="img">
            <div class="rounded-lg relative bg-indigo-940 overflow-hidden">
                <img class="object-cover h-24 w-full" :src="img" alt="Collection image" />
            </div>
        </div>

        <div class="w-full mt-2 text-center">
            <p class="font-semibold text-sm">{{ title }}</p>
            <p class="text-xs text-gray-300">{{ count }} items</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        img: any;
        loading: boolean;
        title: string;
        count: string | number;
    }>();
</script>

<style></style>
