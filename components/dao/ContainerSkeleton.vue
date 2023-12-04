<template>
    <div class="grid xl:grid-cols-3 gap-x-6 gap-y-6">
        <div v-for="i in 3" :key="i" class="bg-indigo-930 shadow animate-pulse w-full rounded-lg relative">
            <div class="relative">
                <div class="p-5 bg-indigo-930 flex flex-col items-center rounded-md">
                    <div class="w-[200px] mt-2 h-5 bg-indigo-920 rounded-full animate-pulse"></div>
                    <div class="mt-5 w-[220px] h-7 bg-indigo-920 rounded-full animate-pulse"></div>
                    <div class="mt-5 mb-14 w-[200px] h-5 bg-indigo-920 rounded-full animate-pulse"></div>

                    <div class="bottom-0 w-full absolute h-14 bg-indigo-920 rounded-b-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script></script>

<style></style>
