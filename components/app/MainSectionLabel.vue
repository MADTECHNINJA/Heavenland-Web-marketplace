<template>
    <div class="flex justify-center lg:justify-start md:pt-4 lg:pt-0">
        <div
            class="text-sm z-40 w-fit mb-1 text-gray-400 text-center lg:text-left transition-all ease-in-out duration-500"
        >
            <span> {{ title }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title: string;
    }>();
</script>

<style></style>
