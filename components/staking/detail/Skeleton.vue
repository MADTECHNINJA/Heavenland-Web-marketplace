<template>
    <div
        class="flex flex-col space-x-0 lg:space-x-5 lg:flex-row justify-between items-center lg:items-start animate-pulse"
    >
        <div class="relative flex-col flex max-w-md w-full">
            <div
                class="aspect-square bg-indigo-930 overflow-hidden max-w-md w-full mx-auto mb-5 animate-pulse lg:mb-0 rounded-md"
            />
        </div>

        <div class="w-full flex-col">
            <div class="w-[250px] h-7 mx-auto lg:mx-0 rounded-full bg-indigo-930 animate-pulse" />

            <div class="w-[140px] h-6 mt-4 rounded-full mx-auto lg:mx-0 bg-indigo-930 animate-pulse" />
            <div class="rounded-lg w-full mt-8 grid grid-cols-3 gap-3">
                <div class="h-[96px] md:h-[76px] bg-indigo-930 animate-pulse rounded-lg" />
                <div class="h-[96px] md:h-[76px] bg-indigo-930 animate-pulse rounded-lg" />
                <div class="h-[96px] md:h-[76px] bg-indigo-930 animate-pulse rounded-lg" />
            </div>
            <div class="w-full h-[150px] md:h-[300px] mt-6 rounded-lg bg-indigo-930 animate-pulse" />
            <div
                class="h-[96px] hidden md:block md:h-7 bg-indigo-930 mt-[88px] lg:hidden w-[130px] rounded-full mb-8 animate-pulse"
            />
            <div class="w-[140px] h-6 mt-16 rounded-full mx-auto mb-4 md:hidden lg:mx-0 bg-indigo-930 animate-pulse" />
            <div class="w-full h-[400px] md:h-[150px] mt-6 rounded-lg lg:hidden bg-indigo-930 animate-pulse" />
        </div>
    </div>

    <div class="hidden lg:h-7 bg-indigo-930 mt-[50px] lg:block w-60 rounded-full mb-6 animate-pulse" />
    <div class="flex flex-col lg:flex-row space-x-3.5">
        <div
            class="h-[150px] lg:w-full lg:max-w-full hidden lg:block bg-indigo-930 overflow-hidden max-w-md lg:ml-0 mb-5 animate-pulse lg:mb-0 rounded-lg"
        />
        <div
            class="h-[150px] lg:w-full hidden lg:max-w-full lg:block bg-indigo-930 overflow-hidden max-w-md lg:ml-0 mb-5 animate-pulse lg:mb-0 rounded-lg"
        />
        <div
            class="h-[150px] lg:w-full hidden lg:max-w-full lg:block bg-indigo-930 overflow-hidden max-w-md lg:ml-0 mb-5 animate-pulse lg:mb-0 rounded-lg"
        />
    </div>
    <span class="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
</template>

<script lang="ts" setup></script>

<style scoped></style>
