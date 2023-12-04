<template>
    <div class="flex flex-col px-6 py-3 bg-red-500 bg-opacity-20 w-full">
        <div class="flex items-center space-x-1">
            <FontAwesomeIcon :icon="['far', 'circle-exclamation']" class="mr-1 text-red-500" />
            <p class="text-sm font-semibold text-red-500">You don't have enough funds.</p>
        </div>

        <div class="text-sm text-gray-300 mt-1 ml-6">
            Click
            <NuxtLink :to="{ name: 'swap' }" target="_blank" class="text-indigo-300 underline">here</NuxtLink>
            for HTO swap
        </div>
    </div>
</template>

<script></script>

<style scoped></style>
